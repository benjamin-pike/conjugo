import { Link } from 'react-router-dom';
import styles from "./styles/progress-bar.module.css"

function ProgressBar( props ){
    return(
        <div id = {styles["progress-bar__wrapper"]} visible = { props.visible ? "true" : "false" }>
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