"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculatePracticeResults = exports.generatePracticeSession = exports.updatePracticeConfig = exports.getPracticeConfig = void 0;
const client_1 = require("@prisma/client");
const zod_1 = require("zod");
// Utils
const object_utils_1 = require("../utils/object.utils");
const math_utils_1 = require("../utils/math.utils");
// Assets
const tenses_assets_1 = __importStar(require("../assets/tenses.assets"));
const infinitives_assets_1 = __importStar(require("../assets/infinitives.assets"));
const languages_assets_1 = __importStar(require("../assets/languages.assets"));
const subjects_assets_1 = require("../assets/subjects.assets");
const prisma = new client_1.PrismaClient();
// @desc   Get the current practice configuration that is stored in the database
// @route  GET /practice/configure/:language
// @access Private
// @params { language: string }
const getPracticeConfig = async (req, res) => {
    const { language } = req.params;
    if (!languages_assets_1.default.includes(language))
        return res.sendStatus(400);
    const configExisting = await prisma.practiceConfig.findUnique({
        where: {
            userId_language: {
                userId: req.body.user.id,
                language: language
            }
        }
    });
    if (configExisting)
        return res.json((0, object_utils_1.exclude)(configExisting, ["id", "userId"]));
    const configNew = await prisma.practiceConfig.create({
        data: {
            userId: req.body.user.id,
            language: language
        }
    });
    if (configNew)
        return res.json((0, object_utils_1.exclude)(configNew, ["id", "userId"]));
    return res.sendStatus(500);
};
exports.getPracticeConfig = getPracticeConfig;
// @desc   Update the practice configuration that is stored in the database
// @route  PUT /practice/configure/:language
// @access Private
// @params { language: string }
// @body   { language: string, subjects: string[], tenses: string[], verbs: int, target: int, time: int }
const updatePracticeConfig = async (req, res) => {
    const { language } = req.params;
    if (!languages_assets_1.default.includes(language))
        return res.sendStatus(404);
    const practicePayload = zod_1.z.object({
        language: zod_1.z.enum(languages_assets_1.languagesConst),
        subjects: zod_1.z.array(zod_1.z.enum(subjects_assets_1.subjectsGenericConst)),
        tenses: zod_1.z.array(zod_1.z.enum(tenses_assets_1.tensesConst[language])),
        verbs: zod_1.z.number().int().min(10).max(2000),
        target: zod_1.z.number().int().min(5).max(50),
        time: zod_1.z.number().int().min(30).max(300)
    });
    const parsedData = practicePayload.safeParse((0, object_utils_1.include)(req.body, [
        "language",
        "subjects",
        "tenses",
        "verbs",
        "target",
        "time"
    ]));
    if (!parsedData.success)
        return res.sendStatus(400);
    const updatedConfig = await prisma.practiceConfig.update({
        where: {
            userId_language: {
                userId: req.body.user.id,
                language: language
            }
        },
        data: parsedData.data
    });
    if (!updatedConfig)
        return res.sendStatus(500);
    res.sendStatus(200);
};
exports.updatePracticeConfig = updatePracticeConfig;
const generatePracticeSession = async (req, res) => {
    var _a;
    const { language } = req.params;
    if (!languages_assets_1.default.includes(language))
        return res.sendStatus(400);
    const configData = await prisma.practiceConfig.findUnique({
        where: {
            userId_language: {
                userId: req.body.user.id,
                language: language
            }
        }
    });
    if (!configData)
        return res.sendStatus(500);
    const { subjects, tenses, verbs, target, time } = configData;
    const content = [];
    const availableInfinitives = infinitives_assets_1.default[language].slice(0, verbs);
    while (content.length < target) {
        // Generate the practice session
        const previousEntry = content.at(-1);
        const genericSubject = // Select a generic subject...
         subjects.length === 1 // ... if only one subject is selected
            ? subjects[0] // ... select that subject
            : (0, math_utils_1.randomElementNotPrevious)(
            // ... else get a random subject
            subjects, subjects_assets_1.mapSpecificToGeneric[language][(_a = previousEntry === null || previousEntry === void 0 ? void 0 : previousEntry.subject) !== null && _a !== void 0 ? _a : ""] // If there is a previous subject, exclude it from selection
            );
        const subject = // Based on the generic subject, select a specific subject
         subjects_assets_1.mapGenericToSpecific[language][genericSubject].length === 1 // If only one specific subject is available...
            ? subjects_assets_1.mapGenericToSpecific[language][genericSubject][0] // ... select that specific subject
            : (0, math_utils_1.randomElement)(subjects_assets_1.mapGenericToSpecific[language][genericSubject]); // ... else select a random specific subject
        const tenseRoot = // Select a random tense root, but not the same as the previous one (if possible)
         tenses.length === 1
            ? tenses[0]
            : (0, math_utils_1.randomElementNotPrevious)(tenses, previousEntry === null || previousEntry === void 0 ? void 0 : previousEntry.tense);
        const [complexity, mood, tense] = tenseRoot.split("-"); // Split the tense root into its constituent parts
        const infinitive = // If possible, choose a random infinitive that has not been used yet
         availableInfinitives.length > 0
            ? (0, math_utils_1.randomElement)(availableInfinitives)
            : (0, math_utils_1.randomElementNotPrevious)(infinitives_assets_1.default[language].slice(0, target), previousEntry === null || previousEntry === void 0 ? void 0 : previousEntry.infinitive);
        const verbData = await prisma.verb.findUnique({
            // Fetch the conjugations and translations of the chosen infinitive from the database
            where: {
                language_infinitive: {
                    language: language,
                    infinitive: infinitive
                }
            },
            select: {
                conjugations: true,
                translations: true
            }
        });
        if (!verbData)
            return res.sendStatus(500);
        const translations = verbData.translations;
        const conjugations = verbData.conjugations;
        const conjugation = conjugations[complexity][mood][tense][subject];
        const translation = translations.principal;
        // If valid, add to the content array and remove infinitive from the available infinitive array
        if (conjugation) {
            content.push({
                infinitive,
                subject,
                tense: tenseRoot,
                conjugation: conjugation,
                translation: translation
            });
            availableInfinitives.splice(availableInfinitives.indexOf(infinitive), 1);
        }
    }
    return res.json({ content, target, time });
};
exports.generatePracticeSession = generatePracticeSession;
// @desc   Calculate the score of a practice session
// @route  POST /practice/results/:language
// @access Private
// @params { language: string }
// @body   { results: { infinitive: string, subject: string, tense: string, accuracy: number, time: number, hinted: boolean }[] }
const calculatePracticeResults = async (req, res) => {
    const { language } = req.params;
    if (!languages_assets_1.default.includes(language))
        return res.sendStatus(400);
    const resultsPayload = zod_1.z.array(zod_1.z.object({
        infinitive: zod_1.z.enum(infinitives_assets_1.infinitivesConst[language]),
        subject: zod_1.z.enum(subjects_assets_1.subjectsConst[language]),
        tense: zod_1.z.enum(tenses_assets_1.tensesConst[language]),
        accuracy: zod_1.z.number().min(0).max(1),
        time: zod_1.z.number().int(),
        hinted: zod_1.z.boolean()
    }));
    const parsedData = resultsPayload.safeParse(req.body.results);
    if (!parsedData.success)
        return res.sendStatus(500);
    const performance = parsedData.data;
    const meanAccuracy = performance.reduce((acc, curr) => acc + curr.accuracy, 0) / performance.length; // (0-1)
    const config = await prisma.practiceConfig.findUnique({
        where: {
            userId_language: {
                userId: req.body.user.id,
                language: language
            }
        }
    });
    if (!config)
        return res.sendStatus(500);
    const { subjects, tenses, verbs, target, time } = config;
    // Normalize the config variables (0-1)
    const subjectsNormalized = subjects.length / 6;
    const tensesNormalized = tenses.length / tenses_assets_1.default[language].length;
    const verbsNormalized = verbs / 2000;
    const pressure = 0.5 * ((target / 50) + (300 / (time * 10)));
    // Score variables according to formulae
    const subjectScore = (Math.log10(subjectsNormalized + 0.1) + (subjectsNormalized ** 0.8) + 1) / (Math.log10(1.1) + 2);
    const tenseScore = (Math.log10(tensesNormalized + 0.1) + (tensesNormalized ** 0.75) + 1) / (Math.log10(1.1) + 2);
    const verbScore = (Math.log10(verbsNormalized + 0.04) + (verbsNormalized ** 0.6) + 1.5) / (Math.log10(1.04) + 2.5);
    const pressureScore = (0.9 * (pressure ** 2.5)) + 0.1;
    // Combine variable scores into single, normalized score
    const configScore = (1 / 3) * (subjectScore + tenseScore + verbScore) * pressureScore;
    // Calculate the new XP value based on the accuracy and config complexity  
    const xpData = await prisma.xp.findUnique({
        where: { userId: req.body.user.id },
        select: { [language]: true }
    });
    if (!xpData)
        return res.sendStatus(500);
    const currentXP = xpData[language];
    const newXP = currentXP + Math.round(100 * configScore * meanAccuracy) * 5;
    const updatedXP = await prisma.xp.update({
        where: { userId: req.body.user.id },
        data: { [language]: newXP }
    });
    if (!updatedXP)
        return res.sendStatus(500);
    return res.json({
        xp: { current: currentXP, new: newXP },
        accuracy: meanAccuracy,
        config: {
            subjects: [subjects.length, subjectsNormalized * 100],
            tenses: [tenses.length, tensesNormalized * 100],
            verbs: [verbs, 100 * verbs ** 0.5 / 2000 ** 0.5],
            target: [target, 100 * target / 50],
            time: [time, 100 * (330 - time) / 300]
        }
    });
};
exports.calculatePracticeResults = calculatePracticeResults;
