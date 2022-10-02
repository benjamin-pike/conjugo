import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { randomElementNotPrevious } from "../utils/math.utils";
import { Conjugations, Translations } from "../types/verbs.types";
import { randomElement, randomNumber } from "../utils/math.utils";
import { exclude } from "../utils/object.utils";

const prisma = new PrismaClient()

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
]

const formatComponent: string[] = ['action', 'answer', 'prompt']

const collatedSubjects: { [key: string]: (string | string[])[] } = {
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
}

// @desc   Create a practice session for a given language
// @route  GET /practice/:language/:complexity/:mood/:tense
// @access Public
// @params language: string, complexity: string, mood: string, tense: string
export const lesson = async (req: Request, res: Response) => {
    const { language, complexity, mood, tense } = req.params;

    const output: {
        format: { [key: string]: string },
        infinitive: string,
        content: any
    }[] = []

    let knownVerbs = await prisma.userProgress.findUnique({
        where: {
            userId_language: {
                userId: req.body.user.id,
                language,
            }
        },
        select: { knownVerbs : true }
    }).then(data => data?.knownVerbs);

    if (!knownVerbs) {
        try {
            await prisma.userProgress.create({
                data: {
                    userId: req.body.user.id,
                    language,
                }
            });

            knownVerbs = 3
        }
        
        catch { return res.sendStatus(500) }
    }

    let candidateInfinitives = await prisma.verb.findMany({
        where: { 
            rank : { lte: knownVerbs},
            language
        },
        select: { infinitive: true }
    }).then(data => data.map(verb => verb.infinitive));
   
    while (output.length < 20) {

        const prevQuestion = output.at(-1) // undefined if output is empty
        const antePrevQuestion = output.at(-2) // undefined if output is empty or has only one element

        const selectedFormatString: string = randomElementNotPrevious(
            questionFormats, 
            prevQuestion?.format.action === 'alert' 
                ? antePrevQuestion?.format
                : prevQuestion?.format
        )

        const format: { [key: string]: string } = 
            Object.fromEntries(selectedFormatString.split('-').map((component, index) =>
                [formatComponent[index], component]
            ))
        
        if (format.action === antePrevQuestion?.format.action)
            continue;

        if (format.action === 'alert' && (output.length < 3 || output.length > 17))
            continue;

        let infinitive: string = 
            randomElementNotPrevious(candidateInfinitives, prevQuestion?.infinitive)

        if (prevQuestion?.format.action === 'alert')
            infinitive = prevQuestion.infinitive

        if (format.action === 'alert'){
            knownVerbs++

            const newInfinitive = await prisma.verb.findUnique({
                where: {
                    language_rank: {
                        language,
                        rank: knownVerbs
                    }
                },
                select: { infinitive: true }
            })

            if (!newInfinitive) continue;

            infinitive = newInfinitive.infinitive

            candidateInfinitives.push(infinitive)
        }

        candidateInfinitives.splice(candidateInfinitives.indexOf(infinitive), 1)

        if (candidateInfinitives.length === 0) {
            candidateInfinitives = await prisma.verb.findMany({
                where: { language, rank: { lte: knownVerbs} },
                select: { infinitive: true }
            }).then(data => data.map(verb => verb.infinitive));
        }

        let content;

        switch (format.action){
            case 'match':
                content = await generateMatch(
                    res,
                    format.answer,
                    language,
                    infinitive,
                    [complexity, mood, tense],
                    knownVerbs,
                    candidateInfinitives
                )

                break;
            
            case 'select':
                content = await generateSelect(
                    res,
                    { answer: format.answer, prompt: format.prompt },
                    language,
                    infinitive,
                    [complexity, mood, tense],
                    knownVerbs,
                )

                break;

            case 'type':
                content = await generateType(
                    res,
                    { answer: format.answer, prompt: format.prompt },
                    language,
                    infinitive,
                    [complexity, mood, tense],
                    knownVerbs,
                )
                
                break;

            case 'alert':
                content = generateAlert(
                    res,
                    language, 
                    infinitive,
                    [complexity, mood, tense]
                )

                break

            default:
                return res.sendStatus(500)
        }

        output.push({
            format,
            infinitive,
            content,
        })
    }

    const updatedKnownVerbs = await prisma.userProgress.update({
        where: {
            userId_language: {
                userId: req.body.user.id,
                language,
            }
        },
        data: { knownVerbs }
    })

    if (!updatedKnownVerbs) return res.sendStatus(500);

    res.json(output)
}

async function generateMatch(
    res: Response,
	type: string,
	language: string,
	infinitive: string,
	tenseRoot: [string, string, string],
    knownVerbs : number,
    candidateInfinitives : string[]
) {

    const output: {pairs: [string, string][]} = {pairs: []}
    
    if (type === 'translations'){
        const pool = candidateInfinitives && candidateInfinitives?.length <= 6
            ? candidateInfinitives
            : await prisma.verb.findMany({
                where: { language, rank: { lte: knownVerbs} },
            }).then(data => data.map(verb => verb.infinitive));

        const infinitives = pool.sort(() => Math.random() - 0.5).slice(0, 6)

        output.pairs = await Promise.all( 
            infinitives.map( async infinitive => {
                const translations = await prisma.verb.findUnique({
                    where: { language_infinitive: { infinitive, language } },
                    select: { translations: true }
                }).then(data => data?.translations) as Translations

                if (!translations) return res.sendStatus(500)

                return [ 
                    infinitive, 
                    `to ${ translations.principal }` 
                ]
            })
        ) as [string, string][]
    }
    
    if (type === 'conjugations'){
        const conjugations = await prisma.verb.findUnique({
            where: { language_infinitive: { infinitive, language } },
            select: { conjugations: true }
        }).then(data => data?.conjugations) as Conjugations

        if (!conjugations) return res.sendStatus(500)

        const [complexity, mood, tense] = tenseRoot

        output.pairs = collatedSubjects[language].map(subject => {
            const selectedSubject: string = 
                typeof subject === 'string' ? subject : randomElement(subject)

            return [selectedSubject, conjugations[complexity][mood][tense][selectedSubject]]
        })
    }

    return output
}

async function generateSelect(
    res: Response,
    type: { answer: string, prompt: string },
    language: string,
    infinitive: string,
    tenseRoot: [string, string, string],
    knownVerbs : number,
){
    let output: {
        card: string,
        tense?: string,
        subject?: string,
        options: { prefix?: string | null, main?: string | null, correct: boolean }[],
    } = {
        card: '',
        options: []
    }

    if (type.answer === 'conjugation' || type.answer === 'subject'){
        const conjugationData = await prisma.verb.findUnique({
            where: { language_infinitive: { language, infinitive } },
            select: { conjugations: true }
        }).then(data => data?.conjugations) as Conjugations

        if (!conjugationData) return res.sendStatus(500)

        const [complexity, mood, tense] = tenseRoot
        const conjugations = conjugationData[complexity][mood][tense]

        if (type.answer === 'conjugation' && type.prompt === 'tense'){
            const correctCount = randomNumber(2, 4)
            const incorrectSubjectCount = randomNumber(1, 5 - correctCount)
            const incorrectTenseCount = 6 - (correctCount + incorrectSubjectCount)

            const alternativeTenses = exclude(conjugationData[complexity][mood], [tense])

            const correct = getCorrectConjugations(correctCount, conjugations)
            const incorrect = getIncorrectConjugations(
                { subjects: incorrectSubjectCount, tenses: incorrectTenseCount }, 
                conjugations,
                correct,
                alternativeTenses
            )

            output.card = infinitive
            output.tense = tenseRoot.join('-')
            output.options = [...correct, ...incorrect]
        }

        if (type.answer === 'subject' || type.prompt === 'subject'){
            const selectedPairs = Object.entries(Object.entries(conjugations)
                .reduce((opts, [subject, conjugation]) => {

                    if (opts[conjugation]) opts[conjugation].push(subject)
                    else opts[conjugation] = [subject]

                    return opts
                }, {} as { [key: string]: string[] }))
                .map(([conjugation, subjects]) => (
                    {subject: randomElement(subjects) as string, conjugation}
                )).sort(() => Math.random() - 0.5)

            if (type.prompt === 'subject'){
                output.card = infinitive
                output.subject = selectedPairs[0].subject
                output.options = selectedPairs.map(({ conjugation }, index) => (
                    { main: conjugation, correct: index === 0 }
                ))
            }

            if (type.answer === 'subject') {
                output.card = selectedPairs[0].conjugation
                output.options = selectedPairs.map(({ subject }, index) => (
                    { main: subject, correct: index === 0 }
                ))
            }
        }
    }

    if (type.answer === 'translation') {
        const allTranslations = await prisma.verb.findMany({
            where: { language, rank: { lte: knownVerbs > 6 ? knownVerbs : 6 } },
            select: { infinitive: true, translations: true }
        }).then(data => data?.map(verb => 
            ({ infinitive: verb.infinitive, translations: verb?.translations})
        )) as { infinitive: string, translations: Translations }[]

        if (!allTranslations) return res.sendStatus(500)

        const correctTranslation = 
            allTranslations.filter(({ infinitive: verb }) => verb === infinitive)[0].translations.principal

        const options: { [key: string]: string } = { [correctTranslation]: infinitive }

        while (Object.keys(options).length < 6){
            const { infinitive, translations}: { 
                infinitive: string; 
                translations: Translations 
            } = randomElement(allTranslations);

            if (options[translations.principal])
                continue
            
            options[translations.principal] = infinitive
        }

        const translateToEnglish = type.prompt === 'audio' || Math.random() > 0.5

        output.card = translateToEnglish ? options[correctTranslation] : 'to ' + correctTranslation
        output.options = translateToEnglish
            ? Object.entries(options).map(([translation, _infinitive]) => (
                { prefix: 'to', main: translation, correct: translation === correctTranslation }
            ))
            : Object.entries(options).map(([translation, infinitive]) => (
                { main: infinitive, correct: translation === correctTranslation }
            ))
    }

    return output
}

async function generateType(
    res: Response,
    type: { answer: string, prompt: string },
    language: string,
    infinitive: string,
    tenseRoot: [string, string, string],
    knownVerbs : number,
){
    const output: { 
        card: string, 
        subject?: string, 
        answer: string 
    } = { card: '', answer: '' }

    const conjugationData = await prisma.verb.findUnique({
        where: { language_infinitive: { language, infinitive } },
        select: { conjugations: true }
    }).then(data => data?.conjugations) as Conjugations

    if (!conjugationData) return res.sendStatus(500)

    const [complexity, mood, tense] = tenseRoot
    const conjugations = conjugationData[complexity][mood][tense]

    const subjectsByConjugation: { [key: string]: string[] } = 
        Object.entries(conjugations).reduce((
            obj: { [key: string]: string[] }, 
            [subject, conjugation]: [string, string]
        ) => {
            if (obj[conjugation]) obj[conjugation].push(subject)
            else obj[conjugation] = [subject]

            return obj
        }, {})

    const conjugation = randomElement(Object.keys(subjectsByConjugation))

    output.card = conjugation

    if (type.prompt === 'subject'){
        output.card = infinitive
        output.subject = randomElement(subjectsByConjugation[conjugation])
    }

    output.answer = conjugation

    return output
}

async function generateAlert(
    res: Response,
	language: string,
	infinitive: string,
	tenseRoot: [string, string, string],
) {
    const allConjugations = 
        await prisma.verb.findUnique({
            where: { language_infinitive: { language, infinitive } },
            select: { conjugations: true }
        }).then(data => data?.conjugations) as Conjugations

    if (!allConjugations) return res.sendStatus(500)

    const [complexity, mood, tense] = tenseRoot

    const conjugations = allConjugations[complexity][mood][tense]

    return {
			conjugations: collatedSubjects[language].map((subjects) => [
				conjugations[subjects[0]],
				subjects.length < 1 ? `${subjects[0]} • ${subjects[1]}` : subjects[0]
			])
		};
}

function getCorrectConjugations( 
    num: number, 
    conjugations: { [key: string]: string }
) {
    const output: { [key: string]: string } = {}

    while (Object.keys(output).length < num){
        const subject = randomElement(Object.keys(conjugations))

        if (Object.values(output).includes(conjugations[subject])) 
            continue

        output[subject] = conjugations[subject]
    }

    return Object.entries(output).map(([subject, conjugation]) => ({
        subject, conjugation, correct: true
    }))
}

function getIncorrectConjugations(
    num: { subjects: number, tenses: number },
    conjugations: { [key: string]: string }, 
    correct: { subject: string, conjugation: string, correct: boolean }[],
    alternativeTenses: { [key: string]: { [key: string]: string } }
) {
    const output: { [key: string]: string } = {}

    const usedSubjects = correct.map(({ subject }) => subject)
    const remainingSubjects = 
        Object.keys(conjugations).filter(subject => !usedSubjects.includes(subject))

    while (Object.keys(output).length < num.subjects) { // 
        const subject = randomElement(remainingSubjects)
        const conjugation = randomElementNotPrevious(
            Array.from(new Set(Object.values(conjugations))),
            conjugations[subject]
        )

        remainingSubjects.splice(remainingSubjects.indexOf(subject), 1)

        output[subject] = conjugation
    }

    while (Object.keys(output).length < num.subjects + num.tenses) {
        const subject = randomElement(remainingSubjects)
        const tense = randomElement(Object.keys(alternativeTenses))
        const conjugation = alternativeTenses[tense][subject]

        if (conjugations[subject] === conjugation) continue

        remainingSubjects.splice(remainingSubjects.indexOf(subject), 1)

        output[subject] = alternativeTenses[tense][subject]
    }

    return Object.entries(output).map(([subject, conjugation]) => ({
        subject, conjugation, correct: false
    }))
}