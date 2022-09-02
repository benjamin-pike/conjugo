import { useState, useRef, useEffect } from "react"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAngleLeft, faAngleRight } from '@fortawesome/free-solid-svg-icons'
import { useLang } from "../../store/LangContext"

import styles from "./styles/type-input.module.css"

function TypeInput( props ){

    const { language } = useLang()

    const [text, setText] = useState( "" )
    const [correct, setCorrect] = useState( null )
    const [scrolled, setScrolled] = useState( false )
    const [activeSpecial, setActiveSpecial] = useState([])
    const width = useState( 3 + Math.floor( Math.random() * 3 ) + props.answer.length )[0]

    const inputRef = useRef()
    const wrapperRef = useRef()

    const handleChange = e => setText( e.target.value )

    useEffect(() => {
        if ( scrolled ){
            setActiveSpecial( specialChars[ language.name ].slice( -6 ) )
        } else {
            setActiveSpecial( specialChars[ language.name ].slice( 0, 6 ) )
        }

    }, [scrolled])

    const specialType = (e, letter) => {
        if ( correct === null ){
            const index = specialChars[ language.name ].indexOf( letter )

            setText( current => current + letter )
            inputRef.current.focus()
        }
    }

    const specialChars = {
        spanish: ['á', 'é', 'í', 'ñ', 'ó', 'ú'],
        french: ['â', 'ç', 'è', 'é', 'ê', 'ë', 'î', 'ï', 'ô', 'û', 'œ'],
        german: ['ß', 'ä', 'ö', 'ü'],
        italian: ['à', 'è', 'é', 'ì', 'ò'],
        portuguese: ['á', 'ã', 'ç', 'é', 'ê', 'í', 'ó', 'ô', 'õ', 'ú'],
    }

    useEffect(() => {
        const checkAnswer = () => {
            console.log(text, props.answer)
            setCorrect( text.trim() === props.answer )
            props.setChecked( true )
        }

        props.setCheckFunction( () => checkAnswer )
    }, [ text ])

    const handleClickLeft = () => {
        if ( scrolled ) wrapperRef.current.scrollTo( { left: 0, behavior: "smooth" })
        setScrolled( false )
    }

    const handleClickRight = () => {
        if ( !scrolled ) wrapperRef.current.scrollTo( { left: wrapperRef.current.offsetWidth, behavior: "smooth" })
        setScrolled( true )
    }

    props.setButtonVisible( text.length )

    return(
        <div
            id = { styles[ "input__wrapper" ] }
            style = {{ width: 4 * width + "ch" }}>
            <div id = { styles["input__container"]}>
                <input
                    ref = { inputRef }
                    id = { styles[ "input__input" ] } 
                    onChange = { handleChange }
                    spellCheck = "false"
                    autoComplete = "off"
                    value = { text }
                    readOnly = { correct !== null }
                    isChecked = { props.checked ? "true" : "false" }
                    style = {{ 
                        width: width + "ch",
                        color: `var(--${ correct === null ? "textcolor" : correct ? "green" : "red" })`,
                    }}
                />
                <div 
                    id = { styles[ "input__underline" ] }
                    style = {{
                        backgroundColor: `var(--${ correct === null ? "textcolor50" : correct ? "green" : "red" })`
                    }}/>
            </div>
            <svg 
                id = { styles[ "input__dots"] }
                style = {{ width:  4 * width - 12 + "ch" }}>

                <line 
                    x1 = "0" x2 = "100%" 
                    style = {{ strokeDasharray: `0 calc( ( ${4 * width - 12 + "ch"} - 0.25em ) / ${ 3 * width - 9 } )` }}
                />
            </svg>
            <div id = { styles[ "special_character_buttons__container"]}>
                { specialChars[ language.name ].length > 6 && <button
                    id = { styles[ "special_character_buttons__arrow-left"]}
                    onClick = { handleClickLeft }
                    style = { scrolled ? {} : { cursor: "auto", opacity: "0" }}>

                    <FontAwesomeIcon icon = { faAngleLeft } />
                </button> }
                <div
                    ref = { wrapperRef }
                    id = { styles[ "special_character_buttons__wrapper"]}>

                    <div id = { styles[ "special_character_buttons" ] }>
                        { specialChars[ language.name ].map( letter =>
                            <button
                                className = { styles[ "special_character_button" ] }
                                onClick = { e => { if ( activeSpecial.includes( letter ) ) specialType( e, letter ) } }
                                style = {{ 
                                    cursor: activeSpecial.includes( letter ) ? "pointer" : "auto",
                                    opacity: activeSpecial.includes( letter ) ? "1" : "0.65" 
                                }}>
                                
                                <p> { letter } </p>
                            </button>
                        ) }
                    </div>
                </div>
                { specialChars[ language.name ].length > 6 && <button
                    id = { styles[ "special_character_buttons__arrow-right"]}
                    onClick = { handleClickRight }
                    style = { scrolled ? { cursor: "auto", opacity: "0" } : {} }>

                    <FontAwesomeIcon icon = { faAngleRight } />
                </button> }
            </div>
        </div>
    );
}

export default TypeInput;