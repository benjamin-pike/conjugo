// External
import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { z } from "zod";

// Utils
import { exclude, include } from "../utils/object.utils";
import { randomElement, randomElementNotPrevious } from "../utils/math.utils";

// Assets
import validLanguages, {
	languagesConst as validLanguagesConst
} from "../assets/languages.assets";
import { tensesConst as validTensesConst } from "../assets/tenses.assets";
import infinitives from "../assets/verbs.assets";

const prisma = new PrismaClient();

const validSubjects = [
	"firstSingular",
	"secondSingular",
	"thirdSingular",
	"firstPlural",
	"secondPlural",
	"thirdPlural"
] as const;

// @desc   Get the current practice configuration that is stored in the database
// @route  GET /practice/configure/:language
// @access Private
// @params language: string
export const getPracticeConfig = async (req: Request, res: Response) => {
	const { language } = req.params;

	if (!validLanguages.includes(language)) return res.sendStatus(404);

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
// @body   { language: string, subjects: string[], tenses: string[], verbs: int, target: int, time: int }
export const updatePracticeConfig = async (req: Request, res: Response) => {
	const { language } = req.params;

    if (!validLanguages.includes(language)) return res.sendStatus(404);

	const practicePayload = z.object({
		language: z.enum(validLanguagesConst),
		subjects: z.array(z.enum(validSubjects)),
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

    if (!validLanguages.includes(language)) return res.sendStatus(404);

    const configData = await prisma.practiceConfig.findUnique({
        where: {
            userId_language: {
                userId: req.body.user.id,
                language: language
            }
        }
    });

    if (!configData) return res.sendStatus(500);

    const { subjects, tenses, verbs, target } = configData

    const output: {
			subject: string;
			tense: string;
			infinitive: string;
			conjugation?: string;
            translation?: string;
		}[] = [];

    const availableInfinitives = infinitives[language].slice(0, verbs);

    while (output.length < target) { // Generate the practice session
        const subject: string = // Select a random subject, but not the same as the previous one (if possible)
					subjects.length === 1
						? subjects[0]
						: randomElementNotPrevious(subjects, output.at(-1)?.subject);

        const tenseRoot: string = // Select a random tense root, but not the same as the previous one (if possible)
                    tenses.length === 1
                        ? tenses[0]
                        : randomElementNotPrevious(tenses, output.at(-1)?.tense);

        const [complexity, mood, tense]: string[] = tenseRoot.split("-"); // Split the tense root into its constituent parts
 
        const infinitive: string = // If possible, choose a random infinitive that has not been used yet
					availableInfinitives.length < 0
						? randomElement(availableInfinitives)
						: randomElementNotPrevious(
								infinitives[language].slice(0, target),
								output.at(-1)?.infinitive
						  );

        const verbData = await prisma.verbCorpus.findUnique({ // Fetch the conjugations and translations of the chosen infinitive from the database
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
        })

        if (!verbData) return res.sendStatus(500);

        // const { conjugations, translations }: { conjugations: Conjugations, translations: Translations} = verbData;
        
        // const conjugation: string | undefined = conjugations[complexity][mood][tense][subject];
        // const translation: string = translations.principal;
        
        // If valid, add to the output array and remove infinitive from the available infinitive array
        // If (conjugation){
            availableInfinitives.splice(availableInfinitives.indexOf(infinitive), 1);
            output.push({ 
                infinitive,
                subject, 
                tense: tenseRoot, 
                // conjugation: conjugation,
                // translation: translation
            });
        //}

    }

    return res.json(output);
};

export const calculatePracticeResults = async (
	req: Request,
	res: Response
) => {};
