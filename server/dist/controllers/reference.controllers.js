"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateSavedVerbs = exports.getSavedVerbs = exports.getConjugations = void 0;
const client_1 = require("@prisma/client");
const object_utils_1 = require("../utils/object.utils");
const infinitives_assets_1 = __importDefault(require("../assets/infinitives.assets"));
const prisma = new client_1.PrismaClient();
// @desc   Get all conjugations of a given verb
// @route  GET /reference/conjugations/:language/:verb
// @access Private
// @params { language: string, verb: string }
const getConjugations = async (req, res) => {
    const { language, verb } = req.params;
    const verbData = await prisma.verb.findUnique({
        where: { language_infinitive: { language, infinitive: verb } }
    });
    if (!verbData)
        return res.sendStatus(500);
    res.json((0, object_utils_1.exclude)(verbData, ['id']));
};
exports.getConjugations = getConjugations;
// @desc   Get array of saved verbs for a given language
// @route  GET /reference/saved/:language/
// @access Private
// @params { language: string }
const getSavedVerbs = async (req, res) => {
    const { language } = req.params;
    if (!infinitives_assets_1.default[language])
        return res.sendStatus(404);
    const data = await prisma.savedVerbs.findUnique({
        where: { userId: req.body.user.id },
        select: { [language]: true }
    });
    if (!data)
        return res.sendStatus(500);
    res.json(data[language]);
};
exports.getSavedVerbs = getSavedVerbs;
// @desc   Add a verb to the saved verbs array for a given language
// @route  PUT or DELETE /reference/saved/:language/
// @access Private
// @params { language: string, verb: string }
const updateSavedVerbs = async (req, res) => {
    const { language, verb } = req.params;
    if (!infinitives_assets_1.default[language] || !infinitives_assets_1.default[language].includes(verb))
        return res.sendStatus(404);
    let data = await prisma.savedVerbs.findUnique({
        where: { userId: req.body.user.id },
        select: { [language]: true }
    });
    if (!data)
        return res.sendStatus(500);
    const savedVerbs = data[language];
    if (req.method === 'PUT') {
        if (!savedVerbs.includes(verb))
            savedVerbs.push(verb);
    }
    if (req.method === 'DELETE') {
        const index = savedVerbs.indexOf(verb);
        if (index > -1)
            savedVerbs.splice(index, 1);
    }
    const updatedArray = await prisma.savedVerbs.update({
        where: { userId: req.body.user.id },
        data: { [language]: savedVerbs },
        select: { [language]: true }
    });
    if (!updatedArray)
        return res.sendStatus(500);
    res.json(updatedArray[language]);
};
exports.updateSavedVerbs = updateSavedVerbs;
