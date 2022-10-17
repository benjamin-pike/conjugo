import React, { useState, useEffect } from "react";
import { useLang } from "../../../store/LangContext.js";
import useHTTP from "../../../hooks/useHTTP.js";
import getAudio from "../../../utils/getAudio.js";
import Answer from "./Answer";
import Timeup from "./Timeup"
import Loading from "../../temporary/Loading";
import tenseNames from "../../../assets/js/map-tense-names.js"
import tenseColors from "../../../assets/js/map-tense-colors.js"
import subjectColors from "../../../assets/js/map-subject-colors.js"
import styles from "./styles/round.module.css"

function Round(props) {
    
    const { sendRequest, error } = useHTTP()
    const { language } = useLang()

    const [session, setSession] = useState({ content: [], target: 0, time: 0 })
    const [sessionStatus, setSessionStatus] = useState('active')
    const [questionIndex, setQuestionIndex] = useState(0)
    const [questionComplete, setQuestionComplete] = useState(false)
    
    const [mute, setMute] = useState(false)
    const [audio, setAudio] = useState( [] )

    const question = session.content[questionIndex]

    console.log(question)

    useEffect( async () => {
        if ( question ){
            const audioObject = await getAudio( language.name, question.infinitive, question.conjugation )
            setAudio([question.infinitive, audioObject])
        }
    }, [ question ])
    
    useEffect(async () => {
        const data = await sendRequest({ url: `/api/practice/session/${language.name}` })
        setSession(data)
    }, [])

    useEffect(() => {
        if (questionComplete && questionIndex !== session.content.length - 1) {
            if (sessionStatus !== 'complete') {                
                if ( !mute ){
                    let [ audioInfinitive, audioObject ] = audio
                    if ( audioInfinitive === question.infinitive ) 
                        audioObject.play()
                }

                setQuestionIndex(prevIndex => prevIndex + 1)
                setQuestionComplete(false)
            }
        }
    }, [session, questionComplete, questionIndex, mute])

    return (
        <>
            {sessionStatus === "timeup" && <Timeup setStage = {props.setStage} />}

            <div style = {{transition: "filter 500ms ease", filter: sessionStatus === "timeup" ? "blur(1.5vh)" : ""}}>
                <div id = {styles["corner-buttons"]}>
                    <button id = {styles["exit"]}
                        className = {styles["corner-button"]}
                        onClick = {() => props.setStage("configuration")}
                    />
                    <button id = {styles["mute"]} className = {styles["corner-button"]} onClick = {() => setMute(!mute)}>
                        <img src="./audio_on.svg" alt = "mute" className = {mute ? styles["hidden"] : ""} />
                        <img src="./audio_off.svg" alt = "mute" className = {mute ? "" : styles["hidden"]} />
                        
                    </button>
                </div>
                
                {question ? 
                    <div>
                        <div id = {styles["upper"]}>
                            <Timer 
                                time = {session.time}
                                sessionStatus = {sessionStatus}
                                setSessionStatus = {setSessionStatus}
                            />
                            <Cards
                                infinitive = {question.infinitive}
                                subject = {question.subject}
                                tense = {question.tense}
                                translation = {"to " + question.translation}
                                sessionStatus = {sessionStatus}
                                language = {language}
                            />
                        </div>

                        <div id = {styles["lower"]}>
                            <div id = {styles["answer-mount"]}>
                                <Answer
                                    styles = {styles}
                                    question = {question}
                                    resultsData = {props.resultsData}
                                    setResultsData = {props.setResultsData}
                                    setQuestionComplete = {setQuestionComplete}
                                    setSessionStatus = {setSessionStatus}
                                    sessionStatus = {sessionStatus}
                                    questionIndex = {questionIndex}
                                    target = {session.target}
                                    setStage = {props.setStage}
                                />
                                <Progress
                                    sessionStatus = {sessionStatus}
                                    questionIndex = {questionIndex}
                                    target = {session.target}
                                />
                            </div>
                        </div>
                    </div>
                    : error ?
                    <div id = {styles["temp-screen"]}>
                        <div id = {styles["error-code"]}>
                            <h1>500</h1>
                        </div>
                        <div id = {styles["error-text"]}>
                            <h2>Oops, something appears to have gone wrong!</h2>
                            <p>Please refresh the page or try again later.</p>
                        </div>
                    </div>
                    :
                    <Loading header = {false} footer = {false} />
                }
            </div>
        </>
    );
}

// COMPONENTS
function Timer(props){

    useEffect(() => {
        if (props.sessionStatus === 'complete') {
            return () => clearTimeout(timer)
        } 

        const timer = setTimeout(() => {props.setSessionStatus('timeup')}, props.time * 1000);

        return () => clearTimeout(timer);
      }, [props.sessionStatus]);

    return (
        <div id = {styles["timer"]}>
            <div id = {styles["timer-background"]} />
            <div id = {styles["timer-foreground"]} 
                className = {props.sessionStatus === "complete" ? styles["complete"] : ""} // Change color to yellow upon round completion
                style = {{
                            animation: `${styles["timer"]} ${props.time}s linear forwards`, // Start countdown timer
                            animationPlayState: `${props.sessionStatus === 'complete' ? 'paused' : 'running'}` // Pause timer upon round completion
                        }}>

                <div id = {styles["timer-highlight"]}/>
            </div>
        </div>
    );
}

function Cards(props){

    const [verbPop, setVerbPop] = useState(false)
    const [subjectPop, setSubjectPop] = useState(false)
    const [tensePop, setTensePop] = useState(false)
    const [cardFlip, setCardFlip] = useState()

    useEffect(() => {
        function handleKeyDown(e){
            props.sessionStatus !== "timeup" && e.key === 'Shift' && setCardFlip(true)
        }

        function handleKeyUp(e){
            props.sessionStatus !== "timeup" && e.key === 'Shift' && setCardFlip(false)
        }

        document.addEventListener("keydown", handleKeyDown) // Sets cardFlip to true on shift down
        document.addEventListener("keyup", handleKeyUp) // Sets cardFlip to false on shift up

        return () => {
            document.removeEventListener("keydown", handleKeyDown)
            document.removeEventListener("keyup", handleKeyUp)
        }
    })

    return (
        <div id = {styles["cards"]}>
            <div id = {styles["verb-card-container"]}> 
                <div id = {styles["verb-card"]} className = {cardFlip ? styles["flipped"] : "" /* Flips card */}>
                    <div 
                        className = {`${styles["verb-card-face"]} ${cardFlip ? styles["lighting-front"] : ""} ${verbPop ?  styles["scale"] : ""}`}  // Lighting for card front
                        id = {styles["front"]}
                        onMouseEnter = {() => setVerbPop(true)} // Listen for mouseover -> Scale up animation
                        onMouseLeave = {() => setVerbPop(false)}>
                        
                        {props.infinitive /* Front content */}
                    </div>
                    <div 
                        className = {`${styles["verb-card-face"]} ${cardFlip ?  styles["lighting-back"] : ""} ${verbPop ?  styles["scale"] : ""}`} // Lighting for card back
                        id = {styles["back"]}
                        onMouseEnter = {() => setVerbPop(true)} // Listen for mouseover -> Scale up animation 
                        onMouseLeave = {() => setVerbPop(false)}>
                        
                        {props.translation /* Back content */}
                    </div>
                </div>
            </div>

            <div id = {styles["additional-cards"]}>
                <div 
                    className = {`${styles["additional-card"]} ${subjectPop ?  styles["scale"] : ""}`} 
                    id = {styles["subject-card"]}
                    style = {{ color: !['yellow', 'green'].includes(subjectColors[props.language.name][props.subject])
                        ? `var(--${subjectColors[props.language.name][props.subject]})` 
                        : `var(--${subjectColors[props.language.name][props.subject]}-dark)` 
                    }}
                    onMouseEnter = {() => setSubjectPop(true)} // Listen for mouseover -> Scale up animation 
                    onMouseLeave = {() => setSubjectPop(false)}>
                    
                    <p style = {{ backgroundColor: `var(--${subjectColors[props.language.name][props.subject]}-highlight)`  }}>
                        {props.subject}
                    </p>
                </div>
                <div 
                    className = {`${styles["additional-card"]} ${tensePop ?  styles["scale"] : ""}`} 
                    id = {styles["tense-card"]} 
                    style = {{ color: !['yellow', 'green'].includes(tenseColors[props.tense.split('-').at(-1)])
                        ? `var(--${tenseColors[props.tense.split('-').at(-1)]})` 
                        : `var(--${tenseColors[props.tense.split('-').at(-1)]}-dark)` 
                    }}
                    onMouseEnter = {() => setTensePop(true)} // Listen for mouseover -> Scale up animation 
                    onMouseLeave = {() => setTensePop(false)}>
                    
                    <p style = {{ backgroundColor: `var(--${tenseColors[props.tense.split('-').at(-1)]}-highlight)`  }}>
                        {props.tense && tenseNames[props.tense][props.language.name]['english'].toLowerCase() }
                    </p>
                </div>
            </div>
        </div>
    );
}

function Progress(props){
    return (
        <div id = {styles["answer-progress"]}>
            <div id = {styles["answer-progress-background"]} />
            <div id = {styles["answer-progress-foreground"]}
                className = {props.sessionStatus === 'complete' 
                    ? styles["complete"] 
                    : props.sessionStatus === "timeup" 
                        ? "timeup" 
                        : ""
                }
                style = {{width: props.sessionStatus !== 'complete'
                    ? `${(props.questionIndex/props.target) * 100}%`
                    : '100%'
                }}>
                
                <div id = {styles["answer-progress-highlight"]} />
            </div>
        </div>
    );
}

export default Round;
