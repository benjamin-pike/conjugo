import { useRef } from "react"
import getAudio from "../../functions/getAudio"
import useHTTP from "../../hooks/useHTTP"
import { useLang } from "../../store/LangContext"
import styles from "./styles/conjugation-card.module.css"

function ConjugationCard( props ){

    const c1Ref = useRef()
    const c2Ref = useRef()

    const { sendRequest } = useHTTP()
    const { language } = useLang()

    // const processAudio = async () => {
    //     const [infinitive, complexity, mood, tense] = props.audioPath

    //     const data = await sendRequest({ url: `http://localhost:9000/api/reference/audio?language=spanish&verb=${infinitive}&complexity=${complexity}&mood=${mood}&tense=${tense}&conjugation=${props.conjugation}` })
    //     const audio = new Audio(`data:audio/mp3;base64, ${data.audio}`)
        
    //     audio.play()
        
    //     return new Promise( resolve => 
    //         audio.onloadedmetadata = () => 
    //             resolve( audio.duration )
    //     )
    // }

    const handleClick = async (e) => {

        if ( !props.disabled ){
            console.log(props)
            const { play: playAudio, duration } = 
                await getAudio( language.name, props.infinitive, props.conjugation )

            const circle1 = c1Ref.current
            const circle2 = c2Ref.current
            
            const boundaries = e.target.getBoundingClientRect()

            const x = e.clientX - boundaries.left
            const y = e.clientY - boundaries.top
    
            circle1.style.left = x.toString() + "px"
            circle1.style.top = y.toString() + "px"
    
            circle2.style.left = x.toString() + "px"
            circle2.style.top = y.toString() + "px"
            
            circle1.style.animation = `${styles["pulse-small"]} 500ms ease forwards`
            
            props.setDisabled( true )
                            
            setTimeout(() => circle2.style.animation = `${styles["pulse-small"]} 500ms ease forwards`, 200)
            
            setTimeout(() => circle1.style.animation = "none", 500)
            setTimeout(() =>  circle2.style.animation = "none", 700)
    
            playAudio()

            setTimeout( () => props.setDisabled( false ), ( duration * 1000 ) - 200 )
        }
    }

    if ( props.dynamic ) return(
        <button
            className = {styles["card__conjugations__face"]}
            color = { props.color }
            onClick = { handleClick }>
            <p>
                {props.subject && <span 
                    className = {`${styles["card_conjugations__subject"]}${props.conjugation ? " " + styles["bipartite"] : ""}`}>
                        
                    { props.subject }
                </span>}
                {props.conjugation && <span 
                    className = {`${styles["card_conjugations__conjugation"]}${props.subject ? " " + styles["bipartite"] : ""}`}
                    style = {{ color: `var(--${props.color})` }}>
                    
                    { props.conjugation }
                </span>}
            </p>

            <div className = {styles["card__conjugations__face__pulse__wrapper"]}>
                <div ref = { c1Ref } className = {styles["card__conjugations__face__pulse__circle1"]} /> 
                <div ref = { c2Ref } className = {styles["card__conjugations__face__pulse__circle2"]} />
            </div>
        </button>
    );

    return (
        <div className = {styles["card__conjugations__face"]}>
            <p>
                {props.subject && <span 
                        className = {`${styles["card_conjugations__subject"]}${props.conjugation ? " " + styles["bipartite"] : ""}`}>
                            
                        { props.subject }
                </span>}
                {props.conjugation && <span 
                        className = {`${styles["card_conjugations__conjugation"]}${props.subject ? " " + styles["bipartite"] : ""}`}
                        style = {{ color: `var(--${props.color ? props.color : "textcolor"})` }}>
                        
                        { props.conjugation }
                </span>}
            </p>
        </div>
    );
}

export default ConjugationCard;