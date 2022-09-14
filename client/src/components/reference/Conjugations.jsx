import { useState } from "react";
import { v4 as uuidv4 } from 'uuid';
import Tense from "./Tense"
import tenseNames from "../../assets/js/map-tense-names.js"
import tenseColors from "../../assets/js/map-tense-colors.js"
import styles from "./styles/conjugations.module.css";

function Conjugations(props){

    const [englishTenseNames, setEnglishTenseNames] = useState( true )
    
    const tenses = Object.entries( tenseNames )
        .filter( ( [ _, languages ] ) => Object.keys( languages ).includes( props.language ))
        .map( ( [ tense, _ ] ) => tense )

    let sectionsAll = ["indicative", "subjunctive", "conditional", 'imperative', "progressive"]
    let sections = []
    let includeImperative = false

    for (let tense of ['affirmative', 'negative']){
        for (let subject in props.conjugations['simple']['imperative'][tense]){
            if (props.conjugations['simple']['imperative'][tense][subject]){
                includeImperative = true
            }
        }
    }

    !includeImperative && sectionsAll.splice(3, 1)

    tenses.forEach(_ => {
        const [complexity, mood, tense] = _.split("-")

        sectionsAll.includes(complexity) && !sections.includes(complexity) && sections.push(complexity)
        sectionsAll.includes(mood) && !sections.includes(mood) && sections.push(mood)
    })

    return(
        <>
            {sections.map(section => 
                <div className = {styles["conjugations-section"]} key = "conjugations">
                    <h1 id = {styles[`conjugations-section__title__${section}`]} className = {styles['conjugations-section__title']}>
                        {section[0].toUpperCase() + section.slice(1)}
                    </h1>
                    <div className = {styles["conjugations-section__body"]}>
                        {tenses.map(item => {

                        let [complexity, mood, tense] = item.split('-')
                        
                        if ((section === mood && !sections.includes(complexity)) || (section === complexity)){
                            return <Tense
                                key = {`${complexity}-${mood}-${tense}`}
                                tense = {tenseNames[item][props.language][ englishTenseNames ? "english" : "target" ]}
                                color = {tenseColors[tense]}
                                conjugations = {props.conjugations[complexity][mood][tense]}
                                route = {[props.verb, complexity, mood, tense]}
                                imperative = {mood === "imperative" ? true : false}
                                language = {props.language}
                                regularityVisible = { props.regularityVisible }
                                setEnglishTenseNames = { setEnglishTenseNames }
                            />
                            }
                        })}
                    </div>
                </div>
            )}
        </>
    );
}

export default Conjugations;