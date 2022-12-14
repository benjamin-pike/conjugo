import tenseColors from "../../assets/js/map-tense-colors.js";
import tenseNames from "../../assets/js/map-tense-names.js";
import subjectColors from "../../assets/js/map-subject-colors.js";
import styles from "./styles/explainer-card.module.css";
import { useLang } from "../../store/LangContext";

function ExplainerCard( props ){

    const { language } = useLang() 

    const verb = props.infinitive 
    const regularity = 
        props.content.regularity === "i" ? "irregular" : 
        props.content.regularity === "sc" ? "stem-changing" : "regular"
    const translation = props.content.translation 
    const tense = props.content.tense
    const subject = props.content.subject

    const regText = { i: "irregular", sc: "stem-changing", r: "regular"}
    const regColors = { i: "red", sc: "orange", r: "green"}

    const { action, answer, prompt } = props.format
    const activityType = 
        [action, answer, prompt].filter( item => item !== undefined ).join("-")

    switch( activityType ){
        case "introduction":
            return(
                <div id = {styles["card__explainer"]}>
                <p>
                    In the 
                    <span className = {styles["card__explainer__highlight__middle"]} color = { tenseColors[ tense.split("-").at(-1) ] }>
                            <span className = {styles["card__explainer__background"]}/>
                            <span className = {styles["card__explainer__foreground"]}>
                                { tenseNames[tense][language.name].english.toLowerCase() }
                            </span>
                    </span>
                    tense,
                    <span id = {styles["card__explainer__tense"]} color = 'green' >
                        <span className = {styles["card__explainer__background"]} />
                        <span className = {styles["card__explainer__foreground"]}>
                            regular
                        </span>
                    </span>
                    verbs are conjugated as follows . . .
                </p>
            </div>
            );
        case "alert":
            return(
                <div id = {styles["card__explainer"]}>
                    <p>
                        <span id = {styles["card__explainer__verb"]} color = "dark">
                            <span className = {styles["card__explainer__background"]} />
                            <span className = {styles["card__explainer__foreground"]}>
                                { verb }
                            </span>
                        </span> 
                        is {regularity === "irregular" ? "an" : "a" } 
                        <span id = {styles["card__explainer__tense"]} color = { regColors[ props.content.regularity] } >
                            <span className = {styles["card__explainer__background"]} />
                            <span className = {styles["card__explainer__foreground"]}>
                                { regText[ props.content.regularity ] }
                            </span>
                        </span>
                        verb that means 
                        <span id = {styles["card__explainer__translation"]} color = "blue" >
                            <span className = {styles["card__explainer__background"]} />
                            <span className = {styles["card__explainer__foreground"]}>
                                to {translation}
                            </span>
                        </span>
                    </p>
                </div>
            );

        // case "alert-irregular":
        //     return(
        //         <div id = {styles["card__explainer"]}>
        //             <p>
        //                 <span id = {styles["card__explainer__verb"]} color = "dark">
        //                     <span className = {styles["card__explainer__background"]}/>
        //                     <span className = {styles["card__explainer__foreground"]}>
        //                         {verb}
        //                     </span>
        //                 </span> 
        //                 is
        //                 <span id = {styles["card__explainer__irregular"]} color = "red">
        //                     <span className = {styles["card__explainer__background"]}/>
        //                     <span className = {styles["card__explainer__foreground"]}>
        //                         irregular
        //                     </span>
        //                 </span>
        //                 in the
        //                 <span id = {styles["card__explainer__tense"]} color = { tenseColors[ tense.split(" ")[0] ] }>
        //                     <span className = {styles["card__explainer__background"]}/>
        //                     <span className = {styles["card__explainer__foreground"]}>
        //                         {tense}
        //                     </span>
        //                 </span>
        //                 tense
        //             </p>
        //         </div>
        //     );

        // case "alert-stem":
        //     return(
        //         <div id = {styles["card__explainer"]}>
        //             <p>
        //                 <span id = {styles["card__explainer__verb"]} color = "dark">
        //                     <span className = {styles["card__explainer__background"]}/>
        //                     <span className = {styles["card__explainer__foreground"]}>
        //                         {verb}
        //                     </span>
        //                 </span> 
        //                 changes its
        //                 <span id = {styles["card__explainer__stem-changing"]} color = "orange">
        //                     <span className = {styles["card__explainer__background"]}/>
        //                     <span className = {styles["card__explainer__foreground"]}>
        //                         stem
        //                     </span>
        //                 </span> 
        //                 in the
        //                 <span id = {styles["card__explainer__tense"]} color = { tenseColors[ tense.split(" ")[0] ] }>
        //                     <span className = {styles["card__explainer__background"]}/>
        //                     <span className = {styles["card__explainer__foreground"]}>
        //                         {tense}
        //                     </span>
        //                 </span>
        //                 tense
        //             </p>
        //         </div>
        //     );

        case "match-conjugations":
            return(
                <div id = {styles["card__explainer"]}>
                    <p>
                        Match the
                        <span className = {styles["card__explainer__highlight__middle"]} color = "red">
                            <span className = {styles["card__explainer__background"]}/>
                            <span className = {styles["card__explainer__foreground"]}>
                                conjugations
                            </span>
                        </span> 
                        to the correct
                        <span className = {styles["card__explainer__highlight__right"]} color = "yellow">
                            <span className = {styles["card__explainer__background"]}/>
                            <span className = {styles["card__explainer__foreground"]}>
                                subjects
                            </span>
                        </span> 
                    </p>
                </div>
            );

        case "match-translations":
            return(
                <div id = {styles["card__explainer"]}>
                    <p>
                        Match the
                        <span className = {styles["card__explainer__highlight__middle"]} color = "green">
                            <span className = {styles["card__explainer__background"]}/>
                            <span className = {styles["card__explainer__foreground"]}>
                                verbs
                            </span>
                        </span> 
                        to the correct
                        <span className = {styles["card__explainer__highlight__right"]} color = "blue">
                            <span className = {styles["card__explainer__background"]}/>
                            <span className = {styles["card__explainer__foreground"]}>
                                translations
                            </span>
                        </span> 
                    </p>
                </div>
            );

        case "select-conjugation-tense":
            return(
                <div id = {styles["card__explainer"]}>
                    <p>
                        Select all correct
                        <span className = {styles["card__explainer__highlight__middle"]} color = "red">
                            <span className = {styles["card__explainer__background"]}/>
                            <span className = {styles["card__explainer__foreground"]}>
                                conjugations
                            </span>
                        </span> 
                        that are in the
                        <span className = {styles["card__explainer__highlight__middle"]} color = { tenseColors[ tense.split("-").at(-1) ] }>
                            <span className = {styles["card__explainer__background"]}/>
                            <span className = {styles["card__explainer__foreground"]}>
                                { tenseNames[tense][language.name].english.toLowerCase() }
                            </span>
                        </span>
                        tense
                    </p>
                </div>
            );

        case "select-conjugation-subject":
            return(
                <div id = {styles["card__explainer"]}>
                    <p>
                        Select the
                        <span className = {styles["card__explainer__highlight__middle"]} color = "red">
                            <span className = {styles["card__explainer__background"]}/>
                            <span className = {styles["card__explainer__foreground"]}>
                                conjugation
                            </span>
                        </span> 
                        that corresponds with
                        <span className = {styles["card__explainer__highlight__right"]} color = { subjectColors[ language.name ][ subject ] }>
                            <span className = {styles["card__explainer__background"]}/>
                            <span className = {styles["card__explainer__foreground"]}>
                                { subject }
                            </span>
                        </span>
                    </p>
                </div>
            );

        case "select-subject-audio":
            return(
                <div id = {styles["card__explainer"]}>
                    <p>
                        Select the correct
                        <span className = {styles["card__explainer__highlight__middle"]} color = "yellow">
                            <span className = {styles["card__explainer__background"]}/>
                            <span className = {styles["card__explainer__foreground"]}>
                                subject
                            </span>
                        </span> 
                        that matches the
                        <span className = {styles["card__explainer__highlight__middle"]} color = "red">
                            <span className = {styles["card__explainer__background"]}/>
                            <span className = {styles["card__explainer__foreground"]}>
                                conjugation
                            </span>
                        </span>
                        you hear
                    </p>
                </div>
            );

        case "select-subject-text":
            return(
                <div id = {styles["card__explainer"]}>
                    <p>
                        Select the correct
                        <span className = {styles["card__explainer__highlight__middle"]} color = "yellow">
                            <span className = {styles["card__explainer__background"]}/>
                            <span className = {styles["card__explainer__foreground"]}>
                                subject
                            </span>
                        </span> 
                        that matches the given
                        <span className = {styles["card__explainer__highlight__middle"]} color = "red">
                            <span className = {styles["card__explainer__background"]}/>
                            <span className = {styles["card__explainer__foreground"]}>
                                conjugation
                            </span>
                        </span>
                    </p>
                </div>
            );
 
        case "select-translation-audio":
            return(
                <div id = {styles["card__explainer"]}>
                    <p>
                        Select the most appropriate
                        <span className = {styles["card__explainer__highlight__middle"]} color = "blue">
                            <span className = {styles["card__explainer__background"]}/>
                            <span className = {styles["card__explainer__foreground"]}>
                                translation
                            </span>
                        </span> 
                        for the
                        <span className = {styles["card__explainer__highlight__middle"]} color = "green">
                            <span className = {styles["card__explainer__background"]}/>
                            <span className = {styles["card__explainer__foreground"]}>
                                verb
                            </span>
                        </span>
                        you hear
                    </p>
                </div>
            );

        case "select-translation-text":
            return(
                <div id = {styles["card__explainer"]}>
                    <p>
                        Select the most appropriate
                        <span className = {styles["card__explainer__highlight__middle"]} color = "blue">
                            <span className = {styles["card__explainer__background"]}/>
                            <span className = {styles["card__explainer__foreground"]}>
                                translation
                            </span>
                        </span> 
                        for the given
                        <span className = {styles["card__explainer__highlight__middle"]} color = "green">
                            <span className = {styles["card__explainer__background"]}/>
                            <span className = {styles["card__explainer__foreground"]}>
                                verb
                            </span>
                        </span>
                    </p>
                </div>
            );

        case "type-conjugation-audio":
            return(
                <div id = {styles["card__explainer"]}>
                    <p>
                        Type the
                        <span className = {styles["card__explainer__highlight__middle"]} color = "red">
                            <span className = {styles["card__explainer__background"]}/>
                            <span className = {styles["card__explainer__foreground"]}>
                                conjugation
                            </span>
                        </span>
                        you hear
                    </p>
                </div>
            );
  
        case "type-conjugation-subject":
            return(
                <div id = {styles["card__explainer"]}>
                    <p>
                        Type the
                        <span className = {styles["card__explainer__highlight__middle"]} color = "red">
                            <span className = {styles["card__explainer__background"]}/>
                            <span className = {styles["card__explainer__foreground"]}>
                                conjugation
                            </span>
                        </span> 
                        that corresponds with
                        <span className = {styles["card__explainer__highlight__right"]} color = { subjectColors[ language.name ][ subject ] }>
                            <span className = {styles["card__explainer__background"]}/>
                            <span className = {styles["card__explainer__foreground"]}>
                                {subject}
                            </span>
                        </span>
                    </p>
                </div>
            );
    
        default:
            return( null )
    }
}

export default ExplainerCard;