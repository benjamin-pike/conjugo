import React, { useState, useEffect } from "react";

function Verbs(props){

    const styles = props.styles

    const [verbs, setVerbs] = useState(props.verbs)

    function handleChange(event){

        setVerbs(state => {
            state.slider = event.target.value < 5 ? 5 : event.target.value

            if (state.slider <= 60){
                state.text = Math.ceil(( state.slider * 5/6 ) / 10) * 10
                state.color = 'green'
            } else if (state.slider <= 120) {
                state.text = Math.ceil(( state.slider * 15/6 - 100 ) / 25) * 25
                state.color = 'yellow'
            } else if (state.slider <= 180) {
                state.text = Math.ceil(( state.slider * 30/6 - 400 ) / 50) * 50
                state.color = 'orange'
            } else if (state.slider <= 240) {
                state.text = Math.ceil(( state.slider * 50/6 - 1000 ) / 100) * 100
                state.color = 'red'
            } else {
                state.text = Math.ceil(( state.slider * 100/6 - 3000 ) / 200) * 200
                state.color = 'purple'
            }
        
            return {...state}
        })
    }

    useEffect(() => props.setConfiguration(state => (
        {
            ...state,
            verbs: 
                {
                    slider: verbs.slider,
                    text: verbs.text,
                    color: verbs.color
                },
        }
    )), [verbs])

    return(
        <section>
            <div id = {styles["tenses-tab-title"]} className = {`${styles["tab"]} ${styles["title"]}`}>
                Verb Pool
            </div>
            <div id = {styles["tenses-tab-value"]} className = {`${styles["tab"]} ${styles["value"]}`}>
                <div className = {styles["number"]}>
                        <p>{verbs.text}</p>
                </div>
            </div>
            <div id = {styles["verbs"]} className = {`${styles["container"]} ${styles["slider"]}`}>
                <div className = {styles["range-background"]}>
                    <div className = {styles["range-foreground"]} 
                         style = {
                            {
                                width: `${verbs.slider * 1/3}%`,
                                backgroundColor: `var(--${verbs.color})`
                            }
                        } />
                </div>
                <input type = "range" id = {styles["verbs-range"]} max = {300} onChange = {handleChange}/>
            </div>
        </section>
    );
}

export default Verbs;