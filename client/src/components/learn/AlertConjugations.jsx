import ConjugationCard from "./ConjugationCard"
import styles from "./styles/alert-conjugations.module.css"

function ConjugationsGroup( props ){

    const colors = ["red", "orange", "yellow", "green", "blue", "purple"]
    // const subjects = ["yo", "tú", "él • ella", "nosotros", "vosotros", "ellos • ellas"]
    // const conjugations = ["hablo", "hablas", "habla", "hablamos", "habláis", "hablan"]

    const subjects = props.pairs.map( pair => pair[0] )
    const conjugations = props.pairs.map( pair => pair[1] )

    return(
        <div id = {styles["cards__conjugations"]}>
            <div id = {styles["cards__conjugations__left"]}>
                {conjugations.slice(0, 3).map( (conjugation, index) => 
                    <ConjugationCard
                        key = { index }
                        conjugation = { conjugation }
                        subject = { subjects[index] }
                        color = { colors[index] }
                        dynamic = { true }
                        audioPath = { props.audioPath }
                        disabled = { props.disabled }
                        setDisabled = { props.setDisabled }
                    />
                )}
            </div>
            <div id = {styles["cards__conjugations__right"]}>
                {conjugations.slice(3, 6).map( (conjugation, index) => 
                    <ConjugationCard
                        key = { index + 3 }
                        conjugation = { conjugation }
                        subject = { subjects[index + 3] }
                        color = { colors[index + 3] }
                        dynamic = { true }
                        audioPath = { props.audioPath }
                        disabled = { props.disabled }
                        setDisabled = { props.setDisabled }
                    />
                )}
            </div>
        </div>
    );
}

export default ConjugationsGroup;