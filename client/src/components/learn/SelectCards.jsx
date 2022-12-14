import { useState, useEffect } from "react";
import ConjugationCard from "./ConjugationCard";
import styles from "./styles/select-cards.module.css"

function Cards( props ){
    
    // Function takes candidates array and optimises array order to balance answer lengths across top and bottom rows
    const optimiseRows = ( candidates ) => {
        const sizes = candidates.map( ( {prefix, main } ) => ( prefix ? prefix.length : 0 ) + main.length + 3 )
        const target = sizes.reduce( ( sum, size ) => sum + size, 0 ) / 2
        let closest = []

        for ( const [i1, v1] of sizes.entries() ) {
            for ( const [i2, v2] of sizes.entries() ){
                let unique = i1 !== i2
                let closer = Math.abs( v1 + v2 - target ) < Math.abs( closest.reduce( ( sum, i ) => sum + sizes[i], 0) - target )

                if ( unique && closer ) closest = [ i1, i2 ]

                if ( closest.reduce( ( sum, i ) => sum + sizes[i], 0 ) === target )
                    return [
                        closest.map( index => candidates[ index ] ), 
                        [ ...Array( candidates.length ).keys() ].filter( index => !closest.includes( index ) ).map( index => candidates[ index ] )
                    ]
            }
        }

        for ( const [i1, v1] of sizes.entries() ) {
            for ( const [i2, v2] of sizes.entries() ){
                for ( const [i3, v3] of sizes.entries() ){
                    let unique = new Set( [i1, i2, i3] ).size === 3
                    let closer = Math.abs( v1 + v2 + v3 - target ) < Math.abs( closest.reduce( ( sum, index ) => sum + sizes[index], 0) - target )

                    if ( unique && closer ) closest = [ i1, i2, i3 ]

                    if ( closest.reduce( ( sum, i ) => sum + sizes[i], 0 ) === target ) 
                        return [
                            closest.map( index => candidates[ index ] ), 
                            [ ...Array( candidates.length ).keys() ].filter( index => !closest.includes( index ) ).map( index => candidates[ index ] )
                        ]
                }
            }
        }
    
        return [
            closest.map( index => candidates[ index ] ), 
            [ ...Array( candidates.length ).keys() ].filter( index => !closest.includes( index ) ).map( index => candidates[ index ] )
        ]
    }

    const multiSelect = // Boolean ??? determines whether multiple answers may be selected (according to no. of correct answers)
        1 !== Object.values( props.candidates ).reduce( ( sum, candidate ) => candidate.correct ? sum + 1 : sum, 0 )
    const splitRows = props.candidates.some( candidate => candidate.main ) // Boolean ??? determines whether answers should span two rows
    
    let candidates = splitRows ? optimiseRows( props.candidates ) : props.candidates // Split candidates into two arrays + optimise if necessary

    const [buttonStates, setButtonStates] = useState( // Initialise button state object with all values set to inactive by default
        // Object.fromEntries( candidates.flat().map( ( _,index ) =>  [index, "inactive"] ))
        candidates.flat().map(() => "inactive")
    )

    // Function accepts an answer index and updates buttonStates accordingly
    const updateButtonStates = index => {
        setButtonStates( states => {
            if ( multiSelect ){
                states[ index ] = states[ index ] === "active" ? "inactive" : "active"
            } else {
                Object.keys( states ).forEach( i => { if ( parseInt(i) !== index ) states[ i ] = "inactive" } )
                states[ index ] = states[ index ] === "active" ? "inactive" : "active"
            }

            return [...states]
        })
    }

    const handleClick = index => updateButtonStates( index ) // Trigger updateButtonStates on click of button

    props.handleKeyPress.current = e => { // Trigger updateButtonStates on keypress
        if ( Object.keys( buttonStates ).includes( ( e.key - 1 ).toString() ) ) 
            updateButtonStates( e.key - 1 )
    }
    
    const cards = splitRows ? // Map answer objects to HTML elements
        candidates.map( 
            (row, rowIndex) => row.map( (candidate, candidateIndex) =>
                <div
                    key = { rowIndex * candidates[0].length + candidateIndex }
                    index = { rowIndex * candidates[0].length + candidateIndex }
                    selectable = { (!props.checked).toString() }
                    onClick = { () => handleClick( rowIndex * candidates[0].length + candidateIndex ) }>

                    <ConjugationCard
                        subject = { candidate.prefix ? candidate.prefix : null } 
                        conjugation = { candidate.main ? candidate.main : null } 
                        status = { buttonStates[ rowIndex * candidates[0].length + candidateIndex ] }
                        color = { "textcolor" }
                    />
                </div>
            ) 
        ) 
    : 
        candidates.map( ( candidate, index ) =>
            <div 
                key = { index }
                index = { index }
                selectable = { (!props.checked).toString() }
                onClick = { () => handleClick( index ) }>

                <ConjugationCard
                    subject = { candidate.prefix ? candidate.prefix : null } 
                    conjugation = { candidate.main ? candidate.main : null } 
                    status = { buttonStates[ index] }
                    color = { "textcolor" }
                />
            </div>
        )

    useEffect(() => {
        const checkAnswers = () => {
            setButtonStates( states => {
                Object.entries( states ).forEach( ( [index, _] )  => {
                    if ( states[ index ] === "active" ){
                        states[ index ] = candidates.flat()[ index ].correct ? "correct" : "incorrect" 
                    }

                    if ( states[ index ] === "inactive" ){
                        states[ index ] = candidates.flat()[ index ].correct ? "warning" : "not-selected"
                    }
                })

                props.setCorrect(prevState => [
                    ...prevState, 
                    states.some(button => button !== "incorrect" && button !== "warning")
                ])

                return [...states]
            })

            props.setChecked( true )
        }

        props.setCheckFunction( () => checkAnswers )
    }, [])

    // If any button is active, show 'continue' button
    if (!props.checked){
        props.setButtonVisible(Object.values( buttonStates ).some( state => state !== "inactive" ))
    }

    return(
        <div id = { styles["cards__container"] }>
            { splitRows ? 
                <>
                    <div className = { styles["cards__row"] }>
                        { cards[0] }  
                    </div>
                    <div className = { styles["cards__row"] }>
                        { cards[1] }   
                    </div> 
                </> 
            :
                <div className = { styles["cards__row"] }>
                    { cards } 
                </div> 
            }
        </div>
    );
}

export default Cards;