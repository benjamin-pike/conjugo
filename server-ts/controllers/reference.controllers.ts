import { Request, Response } from 'express';
import VerbCorpus from '../assets/conjugations'

// @desc   Get all conjugations of a given verb
// @route  GET /reference/conjugations/:language/:verb
// @access Private
const getConjugations = async (req: Request, res: Response) => {
    const { language, verb } = req.params;
    const verbData = VerbCorpus[language] && VerbCorpus[language][verb];
    
    res.send({ language, verb, ...verbData });
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
