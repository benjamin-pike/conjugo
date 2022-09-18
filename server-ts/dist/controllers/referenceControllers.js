"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateStarred = exports.getStarred = exports.getConjugations = void 0;
const conjugations_1 = __importDefault(require("../assets/conjugations"));
// @desc   Get all conjugations of a given verb
// @route  GET /reference/conjugations/:language/:verb
// @access Private
const getConjugations = async (req, res) => {
    const { language, verb } = req.params;
    const verbData = conjugations_1.default[language] && conjugations_1.default[language][verb];
    res.send(Object.assign({ language, verb }, verbData));
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
