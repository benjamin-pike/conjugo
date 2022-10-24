import normalizeText from "../../utils/normalizeText"
import { useRef } from "react";
import { useTransition, animated, easings } from "react-spring"
import { useLang } from "../../store/LangContext";
import getAudio from "../../utils/getAudio";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleQuestion, faClipboard, faVolumeHigh } from '@fortawesome/free-solid-svg-icons'
import regularitySchema from "../../assets/js/regularity-schema";
import styles from "./styles/tense.module.css"

function Subject(props){

    let [verb, complexity, mood, tense, conjugation] = props.route
    const id = [complexity, mood, tense, props.subjectKey].join("-")
    const { language } = useLang()
    const subjectLineRef = useRef()

    const card = props.cardRef.current
    const grid = card ? card.parentElement : null

    let regularity = 'r'

    if ( complexity === "simple" ){
        for ( let ending of Object.keys( regularitySchema[ language.name ] ) ){
            if ( verb.endsWith( ending ) ){
                let stem = verb.slice( 0, verb.length - ending.length )
                let subjects = Object.keys( regularitySchema[language.name][ending][mood][tense] ?? {} ) 

                if ( subjects.includes( props.subjectKey ) ){
                    let regularEnding = regularitySchema[language.name][ending][mood][tense][props.subjectKey]
                    let observed = tense !== "negative" ? conjugation : 
                        language.name === "spanish" ? conjugation.slice( 3, conjugation.length ) :
                        language.name === "french" ? conjugation.slice( 3, conjugation.length - 4 ) :
                        language.name === "german" ? conjugation.slice( 0, conjugation.length - 6 ) :
                        language.name === "italian" ? conjugation.slice( 4, conjugation.length ) :
                        language.name === "portuguese" ? conjugation.slice( 4, conjugation.length ) : ""
        
                    const vowels = ["a", "e", "i", "o", "u"]

                    if ( language.name === "german" ){
                        // if ( ending !== "en" ){
                        //     stem += ending.slice( 0, ending.length - 1 )
                        //     if ( regularEnding === "en" ) regularEnding = "n"
                        //     if ( ending === "eln" && regularEnding === "e" ) stem = stem.slice(0, stem.length - 2 ) + "l"
                        // }

                        if (
                            tense === "present" &&
                            (
                                stem.endsWith("d") ||stem.endsWith("t") ||
                                ((stem.endsWith("m") || stem.endsWith("n")) &&
                                    ![...vowels, stem.at(-1)].includes(
                                        normalizeText(stem.at(-2))
                                    ))
                            )
                        ) if (regularEnding === "st" || regularEnding === "t")
                                regularEnding = "e" + regularEnding;
                        

                        if ( props.subjectKey === "du" && [ "s", "ß", "x", "z" ].includes( stem.at( -1 ) ) )
                            regularEnding = "t"
                    }

                    let expected = stem + regularEnding

                    if ( observed !== expected ){
                        regularity = 'i'
                        
                        let substitutions
                        let verbSwitch;

                        const replaceLast = (str, from, to) => 
                            str.lastIndexOf( from ) === -1 ? str : str.slice( 0, str.lastIndexOf( from ) ) + to + str.slice( str.lastIndexOf( from ) + 1, str.length )

                        switch( language.name) {
                            case "spanish":
                                if ( normalizeText(observed) === expected ){
                                    regularity = 'sc'
                                    break
                                }

                                substitutions = [ ["e", "ie"], ["e", "i"], ["i", "ie"], ["o", "ue"], ["u", "ue"] ]

                                verbSwitch = stem => substitutions.some(( [from, to] ) => 
                                    normalizeText( replaceLast( stem, from, to ) + regularEnding ) === normalizeText( observed ) )

                                if ( verb.endsWith( "uir" ) && !["g", "q"].includes( stem.at ( -2 ) ) ) stem += "y"

                                if ( tense === "present" && mood === "subjunctive" && props.subjectKey === "yo" ){
                                    if ( verb.endsWith( "ger" ) || verb.endsWith( "gir") ) { stem = stem.slice( 0, stem.length - 1 ) + "j" }
                                    
                                    else if ( verb.endsWith( "guir" ) ) { stem = stem.slice( 0, stem.length - 1 ) }
                                    
                                    else if ( verb.endsWith( "quir" ) ) { stem = stem.slice( 0, stem.length - 2 ) + "c" }
                                    
                                    else if ( verb.endsWith( "ger" ) ) { stem = stem.slice( 0, stem.length - 1 ) + "j" }
                                    
                                    else if ( verb.endsWith( "cer" ) || verb.endsWith( "cir") ){
                                        stem = stem.slice( 0, stem.length - 1 ) + "z"
                                        if ( vowels.includes( normalizeText( stem.at( -2 ) ) ) || !verb.endsWith( "mecer" ) )
                                            stem += "c"
                                    }                                
                                }

                                if ( tense === "preterite" && props.subjectKey === "yo" ){
                                    if ( stem.endsWith( "c" ) ) { stem = stem.slice( 0, stem.length - 1 ) + "qu" }
                                    
                                    else if ( stem.endsWith( "g" ) ) { stem += "u" }
                                    
                                    else if ( stem.endsWith( "z" ) ) stem = stem.slice( 0, stem.length - 1 ) + "c"
                                }

                                if ( normalizeText(observed) === normalizeText(stem + regularEnding) ) regularity = 'sc'
                                
                                if ( verbSwitch( stem ) ) regularity = 'sc'
        
                                break
                        
                            case "french":
                                if ( normalizeText(observed) === normalizeText(expected) ){
                                    regularity = 'sc'
                                    break
                                }
        
                                let stemChange;
        
                                //if verb ends in -eler or -eter, the l becomes ll and the t becomes tt
                                if ( verb.endsWith("eler") || verb.endsWith("eter") ) stemChange = stem + stem.at( -1 ) 
        
                                // if verb ends in -ayer, -oyer, or -uyer, the y becomes i
                                if ( verb.endsWith("ayer") || verb.endsWith("oyer") || verb.endsWith("uyer") ) stemChange = stem.slice( 0, -1 ) + "i"
        
                                // if verb ends in -ger, an e may be added to the stem
                                if ( verb.endsWith( "ger" ) ) stemChange = stem + "e"
        
                                if ( normalizeText(observed) === normalizeText(stemChange + regularEnding) ) 
                                    regularity = 'sc'
        
                                break
        
                            case "german":
                                let prefix = ""
        
                                // check if verb is separable (i.e. abnehmen -> nemhe ab)
                                if ( verb.startsWith( conjugation.split(" ")[1] ) ){
                                    prefix = " " + conjugation.split(" ")[1]
                                    stem = verb.slice( prefix.length - 1, verb.length - ending.length )
                                }

                                verbSwitch = ending => [ ["e", "i"], ["e", "ie"], ["a", "ä"] ].some( ([a, b]) => observed === stem.replace(a, b) + ending + prefix )

                                if ( verbSwitch( regularEnding ) ) regularity = 'sc'
        
                                // if stem ends in -s, -ß, -x, or -z, the du form is formed by adding -t
                                if ( props.subjectKey === "du" && [ "s", "ß", "x", "z" ].includes( stem.at( -1 ) ) ){
                                    if ( observed === stem + "e" + regularEnding + prefix )
                                        regularity = 'sc'
                                }

                                if ( ( stem.endsWith("d") || stem.endsWith("t") ) || ( ( stem.endsWith("m") || stem.endsWith("n") ) && ![...vowels, stem.at( -1 )].includes( normalizeText( stem.at( -2 ) ) ) ) ){
                                    if ( regularEnding === "est" || ( regularEnding === "et" && !stem.endsWith( "t ") ) )
                                        if ( verbSwitch( regularEnding.slice( 1, regularEnding.length ) ) )
                                            regularity = 'sc'
                                    
                                    if ( regularEnding === "et" && !stem.endsWith( "t ") )
                                        if ( verbSwitch( "" ) )
                                            regularity = 'sc'
                                }
        
                                if ( observed === stem + regularEnding + prefix ) regularity = 'r'
        
                                break

                            case "italian":
                                if ( ending === "ire" && tense === "present" )
                                    if ( observed === stem + "isc" + regularEnding ) 
                                    regularity = 'sc'

                                if ( ["care", "gare"].includes( verb.slice( -4, verb.length ) ) && ["i", "e"].includes( regularEnding.at( 0 ) ) ) 
                                    stem += "h"
                                
                                if ( stem.at( -1 ) === "i" )
                                    stem = stem.slice( 0, stem.length - 1 )
                                
                                if ( stem.at( -1 ) === "c" && ["o", "a"].includes( regularEnding.at( 0 ) ) )
                                    stem += "i"

                                if ( observed === stem + regularEnding ) 
                                    regularity = 'sc'
        
                                break

                            case "portuguese":

                                substitutions = [ ["e", "i"], ["o", "u"], ["u", "o"] ]
        
                                verbSwitch = stem => substitutions.some(( [from, to] ) => 
                                    normalizeText( replaceLast( stem, from, to ) + regularEnding ) === normalizeText( observed ) )

                                if ( tense === "present" && mood === "indicative" ){
                                    if ( stem.at( -1 ) === "c" )
                                        stem = stem.slice( 0, stem.length - 1 ) + "ç"

                                    if ( stem.at( -1 ) === "g" )
                                        stem = stem.slice( 0, stem.length - 1 ) + "j"
        
                                    if ( verb.endsWith("guir") )
                                        stem = stem.slice( 0, stem.length - 1 )

                                    if ( verb.endsWith("dir") || verb.endsWith("der") )
                                        stem = stem.slice( 0, stem.length - 1 ) + "ç"
                                }

                                if ( tense === "preterite" || ( mood === "subjunctive" && tense === "present" ) ){
                                    if ( verb.slice( -3, verb.length ) === "car" )
                                        stem = stem.slice( 0, stem.length - 1 ) + "qu"

                                    if ( verb.slice( -3, verb.length ) === "gar" )
                                        stem += "u"
                                }

                                if ( observed === stem + regularEnding ) regularity = 'sc'
                                console.log( verb, stem, regularEnding, observed, regularity )
                                if ( verbSwitch( stem ) ) regularity = 'sc'

                                break
        
                            default:
                                break
                        }    
                    }
                }

                break
            }
        }
    }

    if ( complexity === "compound" ){
        let expected;

        switch( language.name ){
            case "spanish":
                expected = verb.endsWith("ar") ? 
                    verb.slice( 0, verb.length - 2 ) + "ado" : 
                    verb.slice( 0, verb.length - 2 ) + "ido"

                if ( conjugation.split(" ")[1] !== expected )
                    regularity = "i"

                break;

            case "french":
                const normalizeVerb = normalizeText(verb)
                expected = 
                    normalizeVerb.endsWith("er") ? verb.slice( 0, verb.length - 2 ) + "é" :
                    normalizeVerb.endsWith("ir") ?  verb.slice( 0, verb.length - 2 ) + "i" : 
                        normalizeVerb.slice( 0, verb.length - 2 ) + "u"

                if ( conjugation.split(" ")[1] !== expected ){
                    regularity = "i"
                    
                    if ( normalizeText(conjugation.split(" ")[1]) === normalizeText(expected) )
                        regularity = "sc"
                }

                break;

            case "german":
                expected = verb.endsWith( "ten" ) ? verb.slice( 0, verb.length - 2 ) + "et" :
                    verb.endsWith( "en" ) ? verb.slice( 0, verb.length - 2 ) + "t" :
                        verb.slice( 0, verb.length - 1 ) + "t"
                    
                console.log(expected, conjugation)

                if ( conjugation.split(" ")[1] !== expected && conjugation.split(" ")[1] !== "ge" + expected )
                    regularity = "i"

                break;
            
            case "italian":
                let observed = conjugation.slice(0, conjugation.length - 1).split(" ")[1]
                
                expected = 
                    verb.endsWith("are") ? verb.slice( 0, verb.length - 3 ) + "at" :
                    verb.endsWith("ere") ?  verb.slice( 0, verb.length - 3 ) + "ut" : 
                        verb.slice( 0, verb.length - 3 ) + "it"

                if ( observed !== expected ){
                    regularity = "i"

                    if ( verb.endsWith( "cere" ) )
                        if ( observed === verb.slice( 0, verb.length - 3 ) + "iut" )
                            regularity = "sc"
                }

                break;

            case "portuguese":
                    expected = verb.endsWith("ar") ? 
                        verb.slice( 0, verb.length - 2 ) + "ado" : 
                        verb.slice( 0, verb.length - 2 ) + "ido"
    
                    if ( conjugation.split(" ")[1] !== expected )
                        regularity = "i"
    
                    break;
    
            
            default:
                break;
        }
    }

    if ( language.name === "german" && complexity === "simple" && verb === "sein" )
        if ( [ "present", "imperfect" ].includes( tense ) || mood === "imperative" )
            regularity = "i"

    const transition = useTransition( id === props.activeLine.id, {
        from: { width: "0px" },
        enter: { width: props.activeLine.width.toString() + "px" },
        leave: { width: "0px" },

        config: { duration: 250, easing: easings.easeInOutSine },
    } );


    const handleMouseEnter = () => {
        const width = subjectLineRef.current.offsetWidth
        const height = subjectLineRef.current.offsetHeight
        const padding = (height / 1.75) * 5.5
        const activeWidth = width + padding + height

        const em = card.offsetHeight / 15.5
        const gridWidth = grid.offsetWidth
        const columns = gridWidth > 56.5 * em ? 3 : gridWidth > 38 * em ? 2 : 1
        const cardWidth = columns === 3 ? ( gridWidth - ( 4 * em ) ) / 3 
            : columns === 2 ? ( gridWidth - ( 3 * em ) ) / 2 : gridWidth - ( 2 * em )
        
        if ( activeWidth > cardWidth ) {
            const offset = activeWidth - cardWidth
            const column = ( Array.prototype.indexOf.call( grid.children, card ) % columns ) + 1
    
            if ( columns > 1 ) card.style.width = activeWidth + "px"
    
            let neighbour;
            let nextNeighbour;
            let leftNeighbour;
            let rightNeighbour;
    
            switch( columns ){
                case 3:
                    switch( column ){
                        case 1:
                            neighbour = card.nextElementSibling
                                if ( neighbour ) {
                                    nextNeighbour = neighbour.nextElementSibling
                                    
                                    if ( nextNeighbour ){
                                        neighbour.style.width = ( cardWidth - ( offset / 2 ) ) + "px"
                                        nextNeighbour.style.width = ( cardWidth - ( offset / 2 ) ) + "px"
            
                                        nextNeighbour.style.transform = `translateX(${( offset / 2 )}px)`
                                    }

                                    neighbour.style.transform = `translateX(${ offset }px)`
                                }

                            break
                        
                        case 2:
                            leftNeighbour = card.previousElementSibling;
                            rightNeighbour = card.nextElementSibling;
                            
                            if ( rightNeighbour ) {
                                leftNeighbour.style.width = ( cardWidth - ( offset / 2 ) ) + "px"
                                rightNeighbour.style.width = ( cardWidth - ( offset / 2 ) ) + "px"
        
                                card.style.transform = `translateX(-${( offset / 2 )}px)`
                                rightNeighbour.style.transform = `translateX(${( offset / 2 )}px)`
                            }
    
                            break
                        
                        case 3:
                            neighbour = card.previousElementSibling
                            nextNeighbour = neighbour.previousElementSibling
    
                            neighbour.style.width = ( cardWidth - ( offset / 2 ) ) + "px"
                            nextNeighbour.style.width = ( cardWidth - ( offset / 2 ) ) + "px"
                            
                            card.style.transform = `translateX(-${ offset }px)`
                            neighbour.style.transform = `translateX(-${( offset / 2 )}px)`
    
                            break
                    }
    
                    break
                case 2:
                    neighbour = column === 1 ? card.nextElementSibling : card.previousElementSibling

                    if ( neighbour ) {
                        neighbour.style.width = ( cardWidth - offset ) + "px"
                        if ( column === 1 ) neighbour.style.transform = `translateX(${ offset }px)`
                        if ( column === 2 ) card.style.transform = `translateX(-${ offset }px)` 
                    }

                    break
            }
        }
        
        props.setActiveLine( { width: width + padding + height, id } )
    }

    const handleMouseLeave = () => {
        if ( card ){
            card.removeAttribute( "style" )
    
            if ( card.previousElementSibling ){
                card.previousElementSibling.removeAttribute( "style" )
                if ( card.previousElementSibling.previousElementSibling )
                    card.previousElementSibling.previousElementSibling.removeAttribute( "style" )
            }
            
            if( card.nextElementSibling ){
                card.nextElementSibling.removeAttribute( "style" )
                if( card.nextElementSibling.nextElementSibling )
                    card.nextElementSibling.nextElementSibling.removeAttribute( "style" )
            } 
        }

        props.setActiveLine( { width: 0, id: "" } )
    }

    return(
        <li 
            className = { `${styles["subject-line__wrapper"]}${
                props.regularityVisible && regularity !== "r" ? 
                    regularity == "i" ? " " + styles["irregular"] : " " + styles["stem-changing"] 
                : "" }`}
            complexity = { complexity }
            onMouseEnter = { handleMouseEnter }
            onMouseLeave = { handleMouseLeave }>
            <div 
                ref = { subjectLineRef }
                className = {styles["subject-line__container"]}>
                <div className = {styles["subject-line__inactive"]}>
                    <div className = {styles["subject-line__content"]}>
                        <p className = {styles["subject"]}>
                            {props.text}
                        </p>
                        <p 
                            className = { styles["conjugation"] }>
                            { complexity !== "compound" ? 
                                <>
                                    { props.conjugation.trim() }
                                    { props.extension && <span className = {styles["extension"]}>{props.extension}</span> }
                                </>
                                : 
                                <>
                                    <span>{ `${props.conjugation.split(" ")[0]} ` }</span>
                                    <span className = { styles["participle-past"] }>{ `${props.conjugation.split(" ")[1]}` }</span>
                                    { props.conjugation.split(" ").length === 3 && 
                                        <span>{" " + props.conjugation.split(" ")[2]}</span> 
                                    }
                                    { props.extension && <span className = {styles["extension"]}>{props.extension}</span> }
                                </>
                            }
                        </p>
                    </div>
                </div>
                {transition((style, details) => details && <animated.div className = {styles["subject-line__active"]}
                    style = {{...style, backgroundColor: `var(--${props.color})` }}>
                    <div className = {styles["subject-line__content"]}>
                        <p className = {styles["subject"]}>
                            {props.text}
                        </p>
                        <p className = {styles["conjugation"]}>
                            {props.conjugation}
                            { props.extension && <span className = {styles["extension"]}>{props.extension}</span> }
                        </p>
                        <div className = {styles["subject-line__button"]}
                            onClick = {() => navigator.clipboard.writeText(props.conjugation)}
                            style = {{marginLeft: '1em'}}>
                            <FontAwesomeIcon icon = {faClipboard} />
                        </div>
                        <div className = {styles["subject-line__button"]}
                            onClick = { () => getAudio( language.name, verb, conjugation, true ) }>
                            <FontAwesomeIcon icon = {faVolumeHigh} />
                        </div>
                        <div className = {styles["subject-line__button"]}>
                            <FontAwesomeIcon icon = {faCircleQuestion} />
                        </div>
                    </div>
                </animated.div>)}
            </div>
        </li>
    )
}

export default Subject;