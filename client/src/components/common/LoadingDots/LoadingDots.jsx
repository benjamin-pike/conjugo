import React from "react";
import styles from "./loading-dots.module.css"

function LoadingDots(props){
    return(
        <div 
            className = {styles["container"]} 
            id = {`loading-dots__${props.id}`}
            style = { props.style ? props.style : {} }
        >
                {[1, 2, 3].map(n => <div
                    key = {`loading_circle_${n}`}
                    className = {styles[`circle-${n}`]}
                    style = {{
                        backgroundColor: `${props.dark ? "var(--textcolor50)" : "var(--offwhite)"}`,
                        width: `${props.size}em`,
                        margin: `0 ${props.size * 0.8}em`
                    }} 
                />)}
        </div>
    );
}

export default LoadingDots;