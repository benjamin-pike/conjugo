import React from "react";
import styles from "./styles.module.css"

function RaisedButton( props ){

    const containerStyling = {
        marginTop: props.marginTop ? props.marginTop : "0",
        marginBottom: props.marginBottom ? props.marginBottom : "0",
        marginLeft: props.marginLeft ? props.marginLeft : "auto",
        marginRight: props.marginRight ? props.marginRight : "auto",
        width: props.width ? props.width : "fit-content"
    }

    const buttonStyling = {
        fontSize: props.fontSize ? props.fontSize : "1.5em",

        paddingTop: props.verticalPadding ? props.verticalPadding : "0.6em",
        paddingBottom: props.verticalPadding ? props.verticalPadding : "0.6em",
        paddingLeft: props.horizontalPadding ? props.horizontalPadding : "1.5em",
        paddingRight: props.horizontalPadding ? props.horizontalPadding : "1.5em",
    }

    return(
        <div className = { styles["raised-button__container"] } style = { containerStyling }>
            <button
                className = { styles["raised-button__button"] }
                style = { buttonStyling }
                disabled = { props.disabled }
                onClick = { props.onClick } >
                
                <p>{ props.text }</p>
            </button>
        </div>
    );
}

export default RaisedButton;