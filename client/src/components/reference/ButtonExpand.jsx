import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExpand, faCompress } from "@fortawesome/free-solid-svg-icons";

import styles from "./styles/details.module.css";

function ButtonExpand(props){
    return(
        <div id = {styles["conjugations__expand"]}>
            <button id = {styles["conjugations__expand-button"]} onClick = {() => props.displayNav(!props.navVisible)}>
                <FontAwesomeIcon icon= { props.navVisible ? faExpand : faCompress } />
            </button>
        </div>
    );
}

export default ButtonExpand;