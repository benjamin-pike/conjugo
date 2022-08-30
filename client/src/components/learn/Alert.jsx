import React, { useState, useEffect } from "react";
import { useNav } from "../../store/NavContext";

import AlertBanner from "./AlertBanner";
import VerbCard from "./VerbCard";
import ExplainerCard from "./ExplainerCard";
import ConjugationsGroup from "./AlertConjugations";

import RaisedButton from "../common/RaisedButton/RaisedButton";
import styles from "./styles/learn.module.css"

function Alert(){

    const { displayNav } = useNav()
    displayNav( false )
    
    const [disabled, setDisabled] = useState( false )
    const [buttonVisible, setButtonVisible] = useState( false )
    const type = "alert-new"

    useEffect(() => {
        setTimeout( () => { setButtonVisible( true ) }, 5000 )
    }, [])

    return(
        <div id = {styles["learn"]}>
            <div 
                id = {styles["content"]}
                style = {{ perspective: "1000px" }}
                className = { buttonVisible ? styles["button-visible"] : "" }>

                <AlertBanner type = {type} />
                
                <VerbCard
                    text = "hablar"
                    disabled = { disabled }
                    setDisabled = { setDisabled } 
                />
                
                <ExplainerCard type = {type} />
                
                <ConjugationsGroup
                    disabled = { disabled }
                    setDisabled = { setDisabled } 
                />
            </div>

            <div 
                id = { styles["button-continue__wrapper"] }
                className = { buttonVisible ? styles["button-visible"] : "" }>
                    
                <RaisedButton
                    text = { "Continue" }
                    onClick = { () => console.log("hello") }
                />
            </div>
        </div>
    )
}

export default Alert;

// function Alert( props ){

//     const text = { 
//         new: newVerb, 
//         irregular: irregularVerb, 
//         "stem-changing": stemChangingVerb
//     }

//     return(
//         <div id = {styles["alert"]} className = {styles[`alert__${props.type}`]}>
//             <img id = {styles["alert__text"]} src = { text[props.type] } draggable = {false} />
//             <img id = {styles["alert__shadow"]} src = { text[props.type] } draggable = {false} />
//         </div>
//     );
// }

// function Verb( props ){
    
//     useEffect(() => {
//         const card = document.getElementById( styles["card__verb"] )
//         const cardText = card.querySelector( "p" )

//         const handleMouseMove = e => {
//             const boundaries = card.getBoundingClientRect()

//             const x = ( e.clientX - boundaries.left ) / card.offsetWidth
//             const y = ( e.clientY - boundaries.top ) / card.offsetHeight

//             card.style.transform = `scale(1.05) rotateY(${(x - 0.5) * 30}deg) rotateX(${(y - 0.5) * -30}deg)`
//             card.style.filter = `brightness(${ 0.99 + 0.025 * (1 - x) + 0.05 * (1 - y) }`

//             cardText.style.filter = `brightness(${ 0.85 + 0.15 * (1 - x) + 0.3 * (1 - y) }`
//         }

//         const handleMouseLeave = e => {
//             card.style.transform = ""
//             card.style.filter = ""

//             cardText.style.filter = ""
//         }

//         const handleClick = async (e) => {
//             const wrapper = e.target.querySelector( "div" )
//             const [ circle1, circle2 ] = wrapper.querySelectorAll( "div" )
    
//             if ( !props.disabled ){
//                 const boundaries = e.target.getBoundingClientRect()
                
//                 const x = e.clientX - boundaries.left
//                 const y = e.clientY - boundaries.top
        
//                 circle1.style.left = x.toString() + "px"
//                 circle1.style.top = y.toString() + "px"
        
//                 circle2.style.left = x.toString() + "px"
//                 circle2.style.top = y.toString() + "px"

//                 circle1.style.transform = `translate(calc(-50% - ${ x / e.target.offsetWidth }em), calc(-50% - ${ y / e.target.offsetHeight }em))`
//                 circle2.style.transform = `translate(calc(-50% - ${ x / e.target.offsetWidth }em), calc(-50% - ${ y / e.target.offsetHeight }em))`
                
//                 circle1.style.animation = `${styles["pulse-big"]} 500ms ease forwards`
                
//                 props.setDisabled( true )
                                
//                 setTimeout(() => circle2.style.animation = `${styles["pulse-big"]} 500ms ease forwards`, 200)
                
//                 setTimeout(() => circle1.style.animation = "none", 500)
//                 setTimeout(() =>  circle2.style.animation = "none", 700)
        
//                 // const pause = await processAudio()
//                 const pause = 1
    
//                 setTimeout( () => props.setDisabled( false ), ( pause * 1000 ) - 200 )
//             }
//         }
        
//         card.addEventListener( "click", handleClick )
//         card.addEventListener( "mousemove", handleMouseMove )
//         card.addEventListener( "mouseleave", handleMouseLeave )

//         return () => {
//             card.removeEventListener( "click", handleClick )
//             card.removeEventListener( "mousemove", handleMouseMove )
//             card.removeEventListener( "mouseleave", handleMouseLeave )

//         }

//     }, [])

//     return(
//         <div id = {styles["card__verb"]} /*onClick = { handleClick }*/>
//             <p>hablar</p>

//             <div className = {styles["card__verb__pulse__wrapper"]}>
//                 <div className = {styles["card__verb__pulse__circle1"]} /> 
//                 <div className = {styles["card__verb__pulse__circle2"]} />
//             </div>
//         </div>
//     );
// }

// function Explainer( props ){

//     const verb = "hablar"
//     const regularity = "regular"
//     const translation = "to talk"
//     const tense = "present"
//     const color = "green"

//     switch( props.type ){
//         case "new":
//             return(
//                 <div id = {styles["card__explainer"]}>
//                     <p>
//                         <span id = {styles["card__explainer__verb"]}>
//                             <span className = {styles["card__explainer__background"]} style = {{ backgroundColor: `var(--textcolor)` }} />
//                             <span 
//                                 className = {styles["card__explainer__foreground"]}
//                                 style = {{ color: `var(--offwhite)` }}
//                                 data-attr = "">
//                                     {verb}
//                             </span>
//                         </span> 
//                         is a 
//                         <span id = {styles["card__explainer__tense"]}>
//                             <span className = {styles["card__explainer__background"]} style = {{ backgroundColor: `var(--${color})` }} />
//                             <span 
//                                 className = {styles["card__explainer__foreground"]}
//                                 style = {{ color: `var(--${color})` }}
//                                 data-attr = { color == "yellow" || color == "green" ? regularity : "" }>
//                                     {regularity}
//                             </span>
//                         </span>
//                         verb that means 
//                         <span id = {styles["card__explainer__translation"]}>
//                             <span className = {styles["card__explainer__background"]} style = {{ backgroundColor: `var(--blue)` }} />
//                             <span 
//                                 className = {styles["card__explainer__foreground"]}
//                                 style = {{ color: `var(--blue)` }}
//                                 data-attr = "">
//                                     {translation}
//                             </span>
//                         </span>
//                     </p>
//                 </div>
//             );

//         case "irregular":
//             return(
//                 <div id = {styles["card__explainer"]}>
//                     <p>
//                         <span id = {styles["card__explainer__verb"]}>
//                             <span className = {styles["card__explainer__background"]} style = {{ backgroundColor: `var(--textcolor)` }} />
//                             <span 
//                                 className = {styles["card__explainer__foreground"]}
//                                 style = {{ color: `var(--offwhite)` }}
//                                 data-attr = "">
//                                     {verb}
//                             </span>
//                         </span> 
//                         is
//                         <span id = {styles["card__explainer__irregular"]}>
//                             <span className = {styles["card__explainer__background"]} style = {{ backgroundColor: `var(--red)` }} />
//                             <span 
//                                 className = {styles["card__explainer__foreground"]}
//                                 style = {{ color: `var(--red)` }}
//                                 data-attr = "">
//                                     irregular
//                             </span>
//                         </span>
//                         in the
//                         <span id = {styles["card__explainer__tense"]}>
//                             <span className = {styles["card__explainer__background"]} style = {{ backgroundColor: `var(--${color})` }} />
//                             <span 
//                                 className = {styles["card__explainer__foreground"]}
//                                 style = {{ color: `var(--${color})` }}
//                                 data-attr = { color == "yellow" || color == "green" ? tense : "" }>
//                                     {tense}
//                             </span>
//                         </span>
//                         tense
//                     </p>
//                 </div>
//             );

//         case "stem-changing":
//             return(
//                 <div id = {styles["card__explainer"]}>
//                     <p>
//                         <span id = {styles["card__explainer__verb"]}>
//                             <span className = {styles["card__explainer__background"]} style = {{ backgroundColor: `var(--textcolor)` }} />
//                             <span 
//                                 className = {styles["card__explainer__foreground"]}
//                                 style = {{ color: `var(--offwhite)` }}
//                                 data-attr = "">
//                                     {verb}
//                             </span>
//                         </span> 
//                         changes its
//                         <span id = {styles["card__explainer__stem-changing"]}>
//                             <span className = {styles["card__explainer__background"]} style = {{ backgroundColor: `var(--orange)` }} />
//                             <span 
//                                 className = {styles["card__explainer__foreground"]}
//                                 style = {{ color: `var(--orange)` }}
//                                 data-attr = "stem">
//                                     stem
//                             </span>
//                         </span> 
//                         in the
//                         <span id = {styles["card__explainer__tense"]}>
//                             <span className = {styles["card__explainer__background"]} style = {{ backgroundColor: `var(--${color})` }} />
//                             <span 
//                                 className = {styles["card__explainer__foreground"]}
//                                 style = {{ color: `var(--${color})` }}
//                                 data-attr = { color == "yellow" || color == "green" ? tense : "" }>
//                                     {tense}
//                             </span>
//                         </span>
//                         tense
//                     </p>
//                 </div>
//             );

//         default:
//             return( null )
//     }
// }

// function Conjugations( props ){

//     const colors = ["red", "orange", "yellow", "green", "blue", "purple"]
//     const subjects = ["yo", "tú", "él • ella", "nosotros", "vosotros", "ellos • ellas"]
//     const conjugations = ["hablo", "hablas", "habla", "hablamos", "habláis", "hablan"]

//     return(
//         <div id = {styles["cards__conjugations"]}>
//             <div id = {styles["cards__conjugations__left"]}>
//                 {conjugations.slice(0, 3).map( (conjugation, index) => 
//                     <Conjugation
//                         key = { index }
//                         conjugation = { conjugation }
//                         subject = { subjects[index] }
//                         color = { colors[index] }
//                         disabled = { props.disabled }
//                         setDisabled = { props.setDisabled }
//                     />
//                 )}
//             </div>
//             <div id = {styles["cards__conjugations__right"]}>
//                 {conjugations.slice(3, 6).map( (conjugation, index) => 
//                     <Conjugation
//                         key = { index + 3 }
//                         conjugation = { conjugation }
//                         subject = { subjects[index + 3] }
//                         color = { colors[index + 3] }
//                         disabled = { props.disabled }
//                         setDisabled ={ props.setDisabled }
//                     />
//                 )}
//             </div>
//             <div id = {styles["cards__conjugations__right"]}>
                
//             </div>
//         </div>
//     );
// }

// function Conjugation( props ){

//     const { sendRequest } = useHTTP()

//     const processAudio = async () => {
//         const data = await sendRequest({ url: `http://localhost:9000/api/reference/audio?language=spanish&verb=hablar&complexity=simple&mood=indicative&tense=present&conjugation=${props.conjugation}` })
//         const audio = new Audio(`data:audio/mp3;base64, ${data.audio}`)
        
//         audio.play()
        
//         return new Promise( resolve => 
//             audio.onloadedmetadata = () => 
//                 resolve( audio.duration )
//         )
//     }

//     const handleClick = async (e) => {

//         if ( !props.disabled ){
//             const wrapper = e.target.querySelector("." + styles["card__conjugations__face__pulse__wrapper"])
//             const circle1 = wrapper.querySelector("." + styles["card__conjugations__face__pulse__circle1"])
//             const circle2 = wrapper.querySelector("." + styles["card__conjugations__face__pulse__circle2"])
            
//             const boundaries = e.target.getBoundingClientRect()

//             const x = e.clientX - boundaries.left
//             const y = e.clientY - boundaries.top
    
//             circle1.style.left = x.toString() + "px"
//             circle1.style.top = y.toString() + "px"
    
//             circle2.style.left = x.toString() + "px"
//             circle2.style.top = y.toString() + "px"
            
//             circle1.style.animation = `${styles["pulse-small"]} 500ms ease forwards`
            
//             props.setDisabled( true )
                        
//             setTimeout(() => console.log(circle1.style.animationPlayState), 2000)
    
//             setTimeout(() => circle2.style.animation = `${styles["pulse-small"]} 500ms ease forwards`, 200)
            
//             setTimeout(() => circle1.style.animation = "none", 500)
//             setTimeout(() =>  circle2.style.animation = "none", 700)
    
//             const pause = await processAudio()

//             setTimeout( () => props.setDisabled( false ), ( pause * 1000 ) - 200 )
//         }
//     }

//     return(
//         <div className = {styles["card__conjugations__wrapper"]} style = {{ backgroundColor: `var(--${props.color})` }}>
//             <button
//                 className = {styles["card__conjugations__face"]}
//                 onClick = { handleClick }>
//                 <p>
//                     <span className = {styles["card_conjugations__subject"]}>{ props.subject }</span>
//                     <span 
//                         className = {styles["card_conjugations__conjugation"]}
//                         style = {{ color: `var(--${props.color})` }}>
                        
//                         { props.conjugation }
//                     </span>
//                 </p>

//                 <div className = {styles["card__conjugations__face__pulse__wrapper"]}>
//                     <div className = {styles["card__conjugations__face__pulse__circle1"]} /> 
//                     <div className = {styles["card__conjugations__face__pulse__circle2"]} />
//                 </div>
//             </button>
//         </div>  
//     );
// }