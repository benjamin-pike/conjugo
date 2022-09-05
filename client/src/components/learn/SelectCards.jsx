import { useState, useRef, useEffect } from "react";
import ConjugationCard from "./ConjugationCard";
import styles from "./styles/select-cards.module.css"

function Cards( props ){

    const candidates = props.candidates
    const multiSelect = 1 !== Object.values( candidates ).reduce( ( sum, candidate ) => candidate.correct ? sum + 1 : sum, 0 )
    const splitRows = candidates.some( candidate => candidate.conjugation ) 
    const [ cards, topCards, bottomCards ] = [ [], [], [] ]

    const [buttonStates, setButtonStates] = useState(
        Object.fromEntries( candidates.map( ( _,index ) =>  [index, "inactive"] ))
    )

    const updateButtonStates = index => {
        setButtonStates( states => {
            if ( multiSelect ){
                states[ index ] = states[ index ] === "active" ? "inactive" : "active"
            } else {
                Object.keys( states ).forEach( i => { if ( parseInt(i) !== index ) states[ i ] = "inactive" } )
                states[ index ] = states[ index ] === "active" ? "inactive" : "active"
            }

            return {...states}
        })
    }

    const handleClick = index => updateButtonStates( index )

    props.handleKeyPress.current = e => {
        if ( Object.keys( buttonStates ).includes( ( e.key - 1 ).toString() ) ) 
            updateButtonStates( e.key - 1 )
    }

    const optimiseRows = ( candidates ) => {
        const sizes = candidates.map( ( {subject, conjugation } ) => ( subject ? subject.length : 0 ) + conjugation.length + 3 )
        const target = sizes.reduce( ( sum, size ) => sum + size, 0 ) / 2
        let closest = []

        for ( const [i1, v1] of sizes.entries() ) {
            for ( const [i2, v2] of sizes.entries() ){
                let unique = i1 !== i2
                let closer = Math.abs( v1 + v2 - target ) < Math.abs( closest.reduce( ( sum, i ) => sum + sizes[i], 0) - target )

                if ( unique && closer ) closest = [ i1, i2 ]

                if ( closest.reduce( ( sum, i ) => sum + sizes[i], 0 ) === target ) return closest
            }
        }

        for ( const [i1, v1] of sizes.entries() ) {
            for ( const [i2, v2] of sizes.entries() ){
                for ( const [i3, v3] of sizes.entries() ){
                    let unique = new Set( [i1, i2, i3] ).size === 3
                    let closer = Math.abs( v1 + v2 + v3 - target ) < Math.abs( closest.reduce( ( sum, index ) => sum + sizes[index], 0) - target )

                    if ( unique && closer ) closest = [ i1, i2, i3 ]

                    if ( closest.reduce( ( sum, i ) => sum + sizes[i], 0 ) === target ) return closest
                }
            }
        }

        return closest
    }

    if ( splitRows ) {
        const topIndices = optimiseRows( candidates )

        candidates.forEach( ( candidate, index ) => {            
            const element =  <div
                key = { index }
                index = { index }
                className = { styles[ buttonStates[ index ] ] }
                onClick = { () => handleClick( index ) }>

                <ConjugationCard
                    subject = { candidate.subject ? candidate.subject : null } 
                    conjugation = { candidate.conjugation ? candidate.conjugation : null } 
                    color = { "textcolor" }
                />
            </div>

            if ( topIndices.includes( index ) ) return topCards.push( element )
            return bottomCards.push( element )
        })
    
    } else {
        candidates.map( ( candidate, index ) =>
            cards.push( <div 
                key = { index }
                index = { index }
                className = { styles[ buttonStates[ index ] ] }
                onClick = { () => handleClick( index ) }>

                <ConjugationCard
                    subject = { candidate.subject ? candidate.subject : null } 
                    conjugation = { candidate.conjugation ? candidate.conjugation : null } 
                    color = { "textcolor" }
                />
            </div> )
        )
    }

    useEffect(() => {
        const checkAnswers = () => {
            setButtonStates( states => {
                Object.entries( states ).forEach( ( [index, _] )  => {
                    if ( states[ index ] === "active" ){
                        states[ index ] = candidates[ index ].correct ? "active-correct" : "active-incorrect" 
                    }

                    if ( states[ index ] === "inactive" ){
                        states[ index ] = candidates[ index ].correct ? "inactive-correct" : "inactive-incorrect" 
                    }
                })

                return { ...states }
            })

            props.setChecked( true )
        }

        props.setCheckFunction( () => checkAnswers )
    }, [ candidates ])

    props.setButtonVisible( Object.values( buttonStates ).some( state => state !== "inactive" ) )

    return(
        <div id = { styles["cards__container"] }>
            { splitRows ? 
            <>
                <div className = { styles["cards__row"] }>
                    { topCards }  
                </div>
                <div className = { styles["cards__row"] }>
                    { bottomCards }   
                </div> 
            </> 
            :
            <div className = { styles["cards__row"] }>
                { cards } 
            </div> }
            
            <svg>
                <rect rx = "0.4em" />
            </svg>
        </div>
    );
}

export default Cards;