import ProgressBar from "../ProgressBar";
import ExplainerCard from "../ExplainerCard";
import Cards from "./Cards";
import RaisedButton from "../../common/RaisedButton/RaisedButton";

import styles from "../learn.module.css"
import { useState } from "react";

function Match(){

    const type = "match-translations"

    const [handleMouseMove, setHandleMouseMove] = useState( () => {} );
    const [handleMouseUp, setHandleMouseUp] = useState( () => {} );
    // const [checkFunction, setCheckFunction] = useState( null )
    // const [checked, setChecked] = useState( false )

    // const [buttonVisible, setButtonVisible] = useState( false )

    return(
        <div 
            id = {styles["learn"]} 
            onMouseMove = { handleMouseMove }
            onMouseUp = { handleMouseUp }>
            
            <div 
                id = {styles["content"]}
                className = { buttonVisible ? styles["button-visible"] : "" }>
                    
                <ProgressBar />
                <ExplainerCard type = { type } />
                <Cards
                    pairs = { pairs }
                    setHandleFunctions = { [setHandleMouseMove, setHandleMouseUp] }
                    setButtonVisible = { setButtonVisible }
                    checkFunction = { checkFunction }
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

export default Match;