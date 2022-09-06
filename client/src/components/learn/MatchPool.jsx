import { useState, useEffect, useRef } from "react";
import ConjugationCard from "./ConjugationCard";

function Pool( props ){

    const styles = props.styles
    const [conjugations, setConjugations] = useState( [] )
    const [selectedCard, setSelectedCard] = useState( null )

    const poolRef = useRef()
    const svgRef = useRef()

    const moveToBox = ( subject, conjugation, box, card ) => {
        console.log(subject, conjugation, box, card)

        card.style.left = box.offsetLeft + "px";
        card.style.top = box.offsetTop + "px";

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
            card.style.transition = ""
            card.style.zIndex = "10"
            card.style.position = ""

            box.appendChild(card)
        }, 200)

        updateState( subject, conjugation )
        setSelectedCard( null )
    }

    const returnToPool = ( conjugation, card ) => {
        card.style.left = props.containers[conjugation].offsetLeft + "px"
        card.style.top = props.containers[conjugation].offsetTop + "px"

        setTimeout(() => {
            card.style.left = ""
            card.style.top = ""
            card.style.transition = ""
            card.style.zIndex = "10"
            card.style.position = ""
        }, 200)

        updateState( null, conjugation )
        setSelectedCard( null )
    }

    const updateState = ( subject, conjugation ) => {
        props.setBoxStates( state => {
            for ( let [s, c] of Object.entries( state ) ){
                if ( conjugation === c ){
                    state[s] = ""
                    break
                }
            }
            
            if ( subject ) state[ subject ] = conjugation

            return {...state}
        })
    }
    
    const handleMouseDown = e => {
        const card = props.cards[e.target.id]

        if ( card.classList.contains( styles["active"] ) ) card.classList.remove( styles["active"] )

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

                selectedCard.element.style.transition = "left 200ms ease, top 200ms ease"
            
                for ( let [i, subject] of Object.keys( props.boxes ).entries() ){
                    const box = props.boxes[subject]
                    const boundaries = box.getBoundingClientRect()

                    const horizontallyAligned = center.x > boundaries.left && center.x < boundaries.right
                    const verticallyAligned = center.y > boundaries.top && center.y < boundaries.bottom

                    if ( horizontallyAligned && verticallyAligned ){                        
                        moveToBox( subject, conjugation, box, selectedCard.element )
                        updateState( subject, conjugation )
                        break
                    } else if ( i === Object.keys( props.boxes ).length - 1 ) {
                        returnToPool( conjugation, selectedCard.element )   
                        updateState( null, conjugation )
                    }
                }
            }
        }
        
        setHandleMouseMove( () => handleMouseMove )
        setHandleMouseUp( () => handleMouseUp )

    }, [ selectedCard ])

    props.handleKeyPress.current = e => {
        const key = e.key
        const cardId = Object.keys(props.cards).find( id => id[0] === key )

        if ( selectedCard === null ){   
            if ( !Object.values( props.boxStates ).includes( cardId ) ){
                const card = props.cards[ cardId ]

                setSelectedCard( {
                    element: card,
                    id: cardId,
                } )

                card.classList.add( styles["active"] )

            } else {
                const card = props.cards[ cardId ]
                props.containers[ cardId ].appendChild( card )
    
                card.style.position = "absolute"
                card.style.zIndex = "100000"
    
                card.style.transition = "left 200ms ease, top 200ms ease"

                returnToPool( cardId, card )
            }


        } else {
            const card = selectedCard.element
            const conjugation = selectedCard.id

            const boxId = props.poolCards[ key - 1 ]
            const box = props.boxes[ boxId ]
        
            card.style.left = card.offsetLeft + "px"
            card.style.top = card.offsetTop + "px"

            card.style.position = "absolute"
            card.style.zIndex = "100000"

            card.style.transition = "left 200ms ease, top 200ms ease, background-color 200ms ease"
    
            moveToBox( boxId, conjugation, box, card )            

            setTimeout(() => {card.classList.remove( styles["active"] )}, 250)
        }
    }
    
    if ( !conjugations.length ){
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