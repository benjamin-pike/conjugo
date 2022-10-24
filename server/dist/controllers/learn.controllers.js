"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.results = exports.lesson = exports.progress = void 0;
const client_1 = require("@prisma/client");
const math_utils_1 = require("../utils/math.utils");
const math_utils_2 = require("../utils/math.utils");
const object_utils_1 = require("../utils/object.utils");
const prisma = new client_1.PrismaClient();
const questionFormats = [
    "alert",
    "match-conjugations",
    "match-translations",
    "select-conjugation-tense",
    "select-conjugation-subject",
    "select-subject-audio",
    "select-subject-text",
    "select-translation-audio",
    "select-translation-text",
    "type-conjugation-audio",
    "type-conjugation-subject"
];
const formatComponent = ['action', 'answer', 'prompt'];
const collatedSubjects = {
    spanish: [
        "yo",
        "tú",
        ["él", "ella", "usted"],
        "nosotros",
        "vosotros",
        ["ellos", "ellas", "ustedes"]
    ],
    french: [
        "je",
        "tu",
        ["il", "elle", "on"],
        "nous",
        "vous",
        ["ils", "elles"]
    ],
    german: [
        "ich",
        "du",
        ["er", "sie", "es"],
        "wir",
        "ihr",
        "Sie"
    ],
    italian: [
        "io",
        "tu",
        ["lui", "lei"],
        "noi",
        "voi",
        "loro"
    ],
    portuguese: [
        "eu",
        "tu",
        ["ele", "ela"],
        "nós",
        "vós",
        ["eles", "elas"]
    ],
};
// @desc   Get lesson progress for a specific language
// @route  GET /progress/:language
// @access Private
// @params language
const progress = async (req, res) => {
    const { language } = req.params;
    const progressDataArray = await prisma.user.findUnique({
        where: { id: req.body.user.id },
        select: { UserProgress: true }
    }).then(data => data === null || data === void 0 ? void 0 : data.UserProgress);
    if (!progressDataArray)
        return res.sendStatus(500);
    let progressData = progressDataArray.find(entry => entry.language === language);
    let extractedData = progressData
        ? (0, object_utils_1.include)(progressData, ['lessonXP', 'lastLesson'])
        : { lessonXP: [0], lastLesson: 0 };
    if (extractedData.lessonXP[extractedData.lessonXP.length - 1] >= 200) // 200 XP == Level 5
        extractedData.lessonXP.push(0);
    res.json(extractedData);
};
exports.progress = progress;
// @desc   Create lesson data for a given language
// @route  GET /lesson/:language/
// @access Private
// @params language
// @body   complexity, mood, tense, lessonIndex
const lesson = async (req, res) => {
    const { language } = req.params;
    const { complexity, mood, tense, lessonIndex } = req.body;
    const lesson = [];
    let progressData = await prisma.userProgress.findUnique({
        where: {
            userId_language: {
                userId: req.body.user.id,
                language,
            }
        }
    });
    if (!progressData) {
        try {
            progressData = await prisma.userProgress.create({
                data: {
                    userId: req.body.user.id,
                    language,
                }
            });
        }
        catch (_a) {
            return res.sendStatus(500);
        }
    }
    let knownVerbs = progressData.knownVerbs;
    let candidateInfinitives = await prisma.verb.findMany({
        where: {
            rank: { lte: knownVerbs },
            language
        },
        select: { infinitive: true }
    }).then(data => data.map(verb => verb.infinitive));
    if (progressData.lessonXP[lessonIndex] === 0)
        lesson.push({
            format: { action: 'introduction' },
            infinitive: '',
            content: { tense: `${complexity}-${mood}-${tense}` }
        });
    if (progressData.lessonXP[0] === 0) // If user has no lesson XP, send specialised first lesson
        lesson.push(...await generateFirstLesson(res, language, candidateInfinitives));
    while (lesson.length < 15) {
        const prevQuestion = lesson.at(-1); // undefined if lesson is empty
        const antePrevQuestion = lesson.at(-2); // undefined if lesson is empty or has only one element
        const selectedFormatString = (0, math_utils_1.randomElementNotPrevious)(questionFormats, prevQuestion === null || prevQuestion === void 0 ? void 0 : prevQuestion.format);
        const format = Object.fromEntries(selectedFormatString.split('-').map((component, index) => [formatComponent[index], component])); // Convert format string to object with keys 'action', 'answer', 'prompt'
        if (format.action === (antePrevQuestion === null || antePrevQuestion === void 0 ? void 0 : antePrevQuestion.format.action))
            continue; // Prevent three consecutive questions of the same action
        if (format.action === 'match' && ((prevQuestion === null || prevQuestion === void 0 ? void 0 : prevQuestion.format.action) === 'match' || (antePrevQuestion === null || antePrevQuestion === void 0 ? void 0 : antePrevQuestion.format.action) === 'match'))
            continue; // Prevent frequent match questions
        if (format.action === 'alert' && (lesson.length < 3 || lesson.length > 13))
            continue; // New verb alerts should not be within the first or last two questions
        if (knownVerbs < 6 && format.action === 'match' && format.answer === 'translations')
            continue; // Do not select match-translations if user knows fewer than 6 verbs
        let infinitive = (0, math_utils_1.randomElementNotPrevious)(candidateInfinitives, (prevQuestion === null || prevQuestion === void 0 ? void 0 : prevQuestion.infinitive) !== ''
            ? prevQuestion === null || prevQuestion === void 0 ? void 0 : prevQuestion.infinitive
            : antePrevQuestion === null || antePrevQuestion === void 0 ? void 0 : antePrevQuestion.infinitive);
        if ((prevQuestion === null || prevQuestion === void 0 ? void 0 : prevQuestion.format.action) === 'alert') {
            if (format.action === 'match' && format.answer === 'translations')
                continue; // Do not select match-translations if previous question was alert
            infinitive = prevQuestion.infinitive; // Test new verb following alert
        }
        if (format.action === 'alert' && (antePrevQuestion === null || antePrevQuestion === void 0 ? void 0 : antePrevQuestion.format.action) === 'alert')
            continue; // If either of previous two questions are alerts, do not select alert 
        if (language === 'french' && format.prompt === 'audio' && format.answer !== 'translation')
            continue; // French conjugations are often audibly indistinguishable, hence this is not a good question format
        if (format.action === 'match' && format.answer === 'translations')
            infinitive = ''; // Match-translations do not require an infinitive
        if (format.action === 'alert') {
            knownVerbs++; // Increase known verbs by one for each new verb alert
            const newInfinitive = await prisma.verb.findUnique({
                where: {
                    language_rank: {
                        language,
                        rank: knownVerbs
                    }
                },
                select: { infinitive: true }
            }); // Select new verb data for alert
            if (!newInfinitive)
                continue;
            infinitive = newInfinitive.infinitive;
            candidateInfinitives.push(infinitive);
        }
        if (infinitive !== '') // Remove selected infinitive from candidate infinitives
            candidateInfinitives.splice(candidateInfinitives.indexOf(infinitive), 1);
        if (candidateInfinitives.length === 0) {
            candidateInfinitives = await prisma.verb.findMany({
                where: { language, rank: { lte: knownVerbs } },
                select: { infinitive: true }
            }).then(data => data.map(verb => verb.infinitive));
        }
        let content;
        switch (format.action) {
            case 'match':
                content = await generateMatch(res, format.answer, language, infinitive, [complexity, mood, tense], knownVerbs, candidateInfinitives);
                break;
            case 'select':
                content = await generateSelect(res, { answer: format.answer, prompt: format.prompt }, language, infinitive, [complexity, mood, tense], knownVerbs);
                break;
            case 'type':
                content = await generateType(res, { answer: format.answer, prompt: format.prompt }, language, infinitive, [complexity, mood, tense]);
                break;
            case 'alert':
                content = await generateAlert(res, language, infinitive, [complexity, mood, tense]);
                break;
            default:
                return res.sendStatus(500);
        }
        lesson.push({
            format,
            infinitive,
            content,
        });
    }
    const updatedKnownVerbs = await prisma.userProgress.update({
        where: {
            userId_language: {
                userId: req.body.user.id,
                language,
            }
        },
        data: { knownVerbs }
    });
    if (!updatedKnownVerbs)
        return res.sendStatus(500);
    return res.json(lesson);
};
exports.lesson = lesson;
// @desc   Get results for a lesson
// @route  POST /results/:language
// @access Private
// @params language
// @body   user, lessonIndex, bonus
const results = async (req, res) => {
    const { language } = req.params;
    const { user, lessonIndex, bonus } = req.body;
    const progressDataArray = await prisma.user.findUnique({
        where: { id: user.id },
        select: { UserProgress: true }
    }).then(data => data === null || data === void 0 ? void 0 : data.UserProgress);
    if (!progressDataArray)
        return res.sendStatus(500);
    let progressData = progressDataArray.find(progress => progress.language === language);
    if (!progressData)
        progressData = await prisma.userProgress.create({
            data: {
                userId: user.id,
                language,
            }
        });
    const updatedProgressData = await prisma.userProgress.update({
        where: {
            userId_language: {
                userId: user.id,
                language
            }
        },
        data: {
            totalXP: progressData.totalXP + 10 + bonus,
            lessonXP: Object.assign([], progressData.lessonXP, {
                [lessonIndex]: progressData.lessonXP[lessonIndex]
                    ? progressData.lessonXP[lessonIndex] + 10 + bonus
                    : 10 + bonus
            }),
            lastLesson: lessonIndex
        }
    });
    if (!updatedProgressData)
        return res.sendStatus(500);
    return res.json({
        totalXP: {
            current: progressData.totalXP,
            new: progressData.totalXP + 10,
            bonus,
        },
        lessonXP: updatedProgressData.lessonXP,
        lastLesson: updatedProgressData.lastLesson
    });
};
exports.results = results;
// Functions required to generate question content
async function generateMatch(res, type, language, infinitive, tenseRoot, knownVerbs, candidateInfinitives) {
    const output = { pairs: [] };
    if (type === 'translations') {
        const pool = candidateInfinitives && candidateInfinitives.length >= 6
            ? candidateInfinitives
            : await prisma.verb.findMany({
                where: { language, rank: { lte: knownVerbs && knownVerbs >= 6 ? knownVerbs : 6 } },
            }).then(data => data.map(verb => verb.infinitive));
        const infinitives = pool.sort(() => Math.random() - 0.5).slice(0, 6);
        output.pairs = await Promise.all(infinitives.map(async (infinitive) => {
            const translations = await prisma.verb.findUnique({
                where: { language_infinitive: { infinitive, language } },
                select: { translations: true }
            }).then(data => data === null || data === void 0 ? void 0 : data.translations);
            if (!translations)
                return res.sendStatus(500);
            return [
                infinitive,
                `to ${translations.principal}`
            ];
        }));
    }
    if (type === 'conjugations') {
        const conjugations = await prisma.verb.findUnique({
            where: { language_infinitive: { infinitive, language } },
            select: { conjugations: true }
        }).then(data => data === null || data === void 0 ? void 0 : data.conjugations);
        if (!conjugations)
            return res.sendStatus(500);
        const [complexity, mood, tense] = tenseRoot;
        output.pairs = collatedSubjects[language].map(subject => {
            const selectedSubject = typeof subject === 'string' ? subject : (0, math_utils_2.randomElement)(subject);
            return [selectedSubject, conjugations[complexity][mood][tense][selectedSubject]];
        });
    }
    return output;
}
async function generateSelect(res, type, language, infinitive, tenseRoot, knownVerbs) {
    let output = {
        card: '',
        options: []
    };
    if (type.answer === 'conjugation' || type.answer === 'subject') {
        const conjugationData = await prisma.verb.findUnique({
            where: { language_infinitive: { language, infinitive } },
            select: { conjugations: true }
        }).then(data => data === null || data === void 0 ? void 0 : data.conjugations);
        if (!conjugationData)
            return res.sendStatus(500);
        const [complexity, mood, tense] = tenseRoot;
        const conjugations = conjugationData[complexity][mood][tense];
        if (type.answer === 'conjugation' && type.prompt === 'tense') {
            const correctCount = (0, math_utils_2.randomNumber)(2, 4);
            const incorrectSubjectCount = (0, math_utils_2.randomNumber)(1, 5 - correctCount);
            const incorrectTenseCount = 6 - (correctCount + incorrectSubjectCount);
            const alternativeTenses = (0, object_utils_1.exclude)(conjugationData[complexity][mood], [tense]);
            const correct = getCorrectConjugations(correctCount, conjugations);
            const incorrect = getIncorrectConjugations({ subjects: incorrectSubjectCount, tenses: incorrectTenseCount }, conjugations, correct, alternativeTenses);
            output.card = infinitive;
            output.tense = tenseRoot.join('-');
            output.options = [...correct, ...incorrect];
        }
        if (type.answer === 'subject' || type.prompt === 'subject') {
            const selectedPairs = Object.entries(Object.entries(conjugations)
                .reduce((opts, [subject, conjugation]) => {
                if (opts[conjugation])
                    opts[conjugation].push(subject);
                else
                    opts[conjugation] = [subject];
                return opts;
            }, {}))
                .map(([conjugation, subjects]) => ({ subject: (0, math_utils_2.randomElement)(subjects), conjugation })).sort(() => Math.random() - 0.5);
            if (type.prompt === 'subject') {
                output.card = infinitive;
                output.subject = selectedPairs[0].subject;
                output.options = selectedPairs.map(({ conjugation }, index) => ({ main: conjugation, correct: index === 0 }));
            }
            if (type.answer === 'subject') {
                output.card = selectedPairs[0].conjugation;
                output.options = selectedPairs.map(({ subject }, index) => ({ prefix: subject, correct: index === 0 }));
            }
        }
    }
    if (type.answer === 'translation') {
        const allTranslations = await prisma.verb.findMany({
            where: { language, rank: { lte: knownVerbs && knownVerbs > 6 ? knownVerbs : 6 } },
            select: { infinitive: true, translations: true }
        }).then(data => data === null || data === void 0 ? void 0 : data.map(verb => ({ infinitive: verb.infinitive, translations: verb === null || verb === void 0 ? void 0 : verb.translations })));
        if (!allTranslations)
            return res.sendStatus(500);
        const correctTranslation = allTranslations.filter(({ infinitive: verb }) => verb === infinitive)[0].translations.principal;
        const options = { [correctTranslation]: infinitive };
        while (Object.keys(options).length < 6) {
            const { infinitive, translations } = (0, math_utils_2.randomElement)(allTranslations);
            if (options[translations.principal])
                continue;
            options[translations.principal] = infinitive;
        }
        const translateToEnglish = type.prompt === 'audio' || Math.random() > 0.5;
        output.card = translateToEnglish ? options[correctTranslation] : 'to ' + correctTranslation;
        output.options = translateToEnglish
            ? Object.entries(options).map(([translation, _infinitive]) => ({ prefix: 'to', main: translation, correct: translation === correctTranslation }))
            : Object.entries(options).map(([translation, infinitive]) => ({ main: infinitive, correct: translation === correctTranslation }));
    }
    output.options = output.options.sort(() => Math.random() - 0.5);
    return output;
}
async function generateType(res, type, language, infinitive, tenseRoot) {
    const output = { card: '', answer: '' };
    const conjugationData = await prisma.verb.findUnique({
        where: { language_infinitive: { language, infinitive } },
        select: { conjugations: true }
    }).then(data => data === null || data === void 0 ? void 0 : data.conjugations);
    if (!conjugationData)
        return res.sendStatus(500);
    const [complexity, mood, tense] = tenseRoot;
    const conjugations = conjugationData[complexity][mood][tense];
    const subjectsByConjugation = Object.entries(conjugations).reduce((obj, [subject, conjugation]) => {
        if (obj[conjugation])
            obj[conjugation].push(subject);
        else
            obj[conjugation] = [subject];
        return obj;
    }, {});
    const conjugation = (0, math_utils_2.randomElement)(Object.keys(subjectsByConjugation));
    output.card = conjugation;
    if (type.prompt === 'subject') {
        output.card = infinitive;
        output.subject = (0, math_utils_2.randomElement)(subjectsByConjugation[conjugation]);
    }
    output.answer = conjugation;
    return output;
}
async function generateAlert(res, language, infinitive, tenseRoot) {
    const output = {
        conjugations: [],
        translation: '',
        regularity: ''
    };
    const data = await prisma.verb.findUnique({
        where: { language_infinitive: { language, infinitive } },
        select: {
            conjugations: true,
            translations: true,
            regularity: true
        }
    });
    if (!data)
        return res.sendStatus(500);
    const [complexity, mood, tense] = tenseRoot;
    output.translation = data.translations.principal;
    output.regularity = data.regularity;
    const conjugations = data.conjugations[complexity][mood][tense];
    output.conjugations =
        collatedSubjects[language].map((subjects) => [
            Array.isArray(subjects)
                ? language !== 'italian'
                    ? `${subjects[0]} • ${subjects[1]}`
                    : subjects[0]
                : subjects,
            conjugations[Array.isArray(subjects) ? subjects[0] : subjects],
        ]);
    return output;
}
function getCorrectConjugations(num, conjugations) {
    const output = {};
    while (Object.keys(output).length < num) {
        const subject = (0, math_utils_2.randomElement)(Object.keys(conjugations));
        if (Object.values(output).includes(conjugations[subject]))
            continue;
        output[subject] = conjugations[subject];
    }
    return Object.entries(output).map(([subject, conjugation]) => ({
        prefix: subject, main: conjugation, correct: true
    }));
}
function getIncorrectConjugations(num, conjugations, correct, alternativeTenses) {
    const output = {};
    const usedSubjects = correct.map(({ prefix }) => prefix);
    const remainingSubjects = Object.keys(conjugations).filter(subject => !usedSubjects.includes(subject));
    while (Object.keys(output).length < num.subjects) { // 
        const subject = (0, math_utils_2.randomElement)(remainingSubjects);
        const conjugation = (0, math_utils_1.randomElementNotPrevious)(Array.from(new Set(Object.values(conjugations))), conjugations[subject]);
        remainingSubjects.splice(remainingSubjects.indexOf(subject), 1);
        output[subject] = conjugation;
    }
    while (Object.keys(output).length < num.subjects + num.tenses) {
        const subject = (0, math_utils_2.randomElement)(remainingSubjects);
        const tense = (0, math_utils_2.randomElement)(Object.keys(alternativeTenses));
        const conjugation = alternativeTenses[tense][subject];
        if (conjugations[subject] === conjugation)
            continue;
        remainingSubjects.splice(remainingSubjects.indexOf(subject), 1);
        output[subject] = alternativeTenses[tense][subject];
    }
    return Object.entries(output).map(([subject, conjugation]) => ({
        prefix: subject, main: conjugation, correct: false
    }));
}
async function generateFirstLesson(res, language, candidateInfinitives) {
    return await Promise.all([
        {
            format: { action: 'alert' },
            infinitive: candidateInfinitives[0],
            content: await generateAlert(res, language, candidateInfinitives[0], ['simple', 'indicative', 'present'])
        },
        {
            format: { action: 'select', answer: 'conjugation', prompt: 'subject' },
            infinitive: candidateInfinitives[0],
            content: await generateSelect(res, { answer: 'conjugation', prompt: 'subject' }, language, candidateInfinitives[0], ['simple', 'indicative', 'present'])
        },
        {
            format: { action: 'match', answer: 'conjugations' },
            infinitive: candidateInfinitives[0],
            content: await generateMatch(res, 'conjugations', language, candidateInfinitives[0], ['simple', 'indicative', 'present'])
        },
        {
            format: { action: 'select', answer: 'translation', prompt: 'text' },
            infinitive: candidateInfinitives[0],
            content: await generateSelect(res, { answer: 'translation', prompt: 'text' }, language, candidateInfinitives[0], ['simple', 'indicative', 'present'])
        },
        {
            format: { action: 'type', answer: 'conjugation', prompt: 'subject' },
            infinitive: candidateInfinitives[0],
            content: await generateType(res, { answer: 'conjugation', prompt: 'subject' }, language, candidateInfinitives[0], ['simple', 'indicative', 'present'])
        },
        {
            format: { action: 'alert' },
            infinitive: candidateInfinitives[1],
            content: await generateAlert(res, language, candidateInfinitives[1], ['simple', 'indicative', 'present'])
        },
        {
            format: { action: 'select', answer: 'translation', prompt: 'audio' },
            infinitive: candidateInfinitives[1],
            content: await generateSelect(res, { answer: 'translation', prompt: 'audio' }, language, candidateInfinitives[1], ['simple', 'indicative', 'present'])
        },
        {
            format: { action: 'match', answer: 'conjugations' },
            infinitive: candidateInfinitives[1],
            content: await generateMatch(res, 'conjugations', language, candidateInfinitives[1], ['simple', 'indicative', 'present'])
        },
        {
            format: { action: 'select', answer: 'conjugation', prompt: 'tense' },
            infinitive: candidateInfinitives[1],
            content: await generateSelect(res, { answer: 'conjugation', prompt: 'tense' }, language, candidateInfinitives[1], ['simple', 'indicative', 'present'])
        },
        {
            format: { action: 'type', answer: 'conjugation', prompt: 'audio' },
            infinitive: candidateInfinitives[1],
            content: await generateType(res, { answer: 'conjugation', prompt: 'audio' }, language, candidateInfinitives[1], ['simple', 'indicative', 'present'])
        },
        {
            format: { action: 'alert' },
            infinitive: candidateInfinitives[2],
            content: await generateAlert(res, language, candidateInfinitives[2], ['simple', 'indicative', 'present'])
        },
        {
            format: { action: 'type', answer: 'conjugation', prompt: 'subject' },
            infinitive: candidateInfinitives[2],
            content: await generateType(res, { answer: 'conjugation', prompt: 'subject' }, language, candidateInfinitives[2], ['simple', 'indicative', 'present'])
        },
        {
            format: { action: 'select', answer: 'conjugation', prompt: 'subject' },
            infinitive: candidateInfinitives[2],
            content: await generateSelect(res, { answer: 'conjugation', prompt: 'subject' }, language, candidateInfinitives[2], ['simple', 'indicative', 'present'])
        },
        {
            format: { action: 'match', answer: 'conjugations' },
            infinitive: candidateInfinitives[2],
            content: await generateMatch(res, 'conjugations', language, candidateInfinitives[2], ['simple', 'indicative', 'present'])
        },
        {
            format: { action: 'select', answer: 'translation', prompt: 'text' },
            infinitive: candidateInfinitives[2],
            content: await generateSelect(res, { answer: 'translation', prompt: 'text' }, language, candidateInfinitives[2], ['simple', 'indicative', 'present'])
        }
    ]);
}
