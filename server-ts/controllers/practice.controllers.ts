import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { VerbCorpus } from '../assets/conjugations'
import { tenses as validTenses } from '../assets/tenses'
import { z } from 'zod'
import { exclude, include } from '../utils/object.utils';

const prisma = new PrismaClient()

const validLanguages = ['spanish', 'french', 'german', 'italian', 'portuguese'] as const
const validSubjects = ['firstSingular, secondSingular, thirdSingular, firstPlural, secondPlural, thirdPlural'] as const

const practicePayload = z.object({
    language: z.enum( validLanguages ),
    subjects: z.array( z.enum( validSubjects ) ),
    tenses: z.array( z.string() ),
    verbs: z.number().int().min( 10 ).max( 2000 ),
    target: z.number().int().min( 5 ).max( 50 ),
    time: z.number().int().min( 30 ).max( 300 )
})

export const getPracticeConfig = async (req: Request, res: Response) => {

    const { language } = req.params;

    if (!VerbCorpus[language]) return res.sendStatus(404)

    const configExisting = await prisma.practiceConfig.findUnique({
        where: {
            userId_language: {
                userId: req.body.user.id,
                language: language
            }
        }
    })

    if (configExisting) return res.json( exclude(configExisting, ['id', 'userId']) )

    const configNew = await prisma.practiceConfig.create({
        data: {
            userId: req.body.user.id as string,
            language: language,
        }
    })

    if (configNew) return res.json( exclude(configNew, ['id', 'userId']) )

    return res.sendStatus(500)
}

export const updatePracticeConfig = async (req: Request, res: Response) => {
    
    const { language } = req.params;

    if (!VerbCorpus[language]) return res.sendStatus(404)

    const data = include( req.body, ['language', 'subjects', 'tenses', 'verbs', 'target', 'time'] );

    const parsedData = practicePayload.safeParse(data)

    if (!parsedData.success) return res.sendStatus(400)

    if (parsedData.data.tenses.some( tense => !validTenses[language].includes(tense) )) 
        return res.sendStatus(400)

    res.sendStatus(200)
}

export const generatePracticeSession = async (req: Request, res: Response) => {}

export const calculatePracticeResults = async (req: Request, res: Response) => {}