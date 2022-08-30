// Hooks
import { useState, useEffect } from "react";
import { useNav } from "../../store/NavContext";
import { useLang } from "../../store/LangContext";
import useHTTP from "../../hooks/useHTTP";

// Components
import Alert from "./alert/Alert";
import AlertBanner from "./alert/AlertBanner";
import AlertConjugations from "./alert/ConjugationsGroup";
import ProgressBar from "./ProgressBar";
import VerbCard from "./VerbCard";
import AudioCard from "./select/AudioCard";
import ExplainerCard from "./ExplainerCard";
import MatchCards from "./match/Cards";
import SelectCards from "./select/Cards"
import TypeInput from "./type/TypeInput"
import RaisedButton from "../common/RaisedButton/RaisedButton";

// Styles
import styles from "./learn.module.css"

function Learn(){

    // Hide navbar
    const { displayNav } = useNav()
    displayNav( false )

    // Set up HTTP variables
    const { sendRequest } = useHTTP()

    // Determine current language
    const { language } = useLang()

    const [renderContent, setRenderContent] = useState( false )

    const [audioDisabled, setAudioDisabled] = useState( false ) // Prevents excessive audio plays
    const [checkFunction, setCheckFunction] = useState( null ) // Checks answer
    const [answerChecked, setAnswerChecked] = useState( false ) // Denotes whether answer has been checked
    const [buttonVisible, setButtonVisible] = useState( false ) // Denotes whether check/continue should be visible

    // Functions that are necessary for function of 'match' activities
    const [handleMouseMove, setHandleMouseMove] = useState( () => {} );
    const [handleMouseUp, setHandleMouseUp] = useState( () => {} );

    // Configure variables that determine question layout
    const [activityType, setActivityType] = useState( "" ) // Should be one of either 'match', 'select', or 'type'
    const [promptFormat, setPromptFormat] = useState( "" ) // Should be one of either 'text', 'audio', or empty string
    const [infinitive, setInfinitive] = useState( [] ) // Array that contains the relevant keys to select audio files
    const [cardContent, setCardContent] = useState( "" ) // String that is passed to text/audio cards to specify content 
    const [explainerData, setExplainerData] = useState( "" ) // String that denotes content of explainer card

    // Initialise empty variables for the three activity types
    const [alertPairs, setAlertPairs] = useState( [] )
    const [matchPairs, setMatchPairs] = useState( [] ) // Array that contains array pairs of strings necessary for 'match' activities
    const [selectCandidates, setSelectCandidates] = useState( [] ) // Array that contains tripartite objects that specify candidates for 'select' activities
    const [typeAnswer, setTypeAnswer] = useState( "hablamos" ) // String that specifies answer for 'type' activities

    // Elements determined by switch statement
    let promptElement = null; // Contains 'prompt' element ( text or audio card )
    let answerElement = null; // Contains 'answer element ( match boxes [incl. pool], select cards, or text field)

    switch( promptFormat ){
        case "text":
            promptElement = 
                <VerbCard
                    text = { cardContent }
                    infinitive = { infinitive }
                    disabled = { audioDisabled }
                    setDisabled = { setAudioDisabled }
                />
            break;
            
        case "audio":
            console.log(infinitive);
            promptElement = 
                <AudioCard
                    audio = { cardContent }
                    infinitive = { infinitive }
                    disabled = { audioDisabled }
                    setDisabled = { setAudioDisabled }
                />
            break;
            
        default:
            break;
    }

    switch( activityType ){
        case "alert":
            answerElement = 
                <AlertConjugations 
                    pairs = { alertPairs }
                    infinitive = { infinitive }
                    disabled = { audioDisabled }
                    setDisabled = { setAudioDisabled }
                />
            break;

        case "match":
            answerElement =
                <MatchCards
                    pairs = { matchPairs }
                    setHandleFunctions = { [setHandleMouseMove, setHandleMouseUp] }
                    setButtonVisible = { setButtonVisible }
                    checkFunction = { checkFunction }
                    setCheckFunction = { setCheckFunction }
                    setChecked = { setAnswerChecked }
                />
            break;

        case "select":
            answerElement = 
                <SelectCards
                    candidates = { selectCandidates }
                    setButtonVisible = { setButtonVisible } 
                    setCheckFunction = { setCheckFunction }    
                    setChecked = { setAnswerChecked }
                />
            break;
        
        case "type":
            answerElement =
                <TypeInput
                    answer = { typeAnswer }
                    checked = { answerChecked }
                    setChecked = { setAnswerChecked}
                    setCheckFunction = { setCheckFunction }
                    setButtonVisible = { setButtonVisible }
                />
    }

    // Send request to backend to retrieve question data
    useEffect( async () => {
        const data = await sendRequest({ url: `http://localhost:9000/api/learn?language=${language.name}` })
        
        setRenderContent( false )

        setActivityType( data.activityType )
        setExplainerData( data.explainerData )
        setInfinitive ( data.infinitive )

        switch ( data.activityType ){
            case "alert":
                setAlertPairs( data.alertPairs)
                setPromptFormat( data.promptFormat )
                setCardContent( data.cardContent )
                break;
                
            case "match":
                setMatchPairs( data.matchPairs )
                break;
            
            case "select":
                setPromptFormat( data.promptFormat )
                setCardContent( data.cardContent )
                setSelectCandidates( data.selectCandidates )
                break;

            case "type":
                setPromptFormat( data.promptFormat )
                setCardContent( data.cardContent )
                setTypeAnswer( data.typeAnswer )
                break;
        }

        setRenderContent( true )
    }, [])

    // Show continue button after 5 seconds if activity type = 'alert'
    useEffect(() => {

        if ( activityType === "alert" ){
            let timeout;

            setAnswerChecked( true )

            timeout = setTimeout(() => {
                setButtonVisible( true )
            }, 5000)
        }

    }, [ activityType ])

    const handleKeyPress = e => {
        if ( e.key === "Enter" && buttonVisible ){
            if ( answerChecked ) return window.location.reload()
            return checkFunction()
        } 
    }

    return(
        <div 
            id = {styles["learn"]} 
            onKeyPress = { handleKeyPress }
            onMouseMove = { handleMouseMove }
            onMouseUp = { handleMouseUp }
            tabIndex = { -1 }>

            <ProgressBar visible = { activityType !== "alert" } />

            { renderContent && <div 
                id = {styles["content"]}
                style = {{ perspective: "1000px" }}
                activity = { activityType }
                className = { buttonVisible ? styles["button-visible"] : "" }>

                { activityType === "alert" && <AlertBanner type = { explainerData.type } />}

                {promptElement}

                <ExplainerCard 
                    data = {{...explainerData, type: `${activityType}-${explainerData.type}` }}
                />

                {answerElement}

            </div> }

            <div 
                id = { styles["button-continue__wrapper"] }
                className = { buttonVisible ? styles["button-visible"] : "" }>
                    
                <RaisedButton
                    text = { answerChecked ? "Continue" : "Check" }
                    width = { answerChecked ? "11.75em" : "9.5em" }
                    onClick = { answerChecked ? () => window.location.reload()  : checkFunction }
                />
            </div>
        </div>
    )
}

export default Learn;