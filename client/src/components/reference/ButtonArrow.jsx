import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleLeft } from "@fortawesome/free-solid-svg-icons";

import styles from "./styles/button-arrow.module.css";

function ButtonArrow(props){
    return(
        <div id = { props.id } 
            className = {`${styles["arrow-button"]} ${styles[props.direction]}`}
            onClick = { props.onClick }>
            
            <FontAwesomeIcon icon = {faAngleLeft} />
        </div>
    );
}

export default ButtonArrow;