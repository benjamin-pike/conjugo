import React, { useState, useEffect } from "react";

function Points(props){

    const styles = props.styles

    const sliderToCount = sliderValue =>
        Math.ceil((sliderValue / 2) / 5) * 5

    const countToSlider = countValue =>
        countValue * 2

    const countToColor = countValue => 
        countValue <= 10 ? 'green' :
        countValue <= 20 ? 'yellow' :
        countValue <= 30 ? 'orange' :
        countValue <= 40 ? 'red' 
            : 'purple'

    const handleChange = e => {
        setPoints(prevState => {
            const newState = {...prevState}

            newState.sliderValue = e.target.value < 5 ? 5 : e.target.value
            newState.countValue = sliderToCount(newState.sliderValue)
            newState.color = countToColor(newState.countValue)
            
            return {...newState}
        })
    }

    const [points, setPoints] = useState({
        sliderValue: countToSlider(props.points),
        countValue: props.points,
        color: countToColor(props.points)
    })

    useEffect(() => props.setConfiguration(
        state => ({
            ...state,
            target: points.countValue
        })
    ), [points])

    return(
        <section id = {styles["wrapper-points"]}>
            <div id = {styles["points-tab-title"]} className = {`${styles["tab"]} ${styles["title"]}`}>
                Points
            </div>
            <div id = {styles["points-tab-value"]} className = {`${styles["tab"]} ${styles["value"]}`}>
                <div className = {styles["number"]}>
                        <p>{points.countValue}</p>
                </div>
            </div>
            <div id = {styles["points"]} className = {`${styles["container"]} ${styles["slider"]}`}>
                <div className = {styles["range-background"]}>
                    <div className = {styles["range-foreground"]} 
                         style = {
                            {
                                width: `${points.sliderValue}%`,
                                backgroundColor: `var(--${points.color})`
                            }
                        } />
                </div>
                <input type = "range" id = {styles["points-range"]} max = {100} onChange = {handleChange}/>
            </div>
        </section>
    );
}

export default Points;