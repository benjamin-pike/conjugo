import styles from "./styles/details.module.css";

function Tooltip(props){
    return(
        <div className = {`${styles["tooltip"]} ${styles[props.direction]}`}>
            <div className = {styles["tooltip__arrow"]} style = {{borderColor: `transparent transparent var(--${props.color})`}} />
            <p className = {styles["tooltip__body"]} style = {{backgroundColor: `var(--${props.color}`}}>
                {props.text}
            </p>
        </div>
    )
}

export default Tooltip;