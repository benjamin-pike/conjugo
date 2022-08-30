import React, { useState, useEffect } from "react";
import { useLang } from "../../../store/LangContext.js";
import useHTTP from "../../../hooks/useHTTP.js";
import getAudio from "../../../functions/getAudio.js";
import Answer from "./Answer";
import Timeup from "./Timeup"
import Loading from "../../temporary/Loading";
import tenseNames from "../../../assets/js/map-tense-names.js"
import tenseColors from "../../../assets/js/map-tense-colors.js"
import subjectColors from "../../../assets/js/map-subject-colors.js"
import styles from "./round.module.css"

function Round(props) {

    const [round, setRound] = useState({data: [], points: 0, time: 0})
    const [complete, setComplete] = useState(false)
    const [roundStatus, setRoundStatus] = useState('active')
    const [conjugation, setConjugation] = useState({infinitive: '', complexity: '', mood: '', tense: '', subject: '', conjugation: '', translation: '', audio: ''})
    const [rep, setRep] = useState(0)
    const [mute, setMute] = useState(false)

    const [audio, setAudio] = useState( [] )

    const { sendRequest, error } = useHTTP()
    const { language: { name: language } } = useLang()

    const getRound = async () => {
        const data = await sendRequest({ url: `http://localhost:9000/api/conjugations?language=${language}` })
        setRound(data)
    }

    useEffect( async () => {
        if ( conjugation.infinitive ){
            const audioObject = await getAudio( language, conjugation.infinitive, conjugation.conjugation )
            setAudio( [ conjugation.infinitive, audioObject ] )
        }
    }, [ conjugation ])
    
    useEffect(() => {getRound(); console.log(true)}, [])

    useEffect(() => {

        if ((round.data.length !== 0) && (rep != round.data.length)){
            
            setConjugation(round.data[rep])

            if (complete){
                if (roundStatus !== 'complete'){
                    setConjugation(round.data[rep])
                    setComplete(false)
                    setRep(rep + 1)
                    
                    if ( !mute ){
                        let [ audioInfinitive, audioObject ] = audio
                        if ( audioInfinitive === conjugation.infinitive ) audioObject.play()
                    }
                }
                else{
                    setRep(rep + 1)

                    console.log(props.resultsData)
                }
            }

        }
    }, [round, complete, conjugation, mute])

    return (
        <>
            {roundStatus === "timeup" && <Timeup setStage = {props.setStage} />}

            <div style = {{transition: "filter 500ms ease", filter: roundStatus === "timeup" ? "blur(1.5vh)" : ""}}>
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
                
                {round.data.length !== 0 ? 
                    <div>
                        <div id = {styles["upper"]}>
                            <Timer 
                                time = {round.time}
                                roundStatus = {roundStatus}
                                setRoundStatus = {setRoundStatus}
                            />
                            <Cards
                                infinitive = {conjugation.infinitive}
                                complexity = {conjugation.complexity}
                                mood = {conjugation.mood}
                                subject = {conjugation.subject}
                                tense = {conjugation.tense}
                                translation = {"to " + conjugation.translation}
                                roundStatus = {roundStatus}
                                language = {language}
                            />
                        </div>

                        <div id = {styles["lower"]}>
                            <div id = {styles["answer-mount"]}>
                                <Answer
                                    styles = {styles}
                                    conjugation = {conjugation}
                                    resultsData = {props.resultsData}
                                    setResultsData = {props.setResultsData}
                                    setComplete = {setComplete}
                                    setRoundStatus = {setRoundStatus}
                                    roundStatus = {roundStatus}
                                    rep = {rep}
                                    roundLength = {round.points}
                                    setStage = {props.setStage}
                                />
                                <Progress
                                    roundStatus = {roundStatus}
                                    rep = {rep}
                                    points = {round.points}
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

        if (props.roundStatus === 'complete'){return () => clearTimeout(timer);} 

        const timer = setTimeout(() => {props.setRoundStatus('timeup')}, props.time * 1000);

        return () => clearTimeout(timer);

      }, [props.roundStatus]);

    return (
        <div id = {styles["timer"]}>
            <div id = {styles["timer-background"]} />
            <div id = {styles["timer-foreground"]} 
                className = {props.roundStatus === "complete" ? styles["complete"] : ""} // Change color to yellow upon round completion
                style = {{
                            animation: `${styles["timer"]} ${props.time}s linear forwards`, // Start countdown timer
                            animationPlayState: `${props.roundStatus === 'complete' ? 'paused' : 'running'}` // Pause timer upon round completion
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
            props.roundStatus !== "timeup" && e.key === 'Shift' && setCardFlip(true)
            console.log(props.roundStatus)
        }

        function handleKeyUp(e){
            props.roundStatus !== "timeup" && e.key === 'Shift' && setCardFlip(false)
        }

        document.addEventListener("keydown", handleKeyDown) // Sets cardFlip to true on shift down
        document.addEventListener("keyup", handleKeyUp) // Sets cardFlip to false on shift up

        return () => {
            document.removeEventListener("keydown", handleKeyDown)
            document.removeEventListener("keyup", handleKeyUp)
        }
    })

    console.log(tenseNames, `${props.complexity}-${props.mood}-${props.tense}`)

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
                    style = {{color: props.infinitive !== '' ? `var(--${subjectColors[props.language][props.subject]})` : 'var(--textcolor)'}}
                    onMouseEnter = {() => setSubjectPop(true)} // Listen for mouseover -> Scale up animation 
                    onMouseLeave = {() => setSubjectPop(false)}>
                    
                    {props.subject}
                </div>
                <div 
                    className = {`${styles["additional-card"]} ${tensePop ?  styles["scale"] : ""}`} 
                    id = {styles["tense-card"]} 
                    style = {{color: props.infinitive !== '' ? `var(--${tenseColors[props.tense]})` : 'var(--textcolor)'}}
                    onMouseEnter = {() => setTensePop(true)} // Listen for mouseover -> Scale up animation 
                    onMouseLeave = {() => setTensePop(false)}>
                    
                    { props.tense &&
                        tenseNames[`${props.complexity}-${props.mood}-${props.tense}`][props.language]['english'].toLowerCase() }
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
                className = {props.roundStatus === 'complete' ? styles["complete"] : props.roundStatus === "timeup" ? "timeup" : ""}
                style = {{width: `${(props.rep/props.points) * 100}%`}}>
                
                <div id = {styles["answer-progress-highlight"]} />
            </div>
        </div>
    );
}

export default Round;
