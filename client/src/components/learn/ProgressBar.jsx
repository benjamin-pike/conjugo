import styles from "./styles/progress-bar.module.css"

function ProgressBar( props ){
    return(
        <div 
            ref = { props.progressRef }
            id = {styles["progress-bar__wrapper"]} 
        >
            <div id = {styles["progress-bar__background"]}>
                <div
                    id = {styles["progress-bar__foreground"]}
                    style = {{ width: `${ props.progress ? props.progress * 100 : 0 }%` }}
                />
            </div>
            <button 
                id = { styles['exit']}
                onClick = { () => props.setStage('selection') }
            />
        </div>

    );
}

export default ProgressBar;