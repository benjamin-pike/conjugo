import tenseColors from "../../assets/js/map-tense-colors.js";
import subjectColors from "../../assets/js/map-subject-colors.js";
import styles from "./styles_explainer-card.module.css";
import { useLang } from "../../store/LangContext";

function ExplainerCard( props ){

    const { language } = useLang() 

    const verb = props.data.verb 
    const regularity = 
        props.data.regularity === "i" ? "irregular" : 
        props.data.regularity === "sc" ? "stem-changing" : "regular"
    const translation = props.data.translation 
    const tense = props.data.tense
    const subject = props.data.subject

    const regText = { i: "irregular", sc: "stem-changing", r: "regular"}
    const regColors = { i: "red", sc: "orange", r: "green"}

    switch( props.data.type ){
        case "alert-new":
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
                        <span id = {styles["card__explainer__tense"]} color = { regColors[ props.data.regularity] } >
                            <span className = {styles["card__explainer__background"]} />
                            <span className = {styles["card__explainer__foreground"]}>
                                { regText[ props.data.regularity ] }
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

        case "alert-irregular":
            return(
                <div id = {styles["card__explainer"]}>
                    <p>
                        <span id = {styles["card__explainer__verb"]} color = "dark">
                            <span className = {styles["card__explainer__background"]}/>
                            <span className = {styles["card__explainer__foreground"]}>
                                {verb}
                            </span>
                        </span> 
                        is
                        <span id = {styles["card__explainer__irregular"]} color = "red">
                            <span className = {styles["card__explainer__background"]}/>
                            <span className = {styles["card__explainer__foreground"]}>
                                irregular
                            </span>
                        </span>
                        in the
                        <span id = {styles["card__explainer__tense"]} color = { tenseColors[ tense.split(" ")[0] ] }>
                            <span className = {styles["card__explainer__background"]}/>
                            <span className = {styles["card__explainer__foreground"]}>
                                {tense}
                            </span>
                        </span>
                        tense
                    </p>
                </div>
            );

        case "alert-stem":
            return(
                <div id = {styles["card__explainer"]}>
                    <p>
                        <span id = {styles["card__explainer__verb"]} color = "dark">
                            <span className = {styles["card__explainer__background"]}/>
                            <span className = {styles["card__explainer__foreground"]}>
                                {verb}
                            </span>
                        </span> 
                        changes its
                        <span id = {styles["card__explainer__stem-changing"]} color = "orange">
                            <span className = {styles["card__explainer__background"]}/>
                            <span className = {styles["card__explainer__foreground"]}>
                                stem
                            </span>
                        </span> 
                        in the
                        <span id = {styles["card__explainer__tense"]} color = { tenseColors[ tense.split(" ")[0] ] }>
                            <span className = {styles["card__explainer__background"]}/>
                            <span className = {styles["card__explainer__foreground"]}>
                                {tense}
                            </span>
                        </span>
                        tense
                    </p>
                </div>
            );

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

        case "select-conjugations-tense":
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
                        <span className = {styles["card__explainer__highlight__middle"]} color = { tenseColors[ tense.split(" ")[0] ] }>
                            <span className = {styles["card__explainer__background"]}/>
                            <span className = {styles["card__explainer__foreground"]}>
                                { tense }
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