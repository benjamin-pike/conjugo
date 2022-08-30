import React from "react";
import styles from "./loading.module.css"

function Loading(props){

    let offset = props.header && props.footer ? 8.5 : props.header || props.footer ? 4.25: 0

    return(
        <div 
            id = {styles["loading-screen"]}
            style = {{height: `calc(100vh - ${offset}em)`}}>

            <div className = {styles["circle"]} id = {styles["circle-1"]} />
            <div className = {styles["circle"]} id = {styles["circle-2"]} />
        </div>
    );
}

export default Loading;