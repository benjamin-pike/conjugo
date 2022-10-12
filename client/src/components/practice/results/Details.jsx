import React, { useState, useEffect } from "react";

function Details(props){

    const styles = props.styles
    
    const targetValues = props.config
    console.log(targetValues)

    const [resultsValues, setResultsValues] = useState(
        {
            subjects: { value: 0, width: 0 },
            tenses: { value: 0, width: 0 },
            verbs: { value: 0, width: 0 },
            target: { value: 0, width: 0 },
            time: { value: 0, width: 0 },
        }
    )

    const targetAccuracy = props.accuracy * 100
    const [accuracy, setAccuracy] = useState({width: 0, value: 0})

    useEffect(() => {
        const length = 2000
        const frameLength = 20
        const increment = frameLength/length
        const totalFrames = length/frameLength
        const scaleFactor = 10 / totalFrames
        
        let delay = 500

        for (let result in resultsValues){

            console.log(resultsValues, result)
            let [absoluteValue, relativeValue] = targetValues[result]

            setTimeout(() => {
                let frame = 1;
            
                let resultsTick = () => {
                    setResultsValues(results => {
                        let frameSigmoid = (totalFrames / 10) * (10 / (1 + (Math.E ** (5 - (frame * scaleFactor)))))
                        results[result]['width'] = frameSigmoid * increment * relativeValue + (0.67 * results[result]['width'] * 0.01)
                        results[result]['value'] = parseInt(Math.ceil(frameSigmoid) * increment * (
                            result === 'time' ? 300 - absoluteValue : absoluteValue
                        ))
                        
                        return {...results}
                    })

                    frame++

                    if (frame > 1/increment){
                        clearInterval(resultsInterval)
                    }
                }

                let resultsInterval = setInterval(() => resultsTick(), frameLength)
            }, delay)

            delay += 500
        }

        setTimeout(() => {
            let frame = 1;

            let accuracyTick = () => {
                let frameSigmoid = (totalFrames / 10) * (10 / (1 + (Math.E ** (5 - (frame * scaleFactor)))))

                setAccuracy(state => {
                    state.width = frameSigmoid * increment * targetAccuracy + (0.67 * state.width * 0.01)
                    state.value = parseInt(Math.ceil(frameSigmoid * increment * targetAccuracy))

                    return {...state}
                })

                frame++

                if (frame > 1/increment){
                    clearInterval(accuracyInterval)
                }
            }

            let accuracyInterval = setInterval(() => accuracyTick(), frameLength)
        }, delay + 1000)
    }, [])

    const difficultyBars = 
        [
            {label: "Subjects", color: "red", text: resultsValues.subjects.value, width: 5.5 + (resultsValues.subjects.width * 0.945)},
            {label: "Tenses", color: "orange", text: resultsValues.tenses.value, width: 5.5 + (resultsValues.tenses.width * 0.945)},
            {label: "Verb Pool", color: "yellow", text: resultsValues.verbs.value, width: 5.5 + (resultsValues.verbs.width * 0.945)},
            {label: "Target", color: "green", text: resultsValues.target.value, width: 5.5 + (resultsValues.target.width * 0.945)},
            {label: "Time", color: "blue", text: parseTime(resultsValues.time.value), width: 9 + (resultsValues.time.width * 0.91)},
        ]

    function parseTime(seconds){
        return `${Math.floor((300 - seconds) / 60)}:${((300 - seconds) % 60).toString().padStart(2, '0')}`
    }

    return(
        <div id = {styles["details"]}>
            <div className = {`${styles["container"]} ${styles["difficulty"]}`}>
                {difficultyBars.map(bar =>
                    <div 
                        key = {`results-row-${bar.label.toLowerCase().replace(" ","-")}`}
                        id = {styles[`results-row-${bar.label.toLowerCase().replace(" ","-")}`]}
                        className = {styles["results-row"]}>
                        <div className = {styles["label"]} style = {{backgroundColor: `var(--${bar.color}-dark)`}}>
                            <span>{bar.label}</span>
                        </div>
                        <div className = {styles["progress-bar"]}>
                            <div className = {styles["foreground"]} 
                                style = {
                                    {
                                        backgroundColor: `var(--${bar.color})`,
                                        width: `${bar.width}%`
                                    }
                                }> 
                                <div className = {styles["value"]} style = {{backgroundColor: `var(--${bar.color}-dark)`}}>{bar.text}</div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
            <div className = {`${styles["container"]} ${styles["accuracy"]}`}>
                <div className = {styles["divider"]} />
                <div className = {styles["results-row"]} id = {styles["results-row-accuracy"]}>
                    <div className = {styles["label"]} style = {{backgroundColor: "var(--purple-dark)"}}>
                        <span>Accuracy</span>
                    </div>
                    <div className = {styles["progress-bar"]}>
                        <div className = {styles["foreground"]} 
                            style = {
                                {
                                    backgroundColor: "var(--purple)",
                                    width: `${7.5 + accuracy.width * 0.925}%`
                                }
                            }>
                            <div className = {styles["value"]} style = {{backgroundColor: "var(--purple-dark)"}}>{`${accuracy.value}%`}</div>
                            <div className = {styles["highlight"]} />
                        </div>
                    </div>
                </div>
            </div>
            <div id = {styles["buttons"]}>
                <div id = {styles["button-continue-details-wrapper"]}>
                    <button
                        id = {styles["button-continue-details"]}
                        onClick = {() => setTimeout(() => props.setTransitioned(true), 50)}>
                        Continue
                        <div className = {styles["button-overlay"]} />
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Details;