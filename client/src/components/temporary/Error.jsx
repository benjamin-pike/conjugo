import React from "react";
import styles from "./styles/error.module.css"

function Error(props){

    const offset = props.header && props.footer ? 8.5 : props.header || props.footer ? 4.25: 0

    const error = {
        401: {
            main: "You are not authorized to access this resource.",
            sub: "Please try logging in again."
        },
        403: {
            main: "You are not authorized to access this resource.",
            sub: "Please try logging in again."
        },
    }

    return(

        <div 
            id = {styles["error-screen"]}
            style = {{height: `calc(100vh - ${offset}em)`}}>
            
            <div id = {styles["error-code"]}>
                <h1>{props.statusCode}</h1>
            </div>
            <div id = {styles["error-text"]}>
                <h2>{error[props.statusCode] ? error[props.statusCode].main : "Oops, something appears to have gone wrong!"}</h2>
                <p>{error[props.statusCode] ? error[props.statusCode].sub : "Please refresh the page or try again later."}</p>
            </div>
        </div>
    );
}

export default Error;