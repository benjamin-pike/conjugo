import { useRef } from "react"
import { useLang } from "../../store/LangContext"
import styles from "./styles/verb-card.module.css"
import getAudio from "../../functions/getAudio"

function VerbCard( props ){

    const { language } = useLang()

    const cardRef = useRef()
    const cardTextRef = useRef()
    const pulseRef = useRef() 

    const card = cardRef.current
    const cardText = cardTextRef.current
    const pulse = pulseRef.current

    const handleMouseMove = e => {
        const boundaries = card.getBoundingClientRect()

        const x = ( e.clientX - boundaries.left ) / card.offsetWidth
        const y = ( e.clientY - boundaries.top ) / card.offsetHeight

        card.style.transform = `scale(1.05) rotateY(${(x - 0.5) * 30}deg) rotateX(${(y - 0.5) * -30}deg)`
        card.style.filter = `brightness(${ 0.99 + 0.025 * (1 - x) + 0.05 * (1 - y) }`

        cardText.style.filter = `brightness(${ 0.85 + 0.15 * (1 - x) + 0.3 * (1 - y) }`
    }

    const handleMouseLeave = () => {
        card.style.transform = ""
        card.style.filter = ""

        cardText.style.filter = ""
    }

    const handleClick = async (e) => {

        const [ c1, c2 ] = [ ...pulse.children ]

        if ( !props.disabled ){
            const boundaries = e.target.getBoundingClientRect()
            let duration;
            
            const x = e.clientX - boundaries.left
            const y = e.clientY - boundaries.top
    
            c1.style.left = x.toString() + "px"
            c1.style.top = y.toString() + "px"
    
            c2.style.left = x.toString() + "px"
            c2.style.top = y.toString() + "px"

            c1.style.transform = `translate(calc(-50% - ${ x / e.target.offsetWidth }em), calc(-50% - ${ y / e.target.offsetHeight }em))`
            c2.style.transform = `translate(calc(-50% - ${ x / e.target.offsetWidth }em), calc(-50% - ${ y / e.target.offsetHeight }em))`
            
            c1.style.animation = `${styles["pulse-big"]} 500ms ease forwards`
                                        
            setTimeout(() => c2.style.animation = `${styles["pulse-big"]} 500ms ease forwards`, 200)
            
            setTimeout(() => c1.style.animation = "none", 500)
            setTimeout(() =>  c2.style.animation = "none", 700)
    
            if ( props.infinitive ){
                const audio = await getAudio( language.name, props.infinitive, props.text )
                duration = audio.duration
                audio.play()
            } else 
                duration = props.duration

            props.setDisabled( true )
            setTimeout( () => props.setDisabled( false ), ( ( duration ) * 1000 ) - 200 )
        }
    }

    // useEffect(() => {
    //     const card = document.getElementById( styles["card__verb"] )
    //     const cardText = card.querySelector( "p" )

    //     const handleMouseMove = e => {
    //         const boundaries = card.getBoundingClientRect()

    //         const x = ( e.clientX - boundaries.left ) / card.offsetWidth
    //         const y = ( e.clientY - boundaries.top ) / card.offsetHeight

    //         card.style.transform = `scale(1.05) rotateY(${(x - 0.5) * 30}deg) rotateX(${(y - 0.5) * -30}deg)`
    //         card.style.filter = `brightness(${ 0.99 + 0.025 * (1 - x) + 0.05 * (1 - y) }`

    //         cardText.style.filter = `brightness(${ 0.85 + 0.15 * (1 - x) + 0.3 * (1 - y) }`
    //     }

    //     const handleMouseLeave = e => {
    //         card.style.transform = ""
    //         card.style.filter = ""

    //         cardText.style.filter = ""
    //     }

    //     const handleClick = async (e) => {
    //         const [ circle1, circle2 ] = [...pulseRef.current.children]
    
    //         if ( !props.disabled ){
    //             const boundaries = e.target.getBoundingClientRect()
                
    //             const x = e.clientX - boundaries.left
    //             const y = e.clientY - boundaries.top
        
    //             circle1.style.left = x.toString() + "px"
    //             circle1.style.top = y.toString() + "px"
        
    //             circle2.style.left = x.toString() + "px"
    //             circle2.style.top = y.toString() + "px"

    //             circle1.style.transform = `translate(calc(-50% - ${ x / e.target.offsetWidth }em), calc(-50% - ${ y / e.target.offsetHeight }em))`
    //             circle2.style.transform = `translate(calc(-50% - ${ x / e.target.offsetWidth }em), calc(-50% - ${ y / e.target.offsetHeight }em))`
                
    //             circle1.style.animation = `${styles["pulse-big"]} 500ms ease forwards`
                
    //             props.setDisabled( true )
                                
    //             setTimeout(() => circle2.style.animation = `${styles["pulse-big"]} 500ms ease forwards`, 200)
                
    //             setTimeout(() => circle1.style.animation = "none", 500)
    //             setTimeout(() =>  circle2.style.animation = "none", 700)
        
    //             // const pause = await processAudio()
    //             const { playAudio: play, duration } = getAudio( language.name, infinitive, props.text, true )
    
    //             playAudio()

    //             setTimeout( () => props.setDisabled( false ), ( duration * 1000 ) - 200 )
    //         }
    //     }
        
    //     card.addEventListener( "click", handleClick )
    //     card.addEventListener( "mousemove", handleMouseMove )
    //     card.addEventListener( "mouseleave", handleMouseLeave )

    //     return () => {
    //         card.removeEventListener( "click", handleClick )
    //         card.removeEventListener( "mousemove", handleMouseMove )
    //         card.removeEventListener( "mouseleave", handleMouseLeave )

    //     }

    // }, [])

    return(
        <div 
            ref = { cardRef } 
            id = {styles["card__verb"]}
            onMouseMove = { handleMouseMove }
            onMouseLeave = { handleMouseLeave }
            onClick = { handleClick }>

            <p ref = { cardTextRef }> { props.text } </p>

            <div ref = { pulseRef } className = {styles["card__verb__pulse__wrapper"]}>
                <div className = {styles["card__verb__pulse__circle1"]} /> 
                <div className = {styles["card__verb__pulse__circle2"]} />
            </div>

            { props.children && props.children }

        </div>
    );
}

export default VerbCard;