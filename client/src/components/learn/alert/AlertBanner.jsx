import newVerb from "../../../assets/images/new-verb.svg"
import irregularVerb from "../../../assets/images/irregular-verb.svg"
import stemChangingVerb from "../../../assets/images/stem-changing-verb.svg"

import styles from "./styles_alert-banner.module.css"

function AlertBanner( props ){

    const text = { 
        "new": newVerb, 
        "irregular": irregularVerb, 
        "stem": stemChangingVerb
    }

    return(
        <div id = {styles["alert"]} className = {styles[props.type]}>
            <img id = {styles["alert__text"]} src = { text[props.type] } draggable = {false} />
            <img id = {styles["alert__shadow"]} src = { text[props.type] } draggable = {false} />
        </div>
    );
}

export default AlertBanner;