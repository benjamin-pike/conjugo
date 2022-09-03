import { useState, useRef, useEffect } from "react";
import ConjugationCard from "./ConjugationCard";
import styles from "./styles/select-cards.module.css"

function Cards( props ){

    // const candidates = useRef( [
    //     { subject: "yo", conjugation: "hablo", correct: true },
    //     { subject: "nosotros", conjugation: "hablamos", correct: true },
    //     { subject: "ella", conjugation: "hablare", correct: false },
    //     { subject: "tu", conjugation: "hable", correct: false },
    //     { subject: "vosotros", conjugation: "hablan", correct: false },
    //     { subject: "ellos", conjugation: "habla", correct: false },
    // ].sort(() => Math.random() - 0.5) )
    // const candidates = useRef( props.candidates )
    const candidates = { current: props.candidates}

    // const candidates = useRef( [
    //     { subject: null, conjugation: "hablo", correct: true },
    //     { subject: null, conjugation: "hablamos", correct: false },
    //     { subject: null, conjugation: "hableis", correct: false },
    //     { subject: null, conjugation: "habla", correct: false },
    //     { subject: null, conjugation: "hablan", correct: false },
    //     { subject: null, conjugation: "habla", correct: false },
    // ].sort(() => Math.random() - 0.5) )

    // const candidates = useRef( [
    //     { subject: "to", conjugation: "hear", correct: true },
    //     { subject: "to", conjugation: "see", correct: false },
    //     { subject: "to", conjugation: "be", correct: false },
    //     { subject: "to", conjugation: "smell", correct: false },
    //     { subject: "to", conjugation: "talk", correct: false },
    //     { subject: "to", conjugation: "exercise", correct: false },
    // ].sort(() => Math.random() - 0.5) )

    // const candidates = useRef( [
    //     { subject: "yo", conjugation: null, correct: false },
    //     { subject: "tu", conjugation: null, correct: true },
    //     { subject: "el", conjugation: null, correct: false },
    //     { subject: "nosotros", conjugation: null, correct: false },
    //     { subject: "vosotros", conjugation: null, correct: false },
    //     { subject: "ellos", conjugation: null, correct: false },
    // ].sort(() => Math.random() - 0.5) )

    const multiSelect = 1 !== Object.values( candidates.current ).reduce( ( sum, candidate ) => candidate.correct ? sum + 1 : sum, 0 )

    const cardsRef = useRef( {} )

    const splitRows = candidates.current.some( candidate => candidate.conjugation )

    const [buttonStates, setButtonStates] = useState(
        Object.fromEntries( candidates.current.map( (_,index) =>  [index, "inactive"] ))
    )

    let [topRow, bottomRow] = [null, null]

    const handleClick = index => {
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

    const cards = candidates.current.map( ( candidate, index ) =>
        <div 
            ref = { ref => cardsRef.current[ index ] = ref }
            index = { index }
            className = { styles[ buttonStates[ index ] ] }
            onClick = { () => handleClick( index ) }>

            <ConjugationCard
                subject = { candidate.subject ? candidate.subject : null } 
                conjugation = { candidate.conjugation ? candidate.conjugation : null } 
                color = { "textcolor" }
            />
        </div>
    )

    const optimiseRows = ( cards ) => {
        const target = cards.reduce( ( sum, card ) => sum + card.offsetWidth, 0 ) / 2
        const arr = cards.sort( card => card.getAttribute( "index" ) ).map( card => card.offsetWidth )

        let closest = []

        for ( let n1 = 0; n1 < arr.length; n1++ ) { // Iterate through array of widths using indicies
            for ( let n2 = 0; n2 < arr.length; n2++ ) { // Iterate through array again
                let unique = n1 !== n2 // Compare indicies to ensure different values
                let closer = Math.abs( arr[n1] + arr[n2] - target ) < Math.abs( closest.reduce( ( sum, index ) => sum + arr[index], 0) - target ) //Check if sum of values is closer to target

                if ( unique && closer ) closest = [ n1, n2 ] // If sum is closer, update closest array to new values
            } 
        }

        for ( let n1 = 0; n1 < arr.length; n1++ ) {
            for ( let n2 = 0; n2 < arr.length; n2++ ) {
                for ( let n3 = 0; n3 < arr.length; n3++ ) {

                    let unique = n1 !== n2 && n1 !== n3 && n2 !== n3
                    let closer = Math.abs( arr[n1] + arr[n2] + arr[n3] - target ) < Math.abs( closest.reduce( ( sum, index ) => sum + arr[index], 0) - target )

                    if ( unique && closer ) closest = [ n1, n2, n3 ]
                }
            } 
        }

        return [
            closest,
            [ ...Array( cards.length ).keys() ].filter( index => !closest.includes( index ) )
        ]
    }

    useEffect(() => {
        const checkAnswers = () => {
            setButtonStates( states => {
                Object.entries( states ).forEach( ( [index, state] )  => {
                    if ( states[ index ] === "active" ){
                        states[ index ] = candidates.current[ index ].correct ? "active-correct" : "active-incorrect" 
                    }

                    if ( states[ index ] === "inactive" ){
                        states[ index ] = candidates.current[ index ].correct ? "inactive-correct" : "inactive-incorrect" 
                    }
                })

                return { ...states }
            })

            props.setChecked( true )
        }

        props.setCheckFunction( () => checkAnswers )
    }, [ props.candidates ])

    if ( splitRows && cardsRef.current && !topRow ){
        [ topRow, bottomRow ] = optimiseRows( Object.values( cardsRef.current ) ).map( row => row.map( index => cards[ index ] ))
    }
    
    props.setButtonVisible( Object.values( buttonStates ).some( state => state !== "inactive" ) )

    return(
        <div id = { styles["cards__container"] }>
            { splitRows ? 
            <>
                <div className = { styles["cards__row"] }>
                    { topRow.length ? topRow : cards.slice( 0, Math.ceil( cards.length / 2 ) )}  
                </div>
                <div className = { styles["cards__row"] }>
                    { bottomRow.length ? bottomRow : cards.slice( Math.ceil( cards.length / 2 ), cards.length ) }   
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