"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateStarred = exports.getStarred = exports.getConjugations = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
// @desc   Get all conjugations of a given verb
// @route  GET /reference/conjugations/:language/:verb
// @access Private
const getConjugations = async (req, res) => {
    const { language, verb } = req.params;
    // get conjugations from database using prisma
    const v = await prisma.verb.create({
        data: {
            infinitive: verb,
            rank: 1
        }
    });
    const verbData = await prisma.verb.findFirst({
        where: {
            infinitive: verb
        }
    });
    console.log(verbData);
    res.send(200);
    // get verb from database using prisma
    // insert language into verb object using spread operator and send to client using res.json
};
exports.getConjugations = getConjugations;
// @desc   Get array of starred verbs for a given language
// @route  GET /reference/starred/:language/
// @access Private
const getStarred = async (req, res) => {
    const { language } = req.params;
    // get starred verbs from database using prisma
    // send to client using res.json
};
exports.getStarred = getStarred;
// @desc   Add a verb to the starred verbs array for a given language
// @route  PUT /reference/starred/:language/
// @access Private
const updateStarred = async (req, res) => {
    const { language, verb } = req.params;
    // get starred verbs from database using prisma
    if (req.method === 'PUT') {
        // add verb to starred verbs array
    }
    if (req.method === 'DELETE') {
        // remove verb from starred verbs array
    }
    // update database using prisma
    // send to client using res.json
};
exports.updateStarred = updateStarred;
