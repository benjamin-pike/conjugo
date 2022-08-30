import { useState, useEffect, useRef } from "react";

import ConjugationCard from "../ConjugationCard";

function Pool( props ){

    const styles = props.styles

    const [conjugations, setConjugations] = useState( [] ) 

    const [selectedCard, setSelectedCard] = useState( null )

    const poolRef = useRef()
    const svgRef = useRef()
    
    const handleMouseDown = e => {
        const card = props.cards[e.target.id]

        card.style.position = "absolute"
        card.style.zIndex = "100000"

        if ( card.parentNode.classList.contains( styles["cards__box"] ) ){
            props.containers[e.target.id].appendChild( card )
        }

        const posX = ( e.clientX - card.offsetLeft ) / card.offsetWidth
        const posY = ( e.clientY - card.offsetTop ) / card.offsetHeight

        setSelectedCard( { element: card, posX, posY } )
    }

    useEffect(() => {
        const [setHandleMouseMove, setHandleMouseUp] = props.setHandleFunctions

        const handleMouseMove = e => {
            if ( selectedCard ){
                const left = e.clientX - (selectedCard.posX * selectedCard.element.offsetWidth)
                const top = e.clientY - (selectedCard.posY * selectedCard.element.offsetHeight)

                selectedCard.element.style.left = left + "px"
                selectedCard.element.style.top = top + "px"
            }
        } 

        const handleMouseUp = e => {
            if ( selectedCard ){
                const conjugation = selectedCard.element.id
                const cardBounds = selectedCard.element.getBoundingClientRect()
                const center = {
                    x: ( cardBounds.left + cardBounds.right ) / 2,
                    y: ( cardBounds.top + cardBounds.bottom ) / 2
                }

                let matchedSubject = null;

                selectedCard.element.style.transition = "left 200ms ease, top 200ms ease"
            
                for ( let [i, subject] of Object.keys( props.boxes ).entries() ){
                    const box = props.boxes[subject]
                    const boundaries = box.getBoundingClientRect()

                    const horizontallyAligned = center.x > boundaries.left && center.x < boundaries.right
                    const verticallyAligned = center.y > boundaries.top && center.y < boundaries.bottom

                    if ( horizontallyAligned && verticallyAligned ){
                        matchedSubject = subject

                        selectedCard.element.style.left = box.offsetLeft + "px"
                        selectedCard.element.style.top = box.offsetTop + "px"

                        if ( props.boxStates[subject] && props.boxStates[subject] !== conjugation ){
                            const displacedConjugation = props.boxStates[subject]
                            const displacedCard = props.cards[displacedConjugation]

                            displacedCard.style.position = "absolute"
                            displacedCard.style.left = box.offsetLeft + "px"
                            displacedCard.style.top = box.offsetTop + "px"

                            displacedCard.style.transition = "left 200ms ease, top 200ms ease"

                            props.containers[displacedCard.id].appendChild( displacedCard )

                            displacedCard.style.left = props.containers[displacedConjugation].offsetLeft + "px"
                            displacedCard.style.top = props.containers[displacedConjugation].offsetTop + "px"

                            setTimeout( () => {
                                displacedCard.style.transition = ""
                                displacedCard.style.position = ""
                            }, 200 )
                        }

                        setTimeout( () => { 
                            box.appendChild(selectedCard.element)
                            }, 200)

                        break

                    } else if ( i === Object.keys( props.boxes ).length - 1 ) {
                        selectedCard.element.style.left = props.containers[conjugation].offsetLeft + "px"
                        selectedCard.element.style.top = props.containers[conjugation].offsetTop + "px"

                        setTimeout(() => {
                            selectedCard.element.style.left = ""
                            selectedCard.element.style.top = ""
                        }, 200)
                    }
                }

                props.setBoxStates( state => {
                    for ( let [s, c] of Object.entries( state ) ){
                        if ( conjugation === c ){
                            state[s] = ""
                            break
                        }
                    }
                    
                    if ( matchedSubject ) state[matchedSubject] = conjugation

                    return {...state}
                })
                
                setTimeout( () => {
                    selectedCard.element.style.transition = ""
                    selectedCard.element.style.zIndex = "10"
                    selectedCard.element.style.position = ""
                }, 200 )

                setSelectedCard( null )
            }
        }
        
        setHandleMouseMove( () => handleMouseMove )
        setHandleMouseUp( () => handleMouseUp )

    }, [ selectedCard ])

    if ( !conjugations.length ){
        console.log('setting')
        setConjugations( [...props.boxCards].sort(() => Math.random() - 0.5) )
    }

    useEffect(() => {
        props.setButtonVisible( Object.values( props.boxStates ).every( value => value ) )
    }, [ props.boxStates ])

    const elements = conjugations.map( (conjugation, index) => {

        const id = `${index + 1}_${conjugation}`

        return <div className = { styles["pool__container"] } 
            ref = { ref => props.containers[ id ] = ref }
            style = { props.cardHeight && Object.keys( props.cardWidths ).length ? { 
                width: props.cardWidths[ id ] + "em",
                height: props.cardHeight + "em"
            } : {} }>

            <div 
                ref = { ref => props.cards[ id ] = ref }
                id = { id }
                className = { styles["pool__card"] }
                onMouseDown = { handleMouseDown }>
                <ConjugationCard
                    subject = { conjugation }
                />
            </div>
        </div>
    })

    // useEffect(() => {
    //     svgRef.current.style.left = poolRef.current.offsetLeft - 1
    //     svgRef.current.style.top = poolRef.current.offsetTop

    //     svgRef.current.style.width = poolRef.current.offsetWidth + 2
    //     svgRef.current.style.height = poolRef.current.offsetHeight
    // }, [ conjugations ])

    return(
        <div
            ref = { poolRef }
            id = {styles["pool"]}>
            <div id = {styles["pool__row-1"]}>
                { elements.slice(0, 3) }
            </div>
            <div id = {styles["pool__row-2"]}>
                { elements.slice(3, 6) }
            </div>

            <svg ref = { svgRef }>
                <rect rx = "0.4em" />
            </svg>
        </div>
    )
}

export default Pool;