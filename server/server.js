// IMPORT PACKAGES
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');

// IMPORT MIDDLEWARE
const checkAuth = require("./middleware/check-auth.js")

// Import templates/schemas
const { User, Verb } = require("./templates/schemas.js")

// Import data
const infinitives = require('./src/infinitives.json');

// INITIATE PACKAGES
const port = 9000
const app = express()
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}));
app.use(cors())
app.use(express.static('./src/static'))
mongoose.connect("mongodb://localhost:27017/conjugo", { useNewUrlParser: true });

// LISTEN ON PORT 'X'
app.listen(port, () => {
    console.log(`Listening on port ${port}`)
})

// ROUTES
app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.use("/api", checkAuth)

// CONFIGURATION
app.get('/api/configure', async (req, res) => { // Send current configuration upon get
    try{
        const user = await User.findOne({ id: req.body.id })
        res.send(user.practice.settings[req.query.language])
    }
    
    catch(err){
        res.sendStatus(400)
    }

})

app.post('/api/configure', async (req, res) => { // Recieve updated configuration upon post
    try{
        const user = await User.findOne({ id: req.body.id })
        user.practice.settings[req.query.language] = req.body.settings
        user.markModified("practice")
        await user.save()

        res.sendStatus(200)
    }
    
    catch(err){
        res.sendStatus(400)
    }
})

// Conjugations
function weightSubjects(subjects){
    let lengthsProduct = 1
    let lengthsArray = []
    let splitSubjects = []
    let weighted = []

    for (let subject of subjects){
        let split = subject.split('_')
        
        splitSubjects.push(split)
        
        if (!lengthsArray.includes(split.length)){
            lengthsArray.push(split.length)
            lengthsProduct = lengthsProduct * split.length
        }
    }

    for (let subject of splitSubjects){
        for (let pronoun of subject){
            for (let i = 0; i < (lengthsProduct / subject.length); i++) {
                weighted.push(pronoun)
            }
        }
    }

    return weighted
}

async function getPracticeData(language, subjects, tenses, verbs, points, time){
    
    const pool = infinitives[language].slice(0, verbs)
    const weightedSubjects = weightSubjects(subjects)
    
    const data = []
    const added = []

    function getParameters(){
        let parameters = []

        let [infinitive, rank, regularity] = pool[Math.floor(Math.random() * pool.length)]
        let [complexity, mood, tense] = tenses[Math.floor(Math.random() * tenses.length)].split('-')
        let subject = mood === 'imperative' ? 
            subjects[Math.floor(Math.random() * subjects.length)]
            : weightedSubjects[Math.floor(Math.random() * weightedSubjects.length)]

        if (!(infinitive in added) || (added.length > points - 1 && infinitive !== added.at(-1))){
            parameters = [infinitive, complexity, mood, tense, subject]
            added.push(infinitive)
        }

        return parameters
    }

    async function queryDatabase(parameters){

        if (parameters){
            let [infinitive, complexity, mood, tense, subject] = parameters
            
            let response  = await Verb.findById(`${language}_${infinitive}`)
            let document = response.toObject()
            
            let conjugation = document.conjugations[complexity][mood][tense][subject]
            let translation = document.translations.principal

            if (conjugation && translation){
                return {
                    infinitive: infinitive,
                    complexity: complexity,
                    mood: mood,
                    tense: tense,
                    subject: subject,
                    conjugation: conjugation,
                    translation: translation,
                }
            } else {
                added.pop()
            }
        }
    }

    while (data.length < points){
        let datum = await queryDatabase(getParameters())
        datum && data.push(datum)
    }

    return {
        data: data,
        points: points, 
        time: time
    }
}

app.get('/api/conjugations', async (req, res) => {

    const user = await User.findOne({ id: req.body.id })
    const settings = user.practice.settings[req.query.language]

    let conjugations = await getPracticeData(
        language = req.query.language,
        subjects = settings.subjects.active,
        tenses = settings.tenses.active,
        verbs = settings.verbs.text,
        points = settings.points.text,
        time = settings.time.seconds
    )

    res.send(conjugations)
})

// Results
// function calculateScore(language, subjects, tenses, verbs, points, time, accuracy, currentXP){
//     // Tenses per language
//     const totalTenses = {spanish: 23, french: 16, italian: 18, german: 16}

//     // Normalise variables
//     let subjectsScore = subjects / 6;
//     let tensesScore = tenses / totalTenses[language];
//     let verbsScore = (verbs / 2000) ** 0.5;

//     // Scale points and time (min = 0.1, max = 1)
//     let pointsScore = (points / 5) / 10;
//     let timeScore = (300 / time) / 10;

//     // Weight subjects, tenses, and verbs, then multiply by scaled points and time
//     let combined = (subjectsScore * 0.3 + tensesScore * 0.5 + verbsScore * 0.2) * pointsScore * timeScore

//     // Adjust score via logarithm to reduce range
//     let adjusted = (Math.log(combined * 11000) ** 4.8) / (Math.log(11000) ** 4.8)

//     // Return adjusted score multiplied by accuracy
//     return {
//         xp: { current: currentXP, new: currentXP + Math.round(1000 * adjusted * accuracy) },
//         roundData:
//             {
//                 subjects: { absolute: subjects, relative: 100 * subjects / 6 },
//                 tenses: { absolute: tenses, relative: 100 * tenses / totalTenses[language] },
//                 verbs: { absolute: verbs, relative: 100 * verbs ** 0.5 / 2000 ** 0.5 },
//                 points: { absolute: points, relative: 100 * points / 50 },
//                 time: { absolute: (300 - time), relative: 100 * (330 - time) / 300 }, 
//             },
//         accuracy: accuracy
//     }
// }

function calculateScore(language, subjects, tenses, verbs, points, time, accuracy, currentXP){
    // Tenses per language
    const totalTenses = {spanish: 23, french: 16, italian: 18, german: 16}

    // Normalise variables
    const s = subjects / 6;
    const t = tenses / totalTenses[language];
    const v = verbs / 2000;
    const pt = 0.5 * ( (points / 50) + (300 / ( time * 10 )) )

    // Score variables according to formulae
    const subjectScore = ( Math.log10(s + 0.1) + (s ** 0.8) + 1 ) / ( Math.log10(1.1) + 2 )
    const tenseScore = ( Math.log10(t + 0.1) + (t ** 0.75) + 1 ) / ( Math.log10(1.1) + 2 )
    const verbScore = ( Math.log10(v + 0.04) + (v ** 0.6) + 1.5 ) / ( Math.log10(1.04) + 2.5 )
    const pointTimeScore = ( 0.9 * ( pt ** 2.5 ) ) + 0.1

    // Combine variable scores into single normalized score
    const score = ( 1/3 ) * ( subjectScore + tenseScore + verbScore ) * pointTimeScore
    console.log( subjectScore, tenseScore, verbScore, pointTimeScore )

    // Return adjusted score multiplied by accuracy
    return {
        xp:
            {
                current: currentXP, 
                new: currentXP + Math.round(500 * score * accuracy)
            },
        roundData:
            {
                subjects: 
                    { 
                        absolute: subjects, 
                        relative: ( 100 * subjects / 6 ) 
                    },
                tenses: 
                    { 
                        absolute: tenses, 
                        relative: ( 100 * tenses / totalTenses[language] ) 
                    },
                verbs: 
                    { 
                        absolute: verbs, 
                        relative: ( 100 * verbs ** 0.5 / 2000 ** 0.5 ) 
                    },
                points: 
                    { 
                        absolute: points, 
                        relative: ( 100 * points / 50 ) 
                    },
                time:
                    { 
                        absolute: (300 - time), 
                        relative: ( 100 * (330 - time) / 300 ) 
                    }, 
            },
        accuracy: accuracy
    }
}

app.post('/api/results', async (req, res) => {

    const user = await User.findOne({ id: req.body.id })
    const resultsData = req.body.resultsData

    const language = req.query.language
    const { subjects, tenses, verbs, points, time } = user.practice.settings[req.query.language]
    const accuracy = resultsData.reduce( ( sum, rep ) => sum + rep.accuracy, 0 ) / resultsData.length
    const currentXP = user.languages.languages[language].xp

    const results = calculateScore(
        language,
        subjects.active.length,
        tenses.active.length,
        verbs.text,
        points.text,
        time.seconds,
        accuracy,
        currentXP
    )

    user.languages.languages[language].xp = results.xp.new
    user.markModified("languages")
    await user.save()

    console.log(results)
    res.send(results)
})

// Reference
async function getReferenceConjugations(language, verb){
    const document = await Verb.findById(`${language}_${verb}`)

    return {language, ...document.toObject()}
}

async function getStarredVerbs(language, id){
    const user = await User.findOne( {id: id} ) 
    const starred = user.reference.settings[language].starred

    return starred
}

async function getAudio(language, verb, complexity, mood, tense, conjugation){
    let response = await Verb.findById(`${language}_${verb}`)

    return response['audio'][complexity][mood][tense][conjugation]
}

app.get('/api/reference/data', async (req, res) => { // Recieve updated configuration upon post
    let conjugations = await getReferenceConjugations(req.query.language, req.query.verb)
    let starred = await getStarredVerbs(req.query.language, req.body.id)
    res.send({ content: conjugations, starred } )
})

app.get('/api/reference/audio', async (req, res) => { // Recieve updated configuration upon post
    let audio = await getAudio(
        req.query.language, 
        req.query.verb, 
        req.query.complexity, 
        req.query.mood, 
        req.query.tense, 
        req.query.conjugation
    )

    res.send({audio: audio})
})

app.post("/api/reference/starred", async (req, res) => {
    if (req.body.starred instanceof Array){
        const user = await User.findOne( {id: req.body.id })

        user.reference.settings[req.query.language].starred = req.body.starred
        user.markModified("reference")
        await user.save()
    
        return res.sendStatus(200)
    }

    return res.sendStatus(400)
})

// Language settings
app.get("/api/language/user-data", async (req, res) => {
    const user = await User.findOne( {id: req.body.id } )
    return res.send( user.languages )
})

// Learn
app.get("/api/learn", async (req, res) => {

    const knownVerbs = 80
    const language = "spanish"

    const randomNumber = ( lower, upper ) => Math.floor( Math.random() * ( upper - lower ) ) + lower

    const conjugationRoot = [ 
        infinitives[ language ][ randomNumber( 0, knownVerbs ) ][0], 
        "simple", 
        "indicative", 
        "present"
    ]

    const [verb, complexity, mood, tense] = conjugationRoot

    const verbData = await Verb.findById(`${language}_${verb}`)

    const conjugations = verbData.conjugations[ complexity ][ mood ][ tense ]
    const subjectsByConjugation = Object.entries( conjugations ).reduce( ( output, [ subject, conjugation ] ) => {
                                                
        if ( output[ conjugation ] ) output[conjugation].push( subject )
        else output[ conjugation ] = [ subject ]

        return output
    }, {})
    const conjugation = Object.keys( subjectsByConjugation )[ randomNumber( 0, Object.keys( subjectsByConjugation ).length ) ]

    const activityType = [ /*"match", "select", "type",*/ "alert" ][ randomNumber(0, 1) ]

    let question = {
        activityType,
        infinitive: verb,
    }

    switch ( activityType ){
        case "match":
            question.explainerData = {
                type: [ "conjugations", "translations" ][ randomNumber(0, 2) ]
            }

            if ( question.explainerData.type === "conjugations" ){
                question.matchPairs = [
                    [ "yo", conjugations.yo ],
                    [ "tú", conjugations.tú ],
                    [ "él • ella", conjugations.él ],
                    [ "nosotros", conjugations.nosotros ],
                    [ "vosotros", conjugations.vosotros ],
                    [ "ellos • ellas", conjugations.ellos ]
                ]
            }

            if ( question.explainerData.type === "translations" ){
                
                const verbs = infinitives[ language ]
                    .slice( 0, knownVerbs )
                    .map( array => array[0] )
                    .sort( () => Math.random() - 0.5 )
                    .slice( 0, 6 )
                
                question.matchPairs = await Promise.all( 
                    verbs.map( async ( verb ) => {
                        let data = await Verb.findById(`${ language }_${ verb }`)
                        return [ verb, `to ${ data.translations.principal }` ]
                    })
                )
            }

            break;
        
        case "select":
            question.explainerData = { type: [
                "conjugations-tense",
                "conjugation-subject",
                "subject-audio",
                "subject-text",
                "translation-audio",
                "translation-text",
            ][ randomNumber(0, 6) ] }

            const [ answerType, promptType ] = question.explainerData.type.split( "-" )

            question.promptFormat = promptType === "audio" ? "audio" : "text"
            question.cardContent = answerType === "subject" ? conjugation : verb

            const getCorrectConjugations = ( num, conjugations ) => {
                const output = {}

                while ( Object.keys( output ).length < num ){ // Loop until sufficient correct answers have been generated
                    const subjects = Object.keys( conjugations ) // Extract subjects from conjugations object into array
                    let subject = subjects[ randomNumber( 0, subjects.length ) ] // Select a subject at random

                    if ( !Object.values( output ).includes( conjugations[ subject ] ) ){ // If the conjugation that corresponds with the selected subject is not already a value in output...
                        output[ subject ] = conjugations[ subject ] // ...add the subject-conjugation pair to output
                    }
                }

                return output
            }

            const getIncorrectConjugations = ( num, conjugations ) => {

                const tenses = Object.entries( verbData.conjugations[ complexity ][ mood ] )
                    .filter( entry => entry[0] !== tense ).map( entry => entry[1] ) // Create array that contains all alternate (incorrect) tenses in the same mood

                const output = {}

                while ( Object.keys( output ).length < num ) { // Loop until sufficient 'incorrect tense' candidates have been generated
                    let tense = tenses[ randomNumber( 0, tenses.length ) ] // Randomly an alternate tense (object)
                    let subject = Object.keys( tense )[ randomNumber( 0, Object.keys( tense ).length ) ] // Randomly select a subject from the alterate tense

                    if ( tense[ subject ] !== conjugations[ subject ] && !Object.values( output ).includes( tense[ subject ] ) ) // If answer is not inadvertently correct and conjugation is not already a value in output
                        output[ subject ] = tense[ subject ] // Assign subject-conjugation pair to output
                }

                return output
            }

            switch ( question.explainerData.type ){
                case "conjugations-tense":

                    question.explainerData.tense = tense

                    const output = []

                    const totalSubjectChanges = randomNumber( 0, 2 ) // Choose number of conjugations in correct tense but matched to incorrect subjects ( 0, 1, or 2 )
                    const totalCorrect = randomNumber( 2 + totalSubjectChanges, 4 ) // Choose number of answers that will be correct ( subject changes will be extracted )
                    
                    const correctAnswers = getCorrectConjugations( totalCorrect, conjugations )
                    const incorrectTenses = getIncorrectConjugations( 6 - totalCorrect, conjugations )

                    // Switch subjects of a section of correct answers
                    const incorrectSubjects = {} // Initialise object to contain conjugations with incorrect subject

                    while ( Object.keys( incorrectSubjects ) < totalSubjectChanges ){ // Loop until sufficient 'incorrect subject' candidates have been generated                        
                        const switchedSubject = Object.keys( correctAnswers )[ randomNumber( 0, totalCorrect ) ] // Randomly select subject from correct answers
                        const availableConjugations = Object.values( conjugations ).filter( conjugation => conjugation !== conjugations[ switchedSubject ] )
                        const switchedConjugation = availableConjugations[ randomNumber( 0, Object.entries( availableConjugations ).length - 1 ) ] // Randomly select conjugation that does not match subject but is in correct tense

                        incorrectSubjects[ switchedSubject ] = switchedConjugation // Assign incorrect conjugation to subject key in relevant object
                        
                        delete correctAnswers[ switchedSubject ] // Delete subject-conjugation pair from correct answers object
                    }

                    // For each candidate in separate arrays, format into tripartite object (subject, conjugation, correct?) and push to candidate array
                    Object.entries( correctAnswers ).forEach( ( [ subject, conjugation ] ) => 
                        output.push( { subject, conjugation, correct: true })
                    )

                    Object.entries( incorrectSubjects ).forEach( ( [ subject, conjugation ] ) => 
                        output.push( { subject, conjugation, correct: false })
                    )

                    Object.entries( incorrectTenses ).forEach( ( [ subject, conjugation ] ) => 
                        output.push( { subject, conjugation, correct: false })
                    )

                    question.selectCandidates = output.sort( () => Math.random() - 0.5 )

                    break;
           
                case "conjugation-subject":

                    const candidateConjugations = Object.keys( subjectsByConjugation )

                    const correctConjugation =
                     candidateConjugations[ randomNumber( 0, candidateConjugations.length ) ]

                    question.explainerData.subject = 
                        subjectsByConjugation[ correctConjugation ][ randomNumber( 0, subjectsByConjugation[ correctConjugation ].length ) ] 


                    question.selectCandidates = candidateConjugations.map( candidate =>
                        ({ 
                            subject: null, 
                            conjugation: candidate, 
                            correct: candidate === correctConjugation
                        })
                    ).sort( () => Math.random() - 0.5 )

                    break;
            
                case "subject-audio":
                case "subject-text":
                    
                    question.cardContent = 
                        Object.keys( subjectsByConjugation )[ randomNumber( 0, Object.keys( subjectsByConjugation ).length ) ]
                    
                    question.selectCandidates = Object.entries( subjectsByConjugation )
                        .map( ( [ conjugation, subjects ] ) => 
                            ({
                                subject: subjects[ randomNumber( 0, subjects.length ) ],
                                conjugation: null,
                                correct: conjugation === question.cardContent
                            })
                        ).sort( () => Math.random() - 0.5 )
                    
                    break;

                case "translation-audio":
                case "translation-text":

                    const verbs = infinitives[ language ]
                        .slice( 0, knownVerbs )
                        .map( array => array[0] )
                        .sort( () => Math.random() - 0.5 )
                        .slice( 0, 6 )
                    
                    const translations = await Promise.all( 
                        verbs.map( async ( verb ) => {
                            let data = await Verb.findById(`${language}_${verb}`)
                            return [ verb, data.translations.principal ]
                        })
                    )

                    const [ correctOrigin, correctTranslation ] = translations[ randomNumber( 0, 6 ) ]

                    question.infinitive = correctOrigin
                    question.cardContent = correctOrigin
                    question.selectCandidates = translations.map( ( [ origin, translation ] ) => (
                        {
                            subject: "to", 
                            conjugation: translation, 
                            correct: translation === correctTranslation
                        }
                    ))

                    break;
            }

            break;
        
        case "type":
            question.explainerData = { type: [
                "conjugation-audio",
                "conjugation-subject"
            ][ randomNumber(0, 2) ] } 

            switch ( question.explainerData.type ){
                case "conjugation-audio":
                    question = {
                        ...question,
                        promptFormat: "audio",
                        cardContent: conjugation,
                        typeAnswer: conjugation
                    }

                    break;

                case "conjugation-subject":
                    question = {
                        ...question,
                        promptFormat: "text",
                        cardContent: verb,
                        typeAnswer: conjugation,
                        explainerData: {
                            ...question.explainerData, 
                            subject: subjectsByConjugation[ conjugation ][ randomNumber( 0, subjectsByConjugation[ conjugation ].length ) ]
                        }
                    }

                    break;
            }
            
            break;
    
        case "alert":
            question.promptFormat = "text"
            question.cardContent = verb
            question.explainerData = {
                type: "new",
                verb,
                regularity: verbData.regularity,
                translation: verbData.translations.principal
            }
            question.alertConjugations = [
                [ "yo", conjugations.yo ],
                [ "tú", conjugations.tú ],
                [ "él • ella", conjugations.él ],
                [ "nosotros", conjugations.nosotros ],
                [ "vosotros", conjugations.vosotros ],
                [ "ellos • ellas", conjugations.ellos ]
            ]
    }

    return res.json( question )
    return res.send({
        activityType: "alert",
        promptFormat: "text",
        cardContent: verb,
        explainerData: {
            type: "new",
            verb, 
            regularity: verbData.conjugations.regularity, 
            translation: verbData.translations[0]
        },
        audioPath: path,
        alertPairs: [
            [ "yo", conjugations.yo ],
            [ "tú", conjugations.tu ],
            [ "él • ella", conjugations.el ],
            [ "nosotros", conjugations.nosotros ],
            [ "vosotros", conjugations.vosotros ],
            [ "ellos • ellas", conjugations.ellos ]
        ]
    })
});

app.get("/api/lesson", async (req, res) => {

    const knownVerbs = 80
    const language = "spanish"

    const randomNumber = ( lower, upper ) => Math.floor( Math.random() * ( upper - lower ) ) + lower

    // const conjugations = verbData.conjugations[ complexity ][ mood ][ tense ]
    // const subjectsByConjugation = Object.entries( conjugations ).reduce( ( output, [ subject, conjugation ] ) => {
                                                
    //     if ( output[ conjugation ] ) output[conjugation].push( subject )
    //     else output[ conjugation ] = [ subject ]

    //     return output
    // }, {})
    // const conjugation = Object.keys( subjectsByConjugation )[ randomNumber( 0, Object.keys( subjectsByConjugation ).length ) ]

    const activityType = [ "match", "select", "type", "alert" ][ randomNumber(0, 4) ]

    const createQuestion = async ( verb, complexity, mood, tense, verbData, conjugations, conjugation, subjectsByConjugation ) => {
        let question = {
            activityType,
            infinitive: verb,
        }

        switch ( activityType ){
            case "match":
                question.explainerData = {
                    type: [ "conjugations", "translations" ][ randomNumber(0, 2) ]
                }

                if ( question.explainerData.type === "conjugations" ){
                    question.matchPairs = [
                        [ "yo", conjugations.yo ],
                        [ "tú", conjugations.tú ],
                        [ "él • ella", conjugations.él ],
                        [ "nosotros", conjugations.nosotros ],
                        [ "vosotros", conjugations.vosotros ],
                        [ "ellos • ellas", conjugations.ellos ]
                    ]
                }

                if ( question.explainerData.type === "translations" ){
                    
                    const verbs = infinitives[ language ]
                        .slice( 0, knownVerbs )
                        .map( array => array[0] )
                        .sort( () => Math.random() - 0.5 )
                        .slice( 0, 6 )
                    
                    question.matchPairs = await Promise.all( 
                        verbs.map( async ( verb ) => {
                            let data = await Verb.findById(`${ language }_${ verb }`)
                            return [ verb, `to ${ data.translations.principal }` ]
                        })
                    )
                }

                break;
            
            case "select":
                question.explainerData = { type: [
                    "conjugations-tense",
                    "conjugation-subject",
                    "subject-audio",
                    "subject-text",
                    "translation-audio",
                    "translation-text",
                ][ randomNumber(0, 6) ] }

                const [ answerType, promptType ] = question.explainerData.type.split( "-" )

                question.promptFormat = promptType === "audio" ? "audio" : "text"
                question.cardContent = answerType === "subject" ? conjugation : verb

                const getCorrectConjugations = ( num, conjugations ) => {
                    const output = {}

                    while ( Object.keys( output ).length < num ){ // Loop until sufficient correct answers have been generated
                        const subjects = Object.keys( conjugations ) // Extract subjects from conjugations object into array
                        let subject = subjects[ randomNumber( 0, subjects.length ) ] // Select a subject at random

                        if ( !Object.values( output ).includes( conjugations[ subject ] ) ){ // If the conjugation that corresponds with the selected subject is not already a value in output...
                            output[ subject ] = conjugations[ subject ] // ...add the subject-conjugation pair to output
                        }
                    }

                    return output
                }

                const getIncorrectConjugations = ( num, conjugations ) => {

                    const tenses = Object.entries( verbData.conjugations[ complexity ][ mood ] )
                        .filter( entry => entry[0] !== tense ).map( entry => entry[1] ) // Create array that contains all alternate (incorrect) tenses in the same mood

                    const output = {}

                    while ( Object.keys( output ).length < num ) { // Loop until sufficient 'incorrect tense' candidates have been generated
                        let tense = tenses[ randomNumber( 0, tenses.length ) ] // Randomly an alternate tense (object)
                        let subject = Object.keys( tense )[ randomNumber( 0, Object.keys( tense ).length ) ] // Randomly select a subject from the alterate tense

                        if ( tense[ subject ] !== conjugations[ subject ] && !Object.values( output ).includes( tense[ subject ] ) ) // If answer is not inadvertently correct and conjugation is not already a value in output
                            output[ subject ] = tense[ subject ] // Assign subject-conjugation pair to output
                    }

                    return output
                }

                switch ( question.explainerData.type ){
                    case "conjugations-tense":

                        question.explainerData.tense = tense

                        const output = []

                        const totalSubjectChanges = randomNumber( 0, 2 ) // Choose number of conjugations in correct tense but matched to incorrect subjects ( 0, 1, or 2 )
                        const totalCorrect = randomNumber( 2 + totalSubjectChanges, 4 ) // Choose number of answers that will be correct ( subject changes will be extracted )
                        
                        const correctAnswers = getCorrectConjugations( totalCorrect, conjugations )
                        const incorrectTenses = getIncorrectConjugations( 6 - totalCorrect, conjugations )

                        // Switch subjects of a section of correct answers
                        const incorrectSubjects = {} // Initialise object to contain conjugations with incorrect subject

                        while ( Object.keys( incorrectSubjects ) < totalSubjectChanges ){ // Loop until sufficient 'incorrect subject' candidates have been generated                        
                            const switchedSubject = Object.keys( correctAnswers )[ randomNumber( 0, totalCorrect ) ] // Randomly select subject from correct answers
                            const availableConjugations = Object.values( conjugations ).filter( conjugation => conjugation !== conjugations[ switchedSubject ] )
                            const switchedConjugation = availableConjugations[ randomNumber( 0, Object.entries( availableConjugations ).length - 1 ) ] // Randomly select conjugation that does not match subject but is in correct tense

                            incorrectSubjects[ switchedSubject ] = switchedConjugation // Assign incorrect conjugation to subject key in relevant object
                            
                            delete correctAnswers[ switchedSubject ] // Delete subject-conjugation pair from correct answers object
                        }

                        // For each candidate in separate arrays, format into tripartite object (subject, conjugation, correct?) and push to candidate array
                        Object.entries( correctAnswers ).forEach( ( [ subject, conjugation ] ) => 
                            output.push( { subject, conjugation, correct: true })
                        )

                        Object.entries( incorrectSubjects ).forEach( ( [ subject, conjugation ] ) => 
                            output.push( { subject, conjugation, correct: false })
                        )

                        Object.entries( incorrectTenses ).forEach( ( [ subject, conjugation ] ) => 
                            output.push( { subject, conjugation, correct: false })
                        )

                        question.selectCandidates = output.sort( () => Math.random() - 0.5 )

                        break;
            
                    case "conjugation-subject":

                        const candidateConjugations = Object.keys( subjectsByConjugation )

                        const correctConjugation =
                        candidateConjugations[ randomNumber( 0, candidateConjugations.length ) ]

                        question.explainerData.subject = 
                            subjectsByConjugation[ correctConjugation ][ randomNumber( 0, subjectsByConjugation[ correctConjugation ].length ) ] 


                        question.selectCandidates = candidateConjugations.map( candidate =>
                            ({ 
                                subject: null, 
                                conjugation: candidate, 
                                correct: candidate === correctConjugation
                            })
                        ).sort( () => Math.random() - 0.5 )

                        break;
                
                    case "subject-audio":
                    case "subject-text":
                        
                        question.cardContent = 
                            Object.keys( subjectsByConjugation )[ randomNumber( 0, Object.keys( subjectsByConjugation ).length ) ]
                        
                        question.selectCandidates = Object.entries( subjectsByConjugation )
                            .map( ( [ conjugation, subjects ] ) => 
                                ({
                                    subject: subjects[ randomNumber( 0, subjects.length ) ],
                                    conjugation: null,
                                    correct: conjugation === question.cardContent
                                })
                            ).sort( () => Math.random() - 0.5 )
                        
                        break;

                    case "translation-audio":
                    case "translation-text":

                        const verbs = infinitives[ language ]
                            .slice( 0, knownVerbs )
                            .map( array => array[0] )
                            .sort( () => Math.random() - 0.5 )
                            .slice( 0, 6 )
                        
                        const translations = await Promise.all( 
                            verbs.map( async ( verb ) => {
                                let data = await Verb.findById(`${language}_${verb}`)
                                return [ verb, data.translations.principal ]
                            })
                        )

                        const [ correctOrigin, correctTranslation ] = translations[ randomNumber( 0, 6 ) ]

                        question.infinitive = correctOrigin
                        question.cardContent = correctOrigin
                        question.selectCandidates = translations.map( ( [ origin, translation ] ) => (
                            {
                                subject: "to", 
                                conjugation: translation, 
                                correct: translation === correctTranslation
                            }
                        ))

                        break;
                }

                break;
            
            case "type":
                question.explainerData = { type: [
                    "conjugation-audio",
                    "conjugation-subject"
                ][ randomNumber(0, 2) ] } 

                switch ( question.explainerData.type ){
                    case "conjugation-audio":
                        question = {
                            ...question,
                            promptFormat: "audio",
                            cardContent: conjugation,
                            typeAnswer: conjugation
                        }

                        break;

                    case "conjugation-subject":
                        question = {
                            ...question,
                            promptFormat: "text",
                            cardContent: verb,
                            typeAnswer: conjugation,
                            explainerData: {
                                ...question.explainerData, 
                                subject: subjectsByConjugation[ conjugation ][ randomNumber( 0, subjectsByConjugation[ conjugation ].length ) ]
                            }
                        }

                        break;
                }
                
                break;
        
            case "alert":
                question.promptFormat = "text"
                question.cardContent = verb
                question.explainerData = {
                    type: "new",
                    verb,
                    regularity: verbData.regularity,
                    translation: verbData.translations.principal
                }
                question.alertConjugations = [
                    [ "yo", conjugations.yo ],
                    [ "tú", conjugations.tú ],
                    [ "él • ella", conjugations.él ],
                    [ "nosotros", conjugations.nosotros ],
                    [ "vosotros", conjugations.vosotros ],
                    [ "ellos • ellas", conjugations.ellos ]
                ]
        }

        return question
    }

    questions = []

    for ( i = 0; i < 15; i++ ){
        let verb = infinitives[ language ][ randomNumber( 0, knownVerbs ) ][0]
        let root = [ "simple", "indicative", "present" ]
        let [ complexity, mood, tense ] = root
        let verbData = await Verb.findById(`${language}_${verb}`)
        let conjugations = verbData.conjugations[ complexity ][ mood ][ tense ]
        
        let subjectsByConjugation = Object.entries( conjugations ).reduce( ( output, [ subject, conjugation ] ) => {
                                                
            if ( output[ conjugation ] ) output[conjugation].push( subject )
            else output[ conjugation ] = [ subject ]
    
            return output
        }, {})

        let conjugation = Object.keys( subjectsByConjugation )[ randomNumber( 0, Object.keys( subjectsByConjugation ).length ) ]

        questions.push(
            await createQuestion( verb, complexity, mood, tense, verbData, conjugations, conjugation, subjectsByConjugation )
        )
    }

    res.json(questions)
});