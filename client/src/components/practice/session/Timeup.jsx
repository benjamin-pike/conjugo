import React from 'react'
import styles from "./styles/timeup.module.css"

function Timeup(props) {

    return (
        <div id = {styles["timeup"]}>
            <div id = {styles["card"]}>
                <p>Time's Up!</p>
            </div>

            <div id = {styles["mount"]}>
                <div id = {styles["buttons"]}>
                    <div id = {styles["button-retry-details-wrapper"]}>
                        <button
                            id = {styles["button-retry-details"]}
                            onClick = {() => setTimeout(() => {props.setStage('configuration'); props.setStage('round')}, 50)}>
                            Try Again
                            <div className = {styles["button-overlay"]} />
                        </button>
                    </div>
                    <div id = {styles["button-continue-details-wrapper"]}>
                        <button
                            id = {styles["button-continue-details"]}
                            onClick = {() => setTimeout(() => props.setStage('configuration'), 50)}>
                            Continue
                            <div className = {styles["button-overlay"]} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
  )
}

export default Timeup;
