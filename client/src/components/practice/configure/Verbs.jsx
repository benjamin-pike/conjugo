import React, { useState, useEffect } from "react";

function Verbs(props){

    const styles = props.styles

    const sliderToCount = sliderValue =>
        sliderValue <= 60 ? Math.ceil((sliderValue * 5) / 6 / 10) * 10
        : sliderValue <= 120 ? Math.ceil(((sliderValue * 15) / 6 - 100) / 25) * 25
        : sliderValue <= 180 ? Math.ceil(((sliderValue * 30) / 6 - 400) / 50) * 50
        : sliderValue <= 240 ? Math.ceil(((sliderValue * 50) / 6 - 1000) / 100) * 100
            : Math.ceil(((sliderValue * 100) / 6 - 3000) / 200) * 200;

    const countToSlider = countValue => 
        countValue <= 50 ? Math.ceil(countValue * 6 / 5)
        : countValue <= 200 ? Math.ceil((countValue * 6 + 100) / 15)
        : countValue <= 500 ? Math.ceil((countValue * 6 + 400) / 30)
        : countValue <= 1000 ? Math.ceil((countValue * 6 + 1000) / 50)
            : Math.ceil((countValue * 6 + 3000) / 100);

    const countToColor = countValue =>
        countValue <= 50 ? "green"
        : countValue <= 200 ? "yellow"
        : countValue <= 500 ? "orange"
        : countValue <= 1000 ? "red"
            : "purple";

    const handleChange = e => {
        setVerbs(prevState => {
            const newState = {...prevState}

            newState.sliderValue = e.target.value < 5 ? 5 : e.target.value
            newState.countValue = sliderToCount(newState.sliderValue)
            newState.color = countToColor(newState.countValue)

            return newState
        })
    }

    const [verbs, setVerbs] = useState({
        sliderValue: countToSlider(props.verbs),
        countValue: props.verbs,
        color: countToColor(props.verbs)
    })

    useEffect(() => props.setConfiguration(
        state => ({
            ...state,
            verbs: verbs.countValue
        })
    ), [verbs])

    return(
        <section>
            <div id = {styles["tenses-tab-title"]} className = {`${styles["tab"]} ${styles["title"]}`}>
                Verb Pool
            </div>
            <div id = {styles["tenses-tab-value"]} className = {`${styles["tab"]} ${styles["value"]}`}>
                <div className = {styles["number"]}>
                        <p>{verbs.countValue}</p>
                </div>
            </div>
            <div id = {styles["verbs"]} className = {`${styles["container"]} ${styles["slider"]}`}>
                <div className = {styles["range-background"]}>
                    <div className = {styles["range-foreground"]} 
                         style = {
                            {
                                width: `${verbs.sliderValue * 1/3}%`,
                                backgroundColor: `var(--${verbs.color})`
                            }
                        } />
                </div>
                <input 
                    type = "range" 
                    id = {styles["verbs-range"]} 
                    max = {300} 
                    onChange = { handleChange }
                />
            </div>
        </section>
    );
}

export default Verbs;