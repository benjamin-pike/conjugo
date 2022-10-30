import React from "react";
import styles from "./styles/loading.module.css"

function Loading(props){
    return(
        <div id = {styles['wrapper']}>
            <div className = {styles["circle"]} id = {styles["circle-1"]} />
            <div className = {styles["circle"]} id = {styles["circle-2"]} />
        </div> 
    );
}

export default Loading;