import normalizeText from "../../functions/normalizeText"
import { useState, useRef } from "react";
import { useTransition, animated, easings } from "react-spring"
import { useLang } from "../../store/LangContext";
import getAudio from "../../functions/getAudio";
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

    for ( let ending of Object.keys( regularitySchema[ language.name ] ) ){
        if ( verb.endsWith( ending ) && complexity == "simple" ){
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
                    if ( ending !== "en" ){
                        stem += ending.slice( 0, ending.length - 1 )
                        if ( regularEnding === "en" ) regularEnding = "n"
                        if ( ending === "eln" && regularEnding === "e" ) stem = stem.slice(0, stem.length - 2 ) + "l"
                    }

                    if ( ( stem.endsWith("d") || stem.endsWith("t") ) || ( ( stem.endsWith("m") || stem.endsWith("n") ) && ![...vowels, stem.at( -1 )].includes( normalizeText( stem.at( -2 ) ) ) ) )
                        if ( regularEnding === "st" || regularEnding === "t" )
                            regularEnding = "e" + regularEnding
                    
                    if ( props.subjectKey === "du" && [ "s", "ß", "x", "z" ].includes( stem.at( -1 ) ) )
                        regularEnding = "t"
                }

                let expected = stem + regularEnding

                if ( observed !== expected ){
                    regularity = 'i'
    
                    switch( language.name) {
                        case "spanish":
                            if ( normalizeText(observed) === expected ){
                                regularity = 'sc'
                                break
                            }
    
                            const lastIndex = ( stem.length - 1) - stem
                                .split("").reverse().findIndex( (char, index) => index !== 0 && vowels.includes( char ) )
    
                            const substitutions = { e: ["ie", "i"], i: ["ie"], o: ["ue"], u: ["ue"] } 
    
                            if ( Object.keys( substitutions ).includes( stem[ lastIndex ] ) ){
                                const substitutes = substitutions[ stem[ lastIndex ] ]
    
                                substitutes.forEach( substitute => { 
                                    const stemChange = 
                                        stem.slice( 0, lastIndex ) + substitute + stem.slice( lastIndex + 1, stem.length )
    
                                    if ( observed === stemChange + regularEnding ) regularity = 'sc'
                                })
                            }
    
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

                            const verbSwitch = ending => [ ["e", "i"], ["e", "ie"], ["a", "ä"] ].some( ([a, b]) => observed === stem.replace(a, b) + ending + prefix )

                            if ( verbSwitch( regularEnding ) ) regularity = 'sc'
    
                            // if stem ends in -s, -ß, -x, or -z, the du form is formed by adding -t
                            if ( props.subjectKey === "du" && [ "s", "ß", "x", "z" ].includes( stem.at( -1 ) ) ){
                                if ( observed === stem + "e" + regularEnding + prefix )
                                    regularity = 'sc'
                            }

                            if ( ( stem.endsWith("d") || stem.endsWith("t") ) || ( ( stem.endsWith("m") || stem.endsWith("n") ) && ![...vowels, stem.at( -1 )].includes( normalizeText( stem.at( -2 ) ) ) ) )
                                if ( regularEnding === "est" || regularEnding === "et" )
                                    if ( verbSwitch( regularEnding.slice(1, regularEnding.length ) ) )
                                        regularity = 'sc'

    
                            if ( observed === stem + regularEnding + prefix ) regularity = 'r'
    
                            break

                        case "italian":
    
                            break
    
                        default:
                            break
                    }    
                }
            }

            break
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
                            {props.conjugation}
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