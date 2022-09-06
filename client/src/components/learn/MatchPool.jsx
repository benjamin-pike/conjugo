import { useState, useEffect, useRef } from "react";
import ConjugationCard from "./ConjugationCard";

function Pool( props ){

    const styles = props.styles

    const [conjugations, setConjugations] = useState( [] )
    const [selectedCard, setSelectedCard] = useState( null )
    const [focusedCard, setFocusedCard] = useState( null )

    const poolRef = useRef()
    const svgRef = useRef()

    const moveToBox = ( subject, conjugation, box, card ) => {
        
        Object.assign( card.style, { 
            left: box.offsetLeft + "px", 
            top: box.offsetTop + "px",
            transition: "left 200ms ease, top 200ms ease"
        })

        if ( props.boxStates[subject].answer && props.boxStates[subject].answer !== conjugation ){
            const displacedConjugation = props.boxStates[subject].answer
            const displacedCard = props.cards[displacedConjugation]

            Object.assign( displacedCard.style, {
                position: "absolute",
                left: box.offsetLeft + "px",
                top: box.offsetTop + "px",
                transition: "left 200ms ease, top 200ms ease"
            })

            props.containers[displacedCard.id].appendChild( displacedCard )

            Object.assign( displacedCard.style, {
                left: props.containers[displacedConjugation].offsetLeft + "px",
                top: props.containers[displacedConjugation].offsetTop + "px"
            })

            setTimeout( () => Object.assign( displacedCard.style, { transition: "", position: "" } ), 200 )
        }

        setTimeout( () => { 
            Object.assign( card.style, { transition: "", zIndex: "10", position: "" } )
            box.appendChild(card)
        }, 200)

        updateState( subject, conjugation )
        setSelectedCard( null )
    }

    const returnToPool = ( conjugation, card ) => {

        Object.assign( card.style, { 
            left: props.containers[conjugation].offsetLeft + "px", 
            top: props.containers[conjugation].offsetTop + "px",
            transition: "left 200ms ease, top 200ms ease"
        })

        setTimeout(() => {
            Object.assign( card.style, { 
                left: "", top: "", transition: "", zIndex: "10", position: "" 
            })
        }, 200)

        updateState( null, conjugation )
        setSelectedCard( null )
    }

    const updateState = ( subject, conjugation ) => {
        props.setBoxStates( state => {
            for ( let [s, c] of Object.entries( state ) ){
                if ( conjugation === c.answer ){
                    state[s] = { answer: "", correct: null }
                    break
                }
            }
            
            if ( subject ) state[ subject ] = { answer: conjugation, correct: null }

            return {...state}
        })
    }
    
    const handleMouseDown = e => {
        const card = props.cards[e.target.id]

        if ( focusedCard ) setFocusedCard( null )

        Object.assign( card.style, { position: "absolute", zIndex: "100000" } )

        if ( card.parentNode.classList.contains( styles["cards__box"] ) ){
            props.containers[e.target.id].appendChild( card )
        }

        const posX = ( e.clientX - card.offsetLeft ) / card.offsetWidth
        const posY = ( e.clientY - card.offsetTop ) / card.offsetHeight

        setSelectedCard( { element: card, posX, posY } )
    }

    useEffect(() => {
        const handleMouseAction = e => {
            if ( selectedCard ){
                if ( e.type === "mousemove"){
                    const left = e.clientX - (selectedCard.posX * selectedCard.element.offsetWidth)
                    const top = e.clientY - (selectedCard.posY * selectedCard.element.offsetHeight)
    
                    return Object.assign( selectedCard.element.style, { left: left + "px", top: top + "px" } )
                }
                
                const conjugation = selectedCard.element.id
                const cardBounds = selectedCard.element.getBoundingClientRect()
                const center = {
                    x: ( cardBounds.left + cardBounds.right ) / 2,
                    y: ( cardBounds.top + cardBounds.bottom ) / 2
                }
            
                for ( let [i, subject] of Object.keys( props.boxes ).entries() ){
                    const box = props.boxes[subject]
                    const boundaries = box.getBoundingClientRect()
    
                    const horizontallyAligned = center.x > boundaries.left && center.x < boundaries.right
                    const verticallyAligned = center.y > boundaries.top && center.y < boundaries.bottom
    
                    if ( horizontallyAligned && verticallyAligned ){                        
                        moveToBox( subject, conjugation, box, selectedCard.element )
                        updateState( subject, conjugation )
                        break
                    
                    }
    
                    if ( i === Object.keys( props.boxes ).length - 1 ) {
                        returnToPool( conjugation, selectedCard.element )   
                        updateState( null, conjugation )
                    }
                }
            }
        }

        props.setHandleMouseAction( () => handleMouseAction )
    }, [selectedCard])
    

    props.handleKeyPress.current = e => {
        const key = e.key
        const cardId = Object.keys(props.cards).find( id => id[0] === key )

        if ( selectedCard === null ){   
            if ( !Object.values( props.boxStates ).map( obj => obj.answer ).includes( cardId ) ){
                const card = props.cards[ cardId ]

                setSelectedCard( {
                    element: card,
                    id: cardId,
                } )

                return setFocusedCard( cardId )
            } 
                
            const card = props.cards[ cardId ]
            props.containers[ cardId ].appendChild( card )
            
            Object.assign( card.style, { position: "absolute", zIndex: "100000" } )

            return returnToPool( cardId, card )

        }

        const card = selectedCard.element
        const conjugation = selectedCard.id

        const boxId = props.boxCards[ key - 1 ]
        const box = props.boxes[ boxId ]

        Object.assign( card.style, {
            left: card.offsetLeft + "px",
            top: card.offsetTop + "px",
            position: "absolute",
            zIndex: "100000"
        })

        moveToBox( boxId, conjugation, box, card )            

        setTimeout(() => setFocusedCard( null ), 250)

        return
    }
    
    if ( !conjugations.length ){
        setConjugations( [...props.poolCards] )
    }

    useEffect(() => {
        props.setButtonVisible( Object.values( props.boxStates ).every( value => value.answer ) )
    }, [ props.boxStates ])

    const cardStates = props.checked && Object.fromEntries( Object.values( props.boxStates ).map( ({ answer , correct }) => [ answer, correct ] ) )

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
                moveable = { (!props.checked).toString() }
                onMouseDown = { handleMouseDown }>
                <ConjugationCard
                    status = { cardStates ? (cardStates[ id ] === true ? "correct" : "incorrect" ) : (focusedCard === id ? "active" : "" ) }
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