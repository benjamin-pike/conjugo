import React, { useState, useEffect } from "react";

function Time(props){

    const styles = props.styles

    const sliderToSeconds = sliderValue =>
        Math.ceil((sliderValue / 0.3) / 15) * 15

    const secondsToSlider = secondsValue =>
        Math.ceil(secondsValue * 0.3)

    const secondsToColor = secondsValue =>
        secondsValue >= 240 ? 'green' :
        secondsValue >= 180 ? 'yellow' :
        secondsValue >= 120 ? 'orange' :
        secondsValue >= 60 ? 'red' 
            : 'purple'

    const handleChange = e => {
        setTime(prevState => {
            const newState = {...prevState}

            newState.sliderValue = e.target.value < 5 ? 5 : e.target.value
            newState.seconds = sliderToSeconds(newState.sliderValue)
            newState.color = secondsToColor(newState.seconds)
            
            return newState
        })
    }

    const [time, setTime] = useState({
        sliderValue: secondsToSlider(props.time),
        seconds: props.time,
        color: secondsToColor(props.time)
    })

    useEffect(() => props.setConfiguration(
        state => ({
            ...state,
            time: time.seconds
        })
    ), [time])

    return(
        <section id = {styles["wrapper-time"]}>
            <div id = {styles["time-tab-title"]} className =  {`${styles["tab"]} ${styles["title"]}`}>
                Time
            </div>
            <div id = {styles["time-tab-value"]} className =  {`${styles["tab"]} ${styles["value"]}`}>
                <div className = {styles["number"]}>
                        <p>{`${Math.floor(time.seconds / 60)}:${(time.seconds % 60).toString().padStart(2, '0')}`}</p>
                </div>
            </div>
            <div id = {styles["time"]} className =  {`${styles["container"]} ${styles["slider"]}`}>
                <div className = {styles["range-background"]}>
                    <div className = {styles["range-foreground"]} 
                         style = {
                            {
                                width: `${time.sliderValue / 0.9}%`,
                                backgroundColor: `var(--${time.color})`
                            }
                        } />
                </div>
                <input type = "range" id = {styles["time-range"]} max = {90} onChange = {handleChange}/>
            </div>
        </section>
    );
}

export default Time;