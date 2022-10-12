import React, { useEffect, useState, useRef } from "react";
import useHTTP from "../../../hooks/useHTTP.js";
import { useLang } from "../../../store/LangContext.js";
import RaisedButton from "../../common/RaisedButton/RaisedButton.jsx";
import Buttons from "./Buttons.jsx";
import Verbs from "./Verbs"
import Points from "./Points"
import Time from "./Time"
import Loading from "../../temporary/Loading";
import Error from "../../temporary/Error";
import styles from "./styles/configure.module.css"

function Configure(props){

    const [configuration, setConfiguration] = useState()
    const { sendRequest, error } = useHTTP()
    const { language } = useLang()

    const isValid = configuration && configuration.tenses.length

    useEffect(async () => {
        const data = await sendRequest({
            url: `/api/practice/configure/${language.name}`,
            method: "get"
        })

        setConfiguration(data)
    }, [language])

    const postConfiguration = async ( data ) => {
        if (isValid){
            await sendRequest({
                url: `/api/practice/configure/${language.name}`,
                method: "PUT",
                body: data
            })

            props.setStage("round")
        } 
    }

    return(
        error ? 
            <Error statusCode = {error} header = {true} footer = {true} />
        : !(configuration && configuration.language === language.name) ? 
            <Loading header = {true} footer = {true} /> 
        : <div id = {styles["configure"]}>
            <div className = {styles["configure-mount"]} id = {styles[`configure-mount-${language.name}`]}>
                <Buttons
                    styles = {styles}
                    language = {language}
                    subjects = {configuration.subjects} 
                    tenses = {configuration.tenses}
                    setConfiguration = {setConfiguration}
                />
                <Verbs
                    styles = {styles}
                    verbs = {configuration.verbs} 
                    setConfiguration = {setConfiguration}
                />
                <div id = {styles["points-time-row"]}>
                    <Points
                        styles = {styles}
                        points = {configuration.target} 
                        setConfiguration = {setConfiguration}
                    />
                    <Time
                        styles = {styles}
                        time = {configuration.time}
                        setConfiguration = {setConfiguration}
                    />
                </div>
            </div>

            <RaisedButton
                text = { "Start" }
                disabled = { !isValid }
                onClick = { () => postConfiguration(configuration) }
                marginTop = { "2.25em" }
                verticalPadding = { "0.5em" }
                horizontalPadding = { "1.75em" }
            />
        </div>
    );
}

export default Configure;