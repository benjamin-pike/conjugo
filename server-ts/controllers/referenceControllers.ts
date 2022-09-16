import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// @desc   Get all conjugations of a given verb
// @route  GET /reference/conjugations/:language/:verb
// @access Private
const getConjugations = async (req: Request, res: Response) => {
    const { language, verb } = req.params;

    // get conjugations from database using prisma
    const v = await prisma.verb.create({
        data: {
            infinitive: verb,
            rank: 1
    }});
    const verbData = await prisma.verb.findFirst({
        where: {
            infinitive: verb
        }
    })

    console.log(verbData)
    res.send(200)
    // get verb from database using prisma
    // insert language into verb object using spread operator and send to client using res.json
}

// @desc   Get array of starred verbs for a given language
// @route  GET /reference/starred/:language/
// @access Private
const getStarred = async (req: Request, res: Response) => {
    const { language } = req.params;
    // get starred verbs from database using prisma
    // send to client using res.json
}

// @desc   Add a verb to the starred verbs array for a given language
// @route  PUT /reference/starred/:language/
// @access Private
const updateStarred = async (req: Request, res: Response) => {
    const { language, verb } = req.params;
    // get starred verbs from database using prisma

    if ( req.method === 'PUT' ) {
        // add verb to starred verbs array
    }

    if ( req.method === 'DELETE' ) {
        // remove verb from starred verbs array
    }

    // update database using prisma
    // send to client using res.json
}

export { getConjugations, getStarred, updateStarred };