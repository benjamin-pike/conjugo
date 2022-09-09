import { useState, useRef } from "react";
import { useTransition, animated, easings } from "react-spring"
import { useLang } from "../../store/LangContext";
import getAudio from "../../functions/getAudio";
import { v4 as uuidv4 } from 'uuid';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleQuestion, faClipboard, faVolumeHigh } from '@fortawesome/free-solid-svg-icons'
import subjectsMap from "../../assets/js/subjects_map";
import regularitySchema from "../../assets/js/regularity-schema";
import styles from "./styles/tense.module.css"

const normalize = (str) => str.normalize("NFD").replace(/\p{Diacritic}/gu, "")

function Subject(props){

    let [verb, complexity, mood, tense, conjugation] = props.route
    const [display, setDisplay] = useState(false)
    const { language } = useLang()
    const subjectLineRef = useRef()

    const displayRegularity = true
    let regularity = 'r'

    Object.keys( regularitySchema[ language.name ] ).forEach( ending => {
        if ( verb.endsWith( ending ) && complexity == "simple" ){
            const stem = verb.slice( 0, verb.length - ending.length )
            const regularEnding = regularitySchema[language.name][ending][mood][tense][props.subjectKey]
            const expected = stem + regularEnding
            const observed = tense !== "negative" ? conjugation : conjugation.slice( 3, conjugation.length )

            const vowels = ["a", "e", "i", "o", "u"]

            if ( observed !== expected ){
                regularity = 'i'

                switch( language.name) {
                    case "spanish":
                        if ( normalize(observed) === expected ){
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
                }
                
            }
        }
    })

    const toggleDisplay = (e, display) => {
        const width = subjectLineRef.current.offsetWidth
        const height = subjectLineRef.current.offsetHeight
        const padding = (height / 1.75) * 5.5
        const offset = height
        
        if ( display ) return setDisplay(`${width + padding + offset}px`)

        return setDisplay("")
    }

    const transition = useTransition(display, {
        from: { width: "0px" },
        enter: { width: display },
        leave: { width: "0px" },

        config: { duration: 250, easing: easings.easeInOutSine },
    });

    return(
        <li 
            className = {styles["subject-line__wrapper"]}
            onMouseEnter = { e => toggleDisplay(e, true) }
            onMouseLeave = { e => toggleDisplay(e, false) }>
            <div 
                ref = { subjectLineRef }
                className = {styles["subject-line__container"]}>
                <div className = {styles["subject-line__inactive"]}>
                    <div className = {styles["subject-line__content"]}>
                        <p className = {styles["subject"]}>
                            {props.text}
                        </p>
                        <p 
                            className = {`${styles["conjugation"]}${
                                displayRegularity && regularity !== "r" ? 
                                    regularity == "i" ? " " + styles["irregular"] : " " + styles["stem-changing"] 
                                : "" }`}>
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

function Tense(props){

    const { language } = useLang()

    const handleHover = e => {
        const p = e.target
        const span = e.target.children[0]

        if ( e.type === "mouseenter" ){
            const pStyle = getComputedStyle(p)
            const offset = (span.offsetWidth + 2 * ( parseFloat( pStyle.paddingLeft ) + parseFloat( pStyle.borderWidth ) ) ) - p.offsetWidth
        
            if ( Math.abs( offset > 1 ) ) return span.style.transform = `translateX(-${offset}px)`
        }

        return span.style.transform = ""

    }

    if ( language.name === "italian" && props.route[1] === "compound" ){
        if ( props.conjugations["lui"] !== props.conjugations["lei"] ){
            // props.conjugations["lui"] = props.conjugations["lui"].slice(0, -1) + "(o/a)"
        }
    }

    return(
        <div className = {styles["tense-card"]}>
            <div className= {styles["tense-card__content"]}>
                <div className = {styles["tense-card__header"]}>
                    <p 
                        className= {styles["tense-name"]} 
                        style = {{color: `var(--${props.color})`}}
                        onClick = { () => props.setEnglishTenseNames( current => !current ) }
                        onMouseEnter = { handleHover }
                        onMouseLeave = { handleHover }>
                        <span>{props.tense}</span>
                    </p>
                </div>
                <ul>
                    {subjectsMap[props.language].map(subject => {
                        if (props.conjugations[subject.key]){

                            let text = subject.text;
                            let conjugation = props.conjugations[subject.key];

                            if (props.imperative){
                                text = subject.altText ? subject.altText : subject.text
                            }

                            if (props.language === "french"){
                                if (["a", "e", "i", "o", "u", "h"].includes(conjugation[0].normalize("NFD").replace(/\p{Diacritic}/gu, ""))){
                                    text = subject.altText && !subject.altText.includes("(") ? subject.altText : subject.text
                                }
                            }

                            return <Subject
                                key = {uuidv4()}
                                subjectKey = { subject.key }
                                language = {props.language}
                                conjugation = {conjugation}
                                route = {[...props.route, conjugation]}
                                text = {text}
                                color = {subject.color}
                            />
                        }
                    })}
                </ul>
            </div>
        </div>
    );
}

export default Tense;