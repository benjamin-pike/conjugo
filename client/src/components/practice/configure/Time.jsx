import React, { useState, useEffect } from "react";

function Time(props){

    const styles = props.styles

    const [time, setTime] = useState(props.time)

    function handleChange(event){

        setTime(state => {
            state.slider = event.target.value < 5 ? 5 : event.target.value
            
            state.seconds = Math.ceil(( state.slider / 0.3 ) / 15) * 15
            state.text = `${Math.floor(state.seconds / 60)}:${(state.seconds % 60).toString().padStart(2, '0')}`
            
            state.color = state.seconds >= 240 ? 'green' :
                          state.seconds >= 180 ? 'yellow' :
                          state.seconds >= 120 ? 'orange' :
                          state.seconds >= 60 ? 'red' : 'purple'
            
            return {...state}
        })
    }

    useEffect(() => props.setConfiguration(state => (
        {
            ...state,
            time: 
                {
                    slider: time.slider,
                    seconds: time.seconds,
                    text: time.text,
                    color: time.color
                },
        }
    )), [time])

    return(
        <section id = {styles["wrapper-time"]}>
            <div id = {styles["time-tab-title"]} className =  {`${styles["tab"]} ${styles["title"]}`}>
                Time
            </div>
            <div id = {styles["time-tab-value"]} className =  {`${styles["tab"]} ${styles["value"]}`}>
                <div className = {styles["number"]}>
                        <p>{time.text}</p>
                </div>
            </div>
            <div id = {styles["time"]} className =  {`${styles["container"]} ${styles["slider"]}`}>
                <div className = {styles["range-background"]}>
                    <div className = {styles["range-foreground"]} 
                         style = {
                            {
                                width: `${time.slider / 0.9}%`,
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