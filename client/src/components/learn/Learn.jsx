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
    const [currentQuestion, setCurrentQuestion] = useState( {format: {}, content: {}} )
    const [lessonData, setLessonData] = useState( [] )

    const [renderContent, setRenderContent] = useState( false )

    const [audioDisabled, setAudioDisabled] = useState( false ) // Prevents excessive audio plays
    const [checkFunction, setCheckFunction] = useState( null ) // Checks answer
    const [answerChecked, setAnswerChecked] = useState( false ) // Denotes whether answer has been checked
    const [buttonVisible, setButtonVisible] = useState( false ) // Denotes whether check/continue should be visible

    // Necessary for function of 'match' activities
    const [handleMouseAction, setHandleMouseAction] = useState( null )
    // const handleMouseAction = useRef( null )

    // Intialise contentRef
    const contentRef = useRef( null )
    const buttonRef = useRef( null )
    const handleKeyPressRef = useRef( null )

    // Elements determined by switch statement
    let promptElement = null; // Contains 'prompt' element ( text or audio card )
    let answerElement = null; // Contains 'answer element ( match boxes [incl. pool], select cards, or text field)
    console.log(lessonData, currentQuestion)
    if (currentQuestion.format.prompt){
        promptElement = currentQuestion.format.prompt === "audio" 
            ? <AudioCard
                audio = { currentQuestion.content.card }
                infinitive = { currentQuestion.infinitive }
                disabled = { audioDisabled }
                setDisabled = { setAudioDisabled }
            />
            : <VerbCard
                text = { currentQuestion.content.card }
                infinitive = { currentQuestion.infinitive }
                disabled = { audioDisabled }
                setDisabled = { setAudioDisabled }
            />
    }

    switch(currentQuestion.format.action){
        case "alert":
            answerElement = 
                <AlertConjugations 
                    pairs = { currentQuestion.content.pairs }
                    infinitive = { currentQuestion.infinitive }
                    disabled = { audioDisabled }
                    setDisabled = { setAudioDisabled }
                />
            break;

        case "match":
            answerElement =
                <MatchCards
                    pairs = { currentQuestion.content.pairs }
                    handleKeyPress = { handleKeyPressRef }
                    setHandleMouseAction = { setHandleMouseAction }
                    setButtonVisible = { setButtonVisible }
                    checkFunction = { currentQuestion.checkFunction }
                    setCheckFunction = { setCheckFunction }
                    checked = { answerChecked } 
                    setChecked = { setAnswerChecked }
                />
            break;

        case "select":
            answerElement = 
                <SelectCards
                    candidates = { currentQuestion.content.options }
                    handleKeyPress = { handleKeyPressRef }
                    setButtonVisible = { setButtonVisible } 
                    setCheckFunction = { setCheckFunction }
                    checked = { answerChecked } 
                    setChecked = { setAnswerChecked }
                />
            break;
        
        case "type":
            answerElement =
                <TypeInput
                    answer = { currentQuestion.content.answer }
                    checked = { answerChecked }
                    setChecked = { setAnswerChecked}
                    setCheckFunction = { setCheckFunction }
                    setButtonVisible = { setButtonVisible }
                />
    }

    // Send request to backend to retrieve lesson data
    useEffect( async () => {
        setRenderContent( false )
        const data = await sendRequest({ url: `api/learn/lesson/${language.name}/simple/indicative/present` })
        setLessonData( data )
    }, [])

    // Reset state when question index is updated
    useEffect(() => { 
        if ( questionIndex ){

            if (contentRef.current) { 
                contentRef.current.style.setProperty( "animation", `${styles['content-out']} 500ms ease forwards` );
                buttonRef.current.style.setProperty( "animation", `${styles['button-out']} 500ms ease forwards` );
            }

            setTimeout(() => {
                setAudioDisabled( false )
                setCheckFunction( null )
                setAnswerChecked( false )
                setButtonVisible( false )
                
                setRenderContent( false )
            }, 500)


            setTimeout(() => {
                buttonRef.current.style.setProperty( "animation", "" );
            }, 550)
        }

    }, [ questionIndex ])

    // In order to force rerender, set render boolean to true after it has set to false
    useEffect(() => {
        if ( !renderContent && lessonData.length){
            setCurrentQuestion( lessonData[ questionIndex ] )
            setRenderContent( true )
        } 
    }, [ lessonData, renderContent, contentRef.current ])

    // Show continue button after 5 seconds if activity type = 'alert'
    useEffect(() => {

        if ( currentQuestion.format.action === "alert" ){
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

        if (handleKeyPressRef.current) handleKeyPressRef.current( e )
    }

    return(
        <div 
            id = {styles["learn"]} 
            onKeyPress = { handleKeyPress }
            onMouseMove = { handleMouseAction }
            onMouseUp = { handleMouseAction }
            tabIndex = { -1 }>

            { currentQuestion && <ProgressBar 
                visible = { currentQuestion.format.action !== "alert" }
                progress = { questionIndex / lessonData.length }
            /> }

            { renderContent && <div
                ref = { contentRef }
                id = {styles["content"]}
                style = {{ 
                    perspective: "1000px",
                    animation: questionIndex ? `${ styles["content-in"] } 500ms ease forwards` : ""
                }}
                activity = { currentQuestion.format.action }
                className = { buttonVisible ? styles["button-visible"] : "" }>

                    { currentQuestion.format.action === "alert" && <AlertBanner type = { 'new' } />}

                    {promptElement}

                    <ExplainerCard 
                        format = { currentQuestion.format }
                        infinitive = { currentQuestion.infinitive }
                        content = { currentQuestion.content }
                    />

                    {answerElement}

            </div> }

            <div 
                ref = { buttonRef }
                id = { styles["button-continue__wrapper"] }
                className = { buttonVisible ? styles["button-visible"] : styles["button-hidden"] }>
                    
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