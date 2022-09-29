import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { exclude } from '../utils/object.utils';
import validVerbs from '../assets/infinitives.assets';

const prisma = new PrismaClient()

// @desc   Get all conjugations of a given verb
// @route  GET /reference/conjugations/:language/:verb
// @access Private
// @params language: string, verb: string
export const getConjugations = async (req: Request, res: Response) => {
    const { language, verb } = req.params;
    const verbData = await prisma.verbCorpus.findUnique({
        where: { language_infinitive: { language, infinitive: verb } }
    })

    if (!verbData) return res.sendStatus(500)
    
    res.json( exclude(verbData, ['id']) );
}

// @desc   Get array of saved verbs for a given language
// @route  GET /reference/saved/:language/
// @access Private
// @params language: string
export const getSavedVerbs = async (req: Request<{ language: string }>, res: Response) => {
    const { language } = req.params;

    if (!validVerbs[language]) return res.sendStatus(404)

    const data = await prisma.savedVerbs.findUnique({
        where: { userId: req.body.user.id },
        select: { [language]: true }
    }) as { [key: string]: string[] };

    if (!data) return res.sendStatus(500)

    res.json(data[language]);
}

// @desc   Add a verb to the saved verbs array for a given language
// @route  PUT or DELETE /reference/saved/:language/
// @access Private
// @params language: string, verb: string
export const updatedSavedVerbs = async (req: Request, res: Response) => {
    const { language, verb } = req.params;

    if (!validVerbs[language] || !validVerbs[language].includes(verb) ) 
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
        data: { [language]: savedVerbs },
        select: { [language]: true }
    })
    
    if (!updatedArray) return res.sendStatus(500)

    res.json(updatedArray)
}