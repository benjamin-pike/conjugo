import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { randomElementNotPrevious } from "../utils/math.utils";

const prisma = new PrismaClient()

const questionFormats = [
    "alert",
    "match-conjugations",
    "match-translations",
    "select-conjugations-tense",
    "select-conjugation-subject",
    "select-subject-audio",
    "select-subject-text",
    "select-translation-audio",
    "select-translation-text",
    "type-conjugation-audio",
    "type-conjugation-subject"
]

// @desc   Create a practice session for a given language
// @route  GET /practice/:language/:complexity/:mood/:tense
export const lesson = async (req: Request, res: Response) => {
    const { language, complexity, mood, tense } = req.params;

    const output: {
        format: string,
        infinitive: string,
    }[] = []

    let knownVerbs = await prisma.userProgress.findUnique({
        where: {
            userId_language: {
                userId: req.body.user.id,
                language,
            }
        },
        select: { knownVerbs : true }
    }).then(data => data?.knownVerbs);

    if (!knownVerbs) {
        try {
            await prisma.userProgress.create({
                data: {
                    userId: req.body.user.id,
                    language,
                }
            });

            knownVerbs = 3
        }
        
        catch { return res.sendStatus(500) }
    }

    let candidateInfinitives = await prisma.verb.findMany({
        where: { 
            rank : { lte: knownVerbs},
            language
        },
        select: { infinitive: true }
    }).then(data => data.map(verb => verb.infinitive));
   
    while (output.length < 20) {
        const prevQuestion = output.at(-1)
        const selectedFormat = randomElementNotPrevious(
            questionFormats, 
            prevQuestion?.format.split('-')[0] === 'alert' 
                ? output.at(-2)?.format
                : prevQuestion?.format
        )
        
        if (selectedFormat.split('-')[0] === output.at(-2)?.format.split('-')[0])
            continue;

        if (selectedFormat.split('-')[0] === 'alert' && (output.length < 3 || output.length > 17))
            continue;

        let selectedInfinitive: string = 
            randomElementNotPrevious(candidateInfinitives, prevQuestion?.infinitive)

        if (prevQuestion?.format.split('-')[0] === 'alert')
            selectedInfinitive = prevQuestion.infinitive

        if (selectedFormat.split('-')[0] === 'alert'){
            knownVerbs++

            const newInfinitive = await prisma.verb.findUnique({
                where: {
                    language_rank: {
                        language,
                        rank: knownVerbs
                    }
                },
                select: { infinitive: true }
            })

            if (!newInfinitive) continue;

            selectedInfinitive = newInfinitive.infinitive

            candidateInfinitives.push(selectedInfinitive)
        }

        candidateInfinitives.splice(candidateInfinitives.indexOf(selectedInfinitive), 1)

        if (candidateInfinitives.length === 0) {
            candidateInfinitives = await prisma.verb.findMany({
                where: { 
                    rank : { lte: knownVerbs},
                    language
                },
                select: { infinitive: true }
            }).then(data => data.map(verb => verb.infinitive));
        }

        output.push({
            format: selectedFormat,
            infinitive: selectedInfinitive
        })
    }

    const updatedKnownVerbs = await prisma.userProgress.update({
        where: {
            userId_language: {
                userId: req.body.user.id,
                language,
            }
        },
        data: { knownVerbs }
    })

    if (!updatedKnownVerbs) return res.sendStatus(500);

    res.json(output)
}