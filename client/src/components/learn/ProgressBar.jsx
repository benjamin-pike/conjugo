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
            <Link to = "/reference" id = { styles["exit"]}>
                <button />
            </Link>
        </div>

    );
}

export default ProgressBar;