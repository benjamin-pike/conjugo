import ConjugationCard from "./ConjugationCard";

function Boxes( props ){

    const styles = props.styles

    const subjects = props.boxCards.map( subject => <ConjugationCard subject = {subject} /> )

    const boxes = props.boxCards.map( subject => 
        <div 
            ref = { ref => props.boxes[subject] = ref }
            className = { styles["cards__box"] + " " + styles[`${props.boxStates[subject] ? "filled" : "empty"}`] }
            style = { props.dimensions.width ? {
                width: props.dimensions.width - 0.05 + "em",
                height: props.dimensions.height + "em"
            } : {} }>            
            <svg> 
                <rect rx = "0.4em" ry = "0.4em" />
            </svg>
        </div>
    )

    return(
        <div id = {styles["cards"]}>
            <div id = { styles["cards__singular"] }>
                <div className = {styles["cards__subjects"]}>
                    { subjects.slice( 0, 3 ) }
                </div>
                <div className = {styles["cards__boxes"]}>
                    { boxes.slice( 0, 3 ) }
                </div>
            </div>
            <div id = { styles["cards__plural"] }>
                <div className = {styles["cards__subjects"]}>
                    { subjects.slice( 3, 6 ) }
                </div>
                <div className = {styles["cards__boxes"]}>
                    { boxes.slice( 3, 6 ) }
                </div>
            </div>
        </div>
    );

}

export default Boxes;