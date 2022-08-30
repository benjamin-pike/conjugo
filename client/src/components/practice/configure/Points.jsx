import React, { useState, useEffect } from "react";

function Points(props){

    const styles = props.styles

    const [points, setPoints] = useState(props.points)

    function handleChange(event){

        setPoints(state => {
            state.slider = event.target.value < 5 ? 5 : event.target.value
            state.text = Math.ceil(( state.slider / 2 ) / 5) * 5
            
            state.color = state.text <= 10 ? 'green' :
                          state.text <= 20 ? 'yellow' :
                          state.text <= 30 ? 'orange' :
                          state.text <= 40 ? 'red' : 'purple'
            
            return {...state}
        })
    }

    useEffect(() => props.setConfiguration(state => (
        {
            ...state,
            points: 
                {
                    slider: points.slider,
                    text: points.text,
                    color: points.color
                },
        }
    )), [points])

    return(
        <section id = {styles["wrapper-points"]}>
            <div id = {styles["points-tab-title"]} className = {`${styles["tab"]} ${styles["title"]}`}>
                Points
            </div>
            <div id = {styles["points-tab-value"]} className = {`${styles["tab"]} ${styles["value"]}`}>
                <div className = {styles["number"]}>
                        <p>{points.text}</p>
                </div>
            </div>
            <div id = {styles["points"]} className = {`${styles["container"]} ${styles["slider"]}`}>
                <div className = {styles["range-background"]}>
                    <div className = {styles["range-foreground"]} 
                         style = {
                            {
                                width: `${points.slider}%`,
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