// Hooks
import { useState, useEffect, useRef } from "react";
import { useNav } from "../../store/NavContext";
import { useLang } from "../../store/LangContext";
import useHTTP from "../../hooks/useHTTP";

// Components
import AlertBanner from "./AlertBanner";
import AlertConjugations from "./AlertConjugations";
import ProgressBar from "./ProgressBar";
import VerbCard from "./VerbCard";
import AudioCard from "./AudioCard";
import ExplainerCard from "./ExplainerCard";
import MatchCards from "./MatchCards";
import SelectCards from "./SelectCards"
import TypeInput from "./TypeInput"
import RaisedButton from "../common/RaisedButton/RaisedButton";

// Styles
import styles from "./styles/learn.module.css"

function Learn(){

    // Hide navbar
    const { displayNav } = useNav()
    displayNav( false )

    // Set up HTTP variables
    const { sendRequest } = useHTTP()

    // Determine current language
    const { language } = useLang()

    const [questionIndex, setQuestionIndex] = useState( 0 )
    const [currentQuestion, setCurrentQuestion] = useState( {} )
    const [lessonData, setLessonData] = useState( [] )

    const [renderContent, setRenderContent] = useState( false )

    const [audioDisabled, setAudioDisabled] = useState( false ) // Prevents excessive audio plays
    const [checkFunction, setCheckFunction] = useState( null ) // Checks answer
    const [answerChecked, setAnswerChecked] = useState( false ) // Denotes whether answer has been checked
    const [buttonVisible, setButtonVisible] = useState( false ) // Denotes whether check/continue should be visible

    // Functions that are necessary for function of 'match' activities
    const [handleMouseMove, setHandleMouseMove] = useState( null );
    const [handleMouseUp, setHandleMouseUp] = useState( null );

    // Configure variables that determine question layout
    // const [activityType, setActivityType] = useState( "" ) // Should be one of either 'match', 'select', or 'type'
    // const [promptFormat, setPromptFormat] = useState( "" ) // Should be one of either 'text', 'audio', or empty string
    // const [infinitive, setInfinitive] = useState( [] ) // Array that contains the relevant keys to select audio files
    // const [cardContent, setCardContent] = useState( "" ) // String that is passed to text/audio cards to specify content 
    // const [explainerData, setExplainerData] = useState( "" ) // String that denotes content of explainer card

    // // Initialise empty variables for the three activity types
    // const [alertConjugations, setAlertConjugations] = useState( [] )
    // const [matchPairs, setMatchPairs] = useState( [] ) // Array that contains array pairs of strings necessary for 'match' activities
    // const [selectCandidates, setSelectCandidates] = useState( [] ) // Array that contains tripartite objects that specify candidates for 'select' activities
    // const [typeAnswer, setTypeAnswer] = useState( "" ) // String that specifies answer for 'type' activities

    // Intialise contentRef
    const contentRef = useRef( null )

    // Elements determined by switch statement
    let promptElement = null; // Contains 'prompt' element ( text or audio card )
    let answerElement = null; // Contains 'answer element ( match boxes [incl. pool], select cards, or text field)

    // const currentQuestion = lessonData[ questionIndex ] ?? {}

    switch( currentQuestion.promptFormat ){
        case "text":
            promptElement = 
                <VerbCard
                    text = { currentQuestion.cardContent }
                    infinitive = { currentQuestion.infinitive }
                    disabled = { audioDisabled }
                    setDisabled = { setAudioDisabled }
                />
            break;
            
        case "audio":
            promptElement = 
                <AudioCard
                    audio = { currentQuestion.cardContent }
                    infinitive = { currentQuestion.infinitive }
                    disabled = { audioDisabled }
                    setDisabled = { setAudioDisabled }
                />
            break;
            
        default:
            break;
    }

    switch( currentQuestion.activityType ){
        case "alert":
            answerElement = 
                <AlertConjugations 
                    pairs = { currentQuestion.alertConjugations }
                    infinitive = { currentQuestion.infinitive }
                    disabled = { audioDisabled }
                    setDisabled = { setAudioDisabled }
                />
            break;

        case "match":
            answerElement =
                <MatchCards
                    pairs = { currentQuestion.matchPairs }
                    setHandleFunctions = { [setHandleMouseMove, setHandleMouseUp] }
                    setButtonVisible = { setButtonVisible }
                    checkFunction = { currentQuestion.checkFunction }
                    setCheckFunction = { setCheckFunction }
                    setChecked = { setAnswerChecked }
                />
            break;

        case "select":
            answerElement = 
                <SelectCards
                    candidates = { currentQuestion.selectCandidates }
                    setButtonVisible = { setButtonVisible } 
                    setCheckFunction = { setCheckFunction }    
                    setChecked = { setAnswerChecked }
                />
            break;
        
        case "type":
            answerElement =
                <TypeInput
                    answer = { currentQuestion.typeAnswer }
                    checked = { answerChecked }
                    setChecked = { setAnswerChecked}
                    setCheckFunction = { setCheckFunction }
                    setButtonVisible = { setButtonVisible }
                />
    }

    // Send request to backend to retrieve lesson data
    useEffect( async () => {
        setRenderContent( false )
        const data = await sendRequest({ url: `http://localhost:9000/api/lesson?language=${language.name}` })
        setLessonData( data )
    }, [])

    // Reset state when question index is updated
    useEffect(() => { 
        if ( lessonData.length ){

            if ( contentRef.current ){
                const contentStyle = contentRef.current.style
            
                contentStyle.transition = "transform 5000ms ease, opacity 5000ms ease"
                contentStyle.transform = "translateX(-5em)"
                contentStyle.opacity = "0"
                contentStyle.animation = `${styles["content-in"]} 500ms ease forwards`

                console.log(contentRef.current.style.transform)

                setTimeout(() => {
                    setRenderContent( false )
    
                    setAudioDisabled( false )
                    // setCheckFunction( null )
                    setAnswerChecked( false )
                    setButtonVisible( false )
                    setHandleMouseMove( null )
                    setHandleMouseUp( null )
                }, 5000)
            }

            
        }

    }, [ lessonData, questionIndex ])

    // In order to force rerender, set render boolean to true after it has set to false
    useEffect(() => {
        if ( !renderContent && lessonData.length){
            setCurrentQuestion( lessonData[ questionIndex ] )
            setRenderContent( true )
        } 
    }, [ lessonData, renderContent, contentRef.current ])

    contentRef.current && console.log(contentRef.current.style.transition)

    // Show continue button after 5 seconds if activity type = 'alert'
    useEffect(() => {

        if ( currentQuestion.activityType === "alert" ){
            let timeout;

            setAnswerChecked( true )

            timeout = setTimeout(() => {
                setButtonVisible( true )
            }, 5000)
        }

    }, [ questionIndex ])

    const handleKeyPress = e => {
        if ( e.key === "Enter" && buttonVisible ){
            if ( answerChecked ) return setQuestionIndex( current => current + 1 )
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

            { currentQuestion.activityType && <ProgressBar 
                visible = { currentQuestion.activityType !== "alert" }
                progress = { questionIndex / lessonData.length }
            /> }

            { renderContent && <div
                ref = { contentRef }
                id = {styles["content"]}
                style = {{ perspective: "1000px" }}
                activity = { currentQuestion.activityType }
                className = { buttonVisible ? styles["button-visible"] : "" }>

                { currentQuestion.activityType === "alert" && <AlertBanner type = { currentQuestion.explainerData.type } />}

                {promptElement}

                <ExplainerCard 
                    data = {{
                        ...currentQuestion.explainerData, 
                        type: `${currentQuestion.activityType}-${currentQuestion.explainerData.type}` 
                    }}
                />

                {answerElement}

            </div> }

            <div 
                id = { styles["button-continue__wrapper"] }
                className = { buttonVisible ? styles["button-visible"] : "" }>
                    
                <RaisedButton
                    text = { answerChecked ? "Continue" : "Check" }
                    width = { answerChecked ? "11.75em" : "9.5em" }
                    onClick = { answerChecked ? () => setQuestionIndex( current => current + 1 ) : checkFunction }
                />
            </div>
        </div>
    )
}

export default Learn;