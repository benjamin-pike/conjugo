import { useState, useRef } from "react";
import { useLang } from "../../store/LangContext";
import Subject from "./Subject"
import subjectsMap from "../../assets/js/subjects_map";
import styles from "./styles/tense.module.css"

function Tense(props){

    const { language } = useLang()
    const cardRef = useRef( null )
    const extension = {}

    const [activeLine, setActiveLine] = useState( { width: 0, id: "" } )

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
            extension["lui"] = "a"
        }
    }

    return(
        <div ref = { cardRef } className = {styles["tense-card"]}>
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
                                key = { [...props.route, subject.key].join("-") }
                                subjectKey = { subject.key }
                                language = { props.language }
                                conjugation = { conjugation }
                                extension = { extension[subject.key] }
                                route = { [...props.route, conjugation] }
                                text = { text }
                                color = { subject.color }
                                cardRef = { cardRef }
                                activeLine = { activeLine }
                                setActiveLine = { setActiveLine }
                                regularityVisible = { props.regularityVisible }
                            />
                        }
                    })}
                </ul>
            </div>
        </div>
    );
}

export default Tense;