import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import VerbCorpus from '../assets/conjugations'
import { exclude } from '../utils/object.utils';

const prisma = new PrismaClient()

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

export const updatePracticeConfig = async (req: Request, res: Response) => {}

export const generatePracticeSession = async (req: Request, res: Response) => {}

export const calculatePracticeResults = async (req: Request, res: Response) => {}