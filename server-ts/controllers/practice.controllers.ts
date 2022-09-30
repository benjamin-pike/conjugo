// External
import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { z } from "zod";

// Utils
import { exclude, include } from "../utils/object.utils";
import { randomElement, randomElementNotPrevious } from "../utils/math.utils";

// Types
import { Conjugations, Translations } from "../types/verbs.types";

// Assets
import validTenses, { tensesConst as validTensesConst } from "../assets/tenses.assets";
import infinitives, { infinitivesConst } from "../assets/infinitives.assets";
import validLanguages, {
	languagesConst as validLanguagesConst
} from "../assets/languages.assets";
import {
	mapSpecificToGeneric as mapSubjectSpecificToGeneric,
	mapGenericToSpecific as mapSubjectGenericToSpecific,
    subjectsConst as validSubjectsConst,
    subjectsGenericConst as validSubjectsGeneric
} from "../assets/subjects.assets";

const prisma = new PrismaClient();


// @desc   Get the current practice configuration that is stored in the database
// @route  GET /practice/configure/:language
// @access Private
// @params { language: string }
export const getPracticeConfig = async (req: Request, res: Response) => {
	const { language } = req.params;

	if (!validLanguages.includes(language)) return res.sendStatus(400);

	const configExisting = await prisma.practiceConfig.findUnique({
		where: {
			userId_language: {
				userId: req.body.user.id,
				language: language
			}
		}
	});

	if (configExisting)
		return res.json(exclude(configExisting, ["id", "userId"]));

	const configNew = await prisma.practiceConfig.create({
		data: {
			userId: req.body.user.id as string,
			language: language
		}
	});

	if (configNew) return res.json(exclude(configNew, ["id", "userId"]));

	return res.sendStatus(500);
};

// @desc   Update the practice configuration that is stored in the database
// @route  PUT /practice/configure/:language
// @access Private
// @params { language: string }
// @body   { language: string, subjects: string[], tenses: string[], verbs: int, target: int, time: int }
export const updatePracticeConfig = async (req: Request, res: Response) => {
	const { language } = req.params;

	if (!validLanguages.includes(language)) return res.sendStatus(404);

	const practicePayload = z.object({
		language: z.enum(validLanguagesConst),
		subjects: z.array(z.enum(validSubjectsGeneric)),
		tenses: z.array(z.enum(validTensesConst[language])),
		verbs: z.number().int().min(10).max(2000),
		target: z.number().int().min(5).max(50),
		time: z.number().int().min(30).max(300)
	});

	const parsedData = practicePayload.safeParse(
		include(req.body, [
			"language",
			"subjects",
			"tenses",
			"verbs",
			"target",
			"time"
		])
	);

	if (!parsedData.success) return res.sendStatus(400);

	const updatedConfig = await prisma.practiceConfig.update({
		where: {
			userId_language: {
				userId: req.body.user.id,
				language: language
			}
		},
		data: parsedData.data
	});

	if (!updatedConfig) return res.sendStatus(500);

	res.sendStatus(200);
};

export const generatePracticeSession = async (req: Request, res: Response) => {
	const { language } = req.params;

	if (!validLanguages.includes(language)) return res.sendStatus(400);

	const configData = await prisma.practiceConfig.findUnique({
		where: {
			userId_language: {
				userId: req.body.user.id,
				language: language
			}
		}
	});

	if (!configData) return res.sendStatus(500);

	const { subjects, tenses, verbs, target } = configData;

	const output: {
		subject: string;
		tense: string;
		infinitive: string;
		conjugation?: string;
		translation?: string;
	}[] = [];

	const availableInfinitives = infinitives[language].slice(0, verbs);

	while (output.length < target) {
		// Generate the practice session
		const previousEntry = output.at(-1);

		const genericSubject: string = // Select a generic subject...
			subjects.length === 1 // ... if only one subject is selected
				? subjects[0] // ... select that subject
				: randomElementNotPrevious(
						// ... else get a random subject
						subjects,
						mapSubjectSpecificToGeneric[language][previousEntry?.subject ?? ""] // If there is a previous subject, exclude it from selection
				  );
		const subject: string = // Based on the generic subject, select a specific subject
			mapSubjectGenericToSpecific[language][genericSubject].length === 1 // If only one specific subject is available...
				? mapSubjectGenericToSpecific[language][genericSubject][0] // ... select that specific subject
				: randomElement(mapSubjectGenericToSpecific[language][genericSubject]); // ... else select a random specific subject

		const tenseRoot: string = // Select a random tense root, but not the same as the previous one (if possible)
			tenses.length === 1
				? tenses[0]
				: randomElementNotPrevious(tenses, previousEntry?.tense);

		const [complexity, mood, tense]: string[] = tenseRoot.split("-"); // Split the tense root into its constituent parts

		const infinitive: string = // If possible, choose a random infinitive that has not been used yet
			availableInfinitives.length > 0
				? randomElement(availableInfinitives)
				: randomElementNotPrevious(
						infinitives[language].slice(0, target),
						previousEntry?.infinitive
				  );

		const verbData = await prisma.verb.findUnique({
			// Fetch the conjugations and translations of the chosen infinitive from the database
			where: {
				language_infinitive: {
					language: language,
					infinitive: infinitive
				}
			},
			select: {
				conjugations: true,
				translations: true
			}
		});

		if (!verbData) return res.sendStatus(500);

		const translations = verbData.translations as unknown as Translations;
		const conjugations = verbData.conjugations as unknown as Conjugations;

		const conjugation: string | undefined =
			conjugations[complexity][mood][tense][subject];
		const translation = translations.principal;

		// If valid, add to the output array and remove infinitive from the available infinitive array
		if (conjugation) {
			output.push({
				infinitive,
				subject,
				tense: tenseRoot,
				conjugation: conjugation,
				translation: translation
			});
			availableInfinitives.splice(availableInfinitives.indexOf(infinitive), 1);
		}
	}

	return res.json(output);
};

// @desc   Calculate the score of a practice session
// @route  POST /practice/results/:language
// @access Private
// @params { language: string }
// @body   { results: { infinitive: string, subject: string, tense: string, accuracy: number, time: number, hinted: boolean }[] }
export const calculatePracticeResults = async (req: Request, res: Response) => {

    const { language } = req.params;

    if (!validLanguages.includes(language)) return res.sendStatus(400);

    const resultsPayload = z.array(
			z.object({
                infinitive: z.enum(infinitivesConst[language]),
                subject: z.enum(validSubjectsConst[language]),
                tense: z.enum(validTensesConst[language]),
				accuracy: z.number().min(0).max(1),
				time: z.number().int(),
				hinted: z.boolean()
			})
		);

    const parsedData = resultsPayload.safeParse(req.body.results);

    if (!parsedData.success) return res.sendStatus(500)

    const performance = parsedData.data;

    const meanAccuracy = performance.reduce((acc, curr) => acc + curr.accuracy, 0) / performance.length; // (0-1)

    const config = await prisma.practiceConfig.findUnique({
        where: {
            userId_language: {
                userId: req.body.user.id,
                language: language
            }
        }
    })

    if (!config) return res.sendStatus(500); 

    const { subjects, tenses, verbs, target, time } = config;
    
    // Normalize the config variables (0-1)
    const subjectsNormalized = subjects.length / 6;
    const tensesNormalized = tenses.length / validTenses[language].length;
    const verbsNormalized = verbs / 2000;
    const pressure = 0.5 * ( (target / 50) + (300 / ( time * 10 )) )

    // Score variables according to formulae
    const subjectScore = ( Math.log10(subjectsNormalized + 0.1) + (subjectsNormalized ** 0.8) + 1 ) / ( Math.log10(1.1) + 2 )
    const tenseScore = ( Math.log10(tensesNormalized + 0.1) + (tensesNormalized ** 0.75) + 1 ) / ( Math.log10(1.1) + 2 )
    const verbScore = ( Math.log10(verbsNormalized + 0.04) + (verbsNormalized ** 0.6) + 1.5 ) / ( Math.log10(1.04) + 2.5 )
    const pressureScore = ( 0.9 * ( pressure ** 2.5 ) ) + 0.1

    // Combine variable scores into single, normalized score
    const configScore = ( 1/3 ) * ( subjectScore + tenseScore + verbScore ) * pressureScore

    // Calculate the new XP value based on the accuracy and config complexity  
    const xpData = await prisma.xp.findUnique({
        where: { userId: req.body.user.id },
        select: { [language]: true }
    }) as { [key: string]: number };

    if (!xpData) return res.sendStatus(500);

    const currentXP = xpData[language];
    const newXP = currentXP + Math.round(100 * configScore * meanAccuracy) * 5

    const updatedXP = await prisma.xp.update({
        where: { userId: req.body.user.id },
        data: { [language]: newXP }
    });

    if (!updatedXP) return res.sendStatus(500);

    return res.json({
        xp: { current: currentXP, new: newXP },
        accuracy: meanAccuracy,
        config: { // Tuples contain true (absolute) values and the adjusted (relative) values displayed on the results sliders
            subjects: [subjects.length, subjectsNormalized * 100],
            tenses: [tenses.length, tensesNormalized * 100],
            verbs: [verbs, 100 * verbs ** 0.5 / 2000 ** 0.5],
            target: [target, 100 * target / 50],
            time: [time, 100 * (330 - time) / 300]
        }
    })
};