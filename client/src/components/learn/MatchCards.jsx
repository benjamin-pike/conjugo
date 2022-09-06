import { useState, useRef, useEffect } from "react";

import Pool from "./MatchPool";
import Boxes from "./MatchBoxes";

import styles from "./styles/match-cards.module.css"

function Cards( props ){

    const cards = useRef( {} )
    const containers = useRef( {} )
    const boxes = useRef( {} )

    const optimiseRows = ( candidates ) => {
        const sizes = candidates.map( ( [_, poolCard ] ) => poolCard.length + 3 )
        const target = sizes.reduce( ( sum, size ) => sum + size, 0 ) / 2
        let closest = []

        for ( const [i1, v1] of sizes.entries() ) {
            for ( const [i2, v2] of sizes.entries() ){
                for ( const [i3, v3] of sizes.entries() ){
                    let unique = new Set( [i1, i2, i3] ).size === 3
                    let closer = Math.abs( v1 + v2 + v3 - target ) < Math.abs( closest.reduce( ( sum, index ) => sum + sizes[index], 0) - target )

                    if ( unique && closer ) closest = [ i1, i2, i3 ]

                    if ( closest.reduce( ( sum, i ) => sum + sizes[i], 0 ) === target ) 
                        return [
                            ...closest.map( index => candidates[ index ] ), 
                            ...[ ...Array( candidates.length ).keys() ].filter( index => !closest.includes( index ) ).map( index => candidates[ index ] )
                        ]
                }
            }
        }
    
        return [
            ...closest.map( index => candidates[ index ] ), 
            ...[ ...Array( candidates.length ).keys() ].filter( index => !closest.includes( index ) ).map( index => candidates[ index ] )
        ]
    }

    const boxCards = props.pairs.map( pair => pair[0] );
    const poolCards = optimiseRows([...props.pairs].sort( () => Math.random() - 0.5 ) ).map( pair => pair[1]);

    const [boxDimensions, setBoxDimensions] = useState( {width: 0, height: 0} )
    const [cardWidths, setCardWidths] = useState( {} )

    const [boxStates, setBoxStates] = useState(
        Object.fromEntries( boxCards.map( target => [target, { answer: "", correct: null }] ))
    )

    console.log(boxStates)

    useEffect(() => {
        const checkAnswers = () => {
            setBoxStates( states => {
                boxCards.forEach( ( subject, i ) => {
                    const boxValue = states[subject].answer
                    
                    if ( boxValue ){    
                        if ( boxValue.split("_")[1] === props.pairs[i][1] ){
                            return states[subject].correct = true
                        }
    
                        states[subject].correct = false
                    }
                })

                return { ...states }
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
            boxCards = { boxCards }
            poolCards = { poolCards }
            cards = { cards.current }
            containers = { containers.current }
            boxes = { boxes.current }
            boxStates = { boxStates }
            setBoxStates = { setBoxStates }
            cardWidths = { cardWidths }
            cardHeight = { boxDimensions.height }
            handleKeyPress = { props.handleKeyPress }
            setHandleMouseAction = { props.setHandleMouseAction }
            setButtonVisible = { props.setButtonVisible }
            checked = { props.checked }
        />
        <Boxes 
            styles = { styles }
            boxes = { boxes.current }
            boxCards = { boxCards } 
            boxStates = { boxStates }
            dimensions = { boxDimensions }
        />
    </>
}

export default Cards;