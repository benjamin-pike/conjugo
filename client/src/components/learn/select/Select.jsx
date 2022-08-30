import ProgressBar from "../ProgressBar";
import VerbCard from "../VerbCard";
import AudioCard from "./AudioCard"
import ExplainerCard from "../ExplainerCard";
import Cards from "./Cards";
import RaisedButton from "../../common/RaisedButton/RaisedButton";

import styles from "../learn.module.css"
import { useState } from "react";

function Select(){

    const type = "select-conjugation-subject"
    const prompt = "text"

    const [disabled, setDisabled] = useState( false )
    const [checkFunction, setCheckFunction] = useState( null )
    const [checked, setChecked] = useState( false )

    const [buttonVisible, setButtonVisible] = useState( false )

    return(
        <div id = {styles["learn"]}>
            
            <div 
                id = {styles["content"]}
                style = {{ perspective: "1000px" }}
                className = { buttonVisible ? styles["button-visible"] : "" }>
                    
                <ProgressBar />
                
                { prompt === "audio" ?
                    <AudioCard 
                        audio = "hablo"
                        disabled = { disabled }
                        setDisabled = { setDisabled }
                    />
                    :
                    <VerbCard 
                        text = "hablar" 
                        disabled = { disabled }
                        setDisabled = { setDisabled }
                    />
                }
                
                <ExplainerCard type = { type } />
                
                <Cards 
                    setButtonVisible = { setButtonVisible } 
                    setCheckFunction = { setCheckFunction }    
                    setChecked = { setChecked }
                />
            </div>

            <div 
                id = { styles["button-continue__wrapper"] }
                className = { buttonVisible ? styles["button-visible"] : "" }>
                    
                <RaisedButton
                    text = { checked ? "Continue" : "Check" }
                    width = { checked ? "11.75em" : "9.5em" }
                    onClick = { checkFunction }
                />
            </div>
        </div>
    );
}

export default Select;