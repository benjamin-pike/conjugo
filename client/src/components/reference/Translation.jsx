import Tooltip from "./Tooltip";

import styles from "./styles/details.module.css";

function Translation(props){

    const frequency = props.weight > 0.7 ? 3 : props.weight > 0.4 ? 2 : 1
    const frequencyText = frequency > 2 ? "Very Common" : frequency > 1 ? "Common" : "Uncommon" 

    return(
        <div className = {styles["translation"]}>
            <p className = {styles["eng"]}>
                <span style = {{fontWeight: 500, opacity: "40%"}}>to </span>
                {props.translation}
            </p>

            <div className = {styles["translation-bars"]}>
                <div className = {styles["translation-bars__1"]} />
                <div className = {styles["translation-bars__2"]} style = {{opacity: frequency > 1 ? "100%" : "25%"}} />
                <div className = {styles["translation-bars__3"]} style = {{opacity: frequency > 2 ? "100%" : "25%"}} />
            </div>
        
            <Tooltip text = { frequencyText } color = {"var(--blue)"} direction = {"left"} />
        </div>
    )
}

export default Translation;