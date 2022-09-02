import React, { useState, useEffect } from "react";
import { useNav } from "../../store/NavContext";

import AlertBanner from "./AlertBanner";
import VerbCard from "./VerbCard";
import ExplainerCard from "./ExplainerCard";
import ConjugationsGroup from "./AlertConjugations";

import RaisedButton from "../common/RaisedButton/RaisedButton";
import styles from "./styles/learn.module.css"

function Alert(){

    const { displayNav } = useNav()
    displayNav( false )
    
    const [disabled, setDisabled] = useState( false )
    const [buttonVisible, setButtonVisible] = useState( false )
    const type = "alert-new"

    useEffect(() => {
        setTimeout( () => { setButtonVisible( true ) }, 5000 )
    }, [])

    return(
        <div id = {styles["learn"]}>
            <div 
                id = {styles["content"]}
                style = {{ perspective: "1000px" }}
                className = { buttonVisible ? styles["button-visible"] : "" }>

                <AlertBanner type = {type} />
                
                <VerbCard
                    text = "hablar"
                    disabled = { disabled }
                    setDisabled = { setDisabled } 
                />
                
                <ExplainerCard type = {type} />
                
                <ConjugationsGroup
                    disabled = { disabled }
                    setDisabled = { setDisabled } 
                />
            </div>

            <div 
                id = { styles["button-continue__wrapper"] }
                className = { buttonVisible ? styles["button-visible"] : "" }>
                    
                <RaisedButton
                    text = { "Continue" }
                    onClick = { () => {} }
                />
            </div>
        </div>
    )
}

export default Alert;