import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import VerbCorpus from '../assets/conjugations'

const prisma = new PrismaClient()

// @desc   Get all conjugations of a given verb
// @route  GET /reference/conjugations/:language/:verb
// @access Private
export const getConjugations = async (req: Request, res: Response) => {
    const { language, verb } = req.params;
    const verbData = VerbCorpus[language] && VerbCorpus[language][verb];
    
    res.send({ language, verb, ...verbData });
}

// @desc   Get array of starred verbs for a given language
// @route  GET /reference/starred/:language/
// @access Private
export const getSavedVerbs = async (req: Request<{ language: string }>, res: Response) => {
    const { language } = req.params;

    if (!VerbCorpus[language]) return res.sendStatus(404)

    const data = await prisma.savedVerbs.findUnique({
        where: { userId: req.body.user.id },
        select: { [language]: true }
    }) as { [key: string]: string[] };

    if (!data) return res.sendStatus(500)

    res.json(data[language]);
}

// @desc   Add a verb to the starred verbs array for a given language
// @route  PUT or DELETE /reference/starred/:language/
// @access Private
export const updatedSavedVerbs = async (req: Request, res: Response) => {
    const { language, verb } = req.params;

    if (!VerbCorpus[language] || !VerbCorpus[language][verb] ) 
        return res.sendStatus(404)

    let data = await prisma.savedVerbs.findUnique({
        where: { userId: req.body.user.id },
        select: { [language]: true }
    }) as { [key: string]: string[] };

    if (!data) return res.sendStatus(500)

    const savedVerbs = data[language]

    if (req.method === 'PUT') {
        if (!savedVerbs.includes(verb)) savedVerbs.push(verb)
    }

    if (req.method === 'DELETE') {
        const index = savedVerbs.indexOf(verb)
        if (index > -1) savedVerbs.splice(index, 1)
    }

    const updatedArray = await prisma.savedVerbs.update({
        where: { userId: req.body.user.id },
        data: { [language]: savedVerbs }
    })
    
    if (!updatedArray) return res.sendStatus(500)

    res.sendStatus(200)
}