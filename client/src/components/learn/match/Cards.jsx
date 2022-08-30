import { useState, useRef, useEffect } from "react";

import Pool from "./Pool";
import Boxes from "./Boxes";

import styles from "./styles_cards.module.css"

function Cards( props ){

    const cards = useRef( {} )
    const containers = useRef( {} )
    const boxes = useRef( {} )

    const poolCards = props.pairs.map( pair => pair[0] );
    const boxCards = props.pairs.map( pair => pair[1] );

    // console.log(poolCards, boxCards)
    
    const [boxDimensions, setBoxDimensions] = useState( {width: 0, height: 0} )
    const [cardWidths, setCardWidths] = useState( {} )

    const [boxStates, setBoxStates] = useState(
        Object.fromEntries( poolCards.map( target => [target, ""] ))
    )

    useEffect(() => {
        const checkAnswers = () => {
            poolCards.forEach( ( subject, i ) => {
                const boxValue = boxStates[subject]
                
                if ( boxValue ){
                    const card = cards.current[boxValue]

                    if ( boxValue.split("_")[1] === boxCards[i] ){
                        return card.classList.add(styles["correct"])
                    }

                    return card.classList.add(styles["incorrect"])
                }
            })

            setTimeout( () => props.setChecked( true ), 0 )
        }
    
        props.setCheckFunction( () => checkAnswers )
    }, [ boxStates, props.pairs ])

    if ( Object.keys( cards.current ).length && !Object.keys( cardWidths ).length ){ // If cards ref is populated and card widths are unset
        setCardWidths( widths => {
            const ids = Object.keys( cards.current ).filter( id => cards.current[id] !== null )
            
            ids.forEach( id => { 
                widths[ id ] = 3.75 * cards.current[ id ].offsetWidth / cards.current[ ids[0] ].offsetHeight
            })

            return widths
        })
    }

    if ( Object.keys( cardWidths ).length && !boxDimensions.width ){ // If card widths array is populated and box dimensions are unset
        setBoxDimensions({
            width: Math.max( ...Object.values( cardWidths ) ),
            height: 3.75
        })
    }

    return <>
        <Pool
            styles = { styles }
            poolCards = { poolCards }
            boxCards = { boxCards }
            cards = { cards.current }
            containers = { containers.current }
            boxes = { boxes.current }
            boxStates = { boxStates }
            setBoxStates = { setBoxStates }
            cardWidths = { cardWidths }
            cardHeight = { boxDimensions.height }
            setHandleFunctions = { props.setHandleFunctions }
            setButtonVisible = { props.setButtonVisible }
        />
        <Boxes 
            styles = { styles }
            poolCards = { poolCards } 
            boxCards = { boxCards } 
            boxes = { boxes.current }
            boxStates = { boxStates }
            dimensions = { boxDimensions }
        />
    </>
}

export default Cards;