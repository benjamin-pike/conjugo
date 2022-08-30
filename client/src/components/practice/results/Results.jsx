import React, { useState, useEffect } from "react";
import useHTTP from "../../../hooks/useHTTP.js";
import { useLang } from "../../../store/LangContext.js";
import { useTransition, animated } from "react-spring"
import Details from "./Details"
import Level from "./Level"
import Loading from "../../temporary/Loading"
import Error from "../../temporary/Error"
import styles from "./results.module.css"

function Results(props){

    const [results, setResults] = useState()
    // const [error, setError] = useState()
    const [transitioned, setTransitioned] = useState(false);

    const { sendRequest, error } = useHTTP();
    const { language } = useLang()
    
    const transition = useTransition(!transitioned, {
        from: { 
            position: "absolute", 
            x: transitioned ? 400 : 0, 
            opacity: transitioned ? 0 : 1,
        },

        enter: { x: 0, opacity: 1 },
        leave: { x: -400, opacity: 0 },
        trail: 250,

        config: { duration: 500 },
    });

    console.log('results data', props.resultsData)

    useEffect(async () => {
        const data = await sendRequest({
            url: `http://localhost:9000/api/results?language=${language.name}`,
            method: "POST",
            body: { resultsData: props.resultsData }
        })
        setResults(data)
    }, [])

    return(
        error ? 
            <Error statusCode = {error} header = {false} footer = {false} />
        : !results ? 
            <Loading header = {false} footer = {false} /> 
        : <div id = {styles["results"]}>
            {transition((style, details) => 
                details ?
                    <animated.div style = {style}>
                        <Details
                            styles = {styles}
                            data = {results.roundData}
                            accuracy = {results.accuracy}
                            setTransitioned = {setTransitioned}
                        />
                    </animated.div> 
                :
                    <animated.div style = {style}>
                        <Level 
                            styles = {styles}
                            flag = {language.flag}
                            currentXP = {results.xp.current}
                            newXP = {results.xp.new}
                            setStage = {props.setStage}
                        />
                    </animated.div>
            )}
        </div>
    );
}

export default Results;