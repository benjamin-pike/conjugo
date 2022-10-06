import React, { useState, useEffect } from "react";

var incorrect = false // Set incorrect to false by default
var complete = false // Set complete to false by default
var hinted = false // Set hinted to false by default

// Log statistics
var keys = 0 // Sum of keypresses
var hints = 0 // Sum of hints
var currentInputLength = 0 // Record input length to ensure only keypresses that increase length are counted
var accuracy; // Record accuracy
var time = Date.now() // Record time required to get correct answer

function setDefaults(){
    incorrect = false // Set incorrect to false by default
    complete = false // Set complete to false by default
    hinted = false // Set hinted to false by default

    keys = 0 // Sum of keypresses
    hints = 0 // Sum of hints
    currentInputLength = 0 // Record input length to ensure only keypresses that increase length are counted
    accuracy = 1; // Record accuracy

    time = Date.now() // Record time required to get correct answer
}

function Answer(props){

    const styles = props.styles

    const [value, setValue] = useState("") // Set default input value to empty string
    const [textColor, setTextColor] = useState("var(--textcolor)") // Set default text color to gray

    function checkInput(event){
        let input = event.target.value.toLowerCase() // Set input to current input value
        let correctSlice = props.conjugation.conjugation.slice(0, input.length) // Get slice of correct answer according to input length
        let correctFull = props.conjugation.conjugation // Get full length correct answer
        
        let inputNormalized = input.normalize("NFD").replace(/[\u0300-\u036f]/g, "") // Remove diacritics from input
        let correctSliceNormalized = correctSlice.normalize("NFD").replace(/[\u0300-\u036f]/g, "") // Remove diacritics from correct slice
        let correctFullNormalized = correctFull.normalize("NFD").replace(/[\u0300-\u036f]/g, "") // Remove diacritics from correct full
        
        if (input.length > currentInputLength){
            keys++ // If new input length is greater than previous, increase keypresses by 1
        }

        currentInputLength = input.length // Update currentInputLength (required for calculation of keypresses)

        // Apply hint
        if (input[input.length - 1] === '/'){ // Listen for '/' input
            
            if (incorrect === false){ // Triggered if current answer is correct
                hints++ // Add 1 to hints
                
                input = correctSlice.slice(0, input.length) // Add additional correct letter to answer
                inputNormalized = correctSliceNormalized.slice(0, input.length) // Update normalized strings
            
            } else { // Triggered if current answer is incorrect (iterates until correct slice is found)
                while (inputNormalized !== correctSliceNormalized.slice(0, inputNormalized.length)){
                    inputNormalized = inputNormalized.slice(0, inputNormalized.length - 1)
                } // Remove last letter from input until a string matching a correct slice is produced
                
                hints++ // Add 1 to hints
                input = inputNormalized // Set input to correct slice
            }
        }

        if (correctSlice.at(-1) === 'ß' && input.at(-1) == 's'){
            input = input.slice(0, input.length - 1) + 'ß'
            inputNormalized = inputNormalized.slice(0, inputNormalized.length - 1) + 'ß'
        }
                
        correctSliceNormalized =  correctSliceNormalized.slice(0, inputNormalized.length) // Adjust normalized correct slice according to hint
        correctSlice = correctSlice.slice(0, inputNormalized.length) // Adjust correct slice according to hint

        inputNormalized === correctSliceNormalized ? incorrect = false : incorrect = true; // Check for incorrect
        inputNormalized === correctFullNormalized ? complete = true : complete = false; // Check if complete
        
        incorrect ? setTextColor('var(--incorrect)') : (hints > 0 ? setTextColor('var(--hinted)') : setTextColor('var(--textcolor)')) // Change text to red if incorrect
        complete && setTextColor('var(--complete)') // Change text to green if complete

        incorrect ? setValue(input) : setValue(correctSlice) // Add diacritics if input is correct

        accuracy = ((correctFull.length - hints)/keys) // Calculate current accuracy
    }

    // Reset on completion
    document.onkeydown = e => {
        if (e.key === "Enter" && complete){ // Triggers upon enter, if word is complete
            
            props.setResultsData(props.resultsData.concat( //Send data to parent
                {
                    rep: props.rep + 1,
                    answer: {
                        conjugation: props.conjugation.conjugation,
                        subject: props.conjugation.subject,
                        tense: props.conjugation.tense,
                        mood: props.conjugation.mood,
                        infinitive: props.conjugation.infinitive,
                    },
                    accuracy: accuracy,
                    time: Date.now() - time, 
                    hinted: hinted
                })) 
                                
            props.setComplete(true) // Inform parent that rep is complete
                
            setDefaults() // Reset text color and data variable to defaults
                
            if (props.rep !== props.roundLength - 1){  
                setValue("") // If not last rep, reset text box value to empty
            } else {
                setTextColor('var(--roundcomplete)') // If last rep, change text color to yellow
                props.setRoundStatus('complete') // Inform parent that round is complete
                setTimeout(() => props.setStage("results"), 2000)
            }
        }
    }
 
    return (
            <div id = {styles["answer-input"]}>
                <input 
                    id = {styles["answer-input-box"]} 
                    onChange = {checkInput} // Trigger function upon update of textbox
                    style = {{"color": textColor}} // Set text color
                    value = {value} // Set up text box as controlled component
                    readOnly = {complete || props.roundStatus === 'complete' || props.roundStatus === 'timeup'} // Lock input upon completion of word
                    autoComplete = "off" // Disable autocomplete
                    spellCheck = "false" // Disabled spellcheck
                    autofocus = "true" // Focus on input box
                />
            </div>
    );
}

export default Answer;