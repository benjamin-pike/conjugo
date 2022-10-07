import React, { useState, useEffect } from "react";
import buttonsData from "./map-buttons";

function Buttons(props){

    const styles = props.styles

    const buttons = buttonsData[props.language.name]

    const rows = [...Array(buttons.tenses[buttons.tenses.length - 1].row).keys()] // Create array containing value for each row 
    const buttonDetails = {} // Create empty object to store button details
    const familySize = {} // Store family sizes (to identify standalone buttons)

    const [subjects, setSubjects] = useState(props.subjects.buttons)
    const [tenses, setTenses] = useState(props.tenses.buttons)

    const [activeSubjects, setActiveSubjects] = useState(props.subjects.active)
    const [activeTenses, setActiveTenses] = useState(props.tenses.active)

    console.log(props.tenses)

    const active = props.tenses.reduce((output, tenseRoot) => {
        const [complexity, mood, tense] = tenseRoot.split("-")

        if (!output.complexities.includes(complexity))
            output.complexities.push(complexity)
        if (!output.moods.includes(mood))
            output.moods.push(mood)

        if (!output.tenses[mood])
            output.tenses[mood] = []
        
        if (!output.tenses[mood].includes(tense))
            output.tenses[mood].push(tense)

        return output

    }, { complexities: [], moods: [], tenses: {} })

    console.log(active)

    function checkSubjectExclusions(state){

        let activeSubjects = [] // Record active subjects (empty by default)
        let activeComplexities = [] // Record active complexities (empty array by default)

        for (let subject in state){ // Iterate through subjects
            if (state[subject] === 'active'){ // If subject is active...
                activeSubjects.push(subject) // ...push subject to activeSubjects array
            }
        }

        for (let button in tenses.tier3){ // Iterate through complexities
            if (tenses.tier3[button] === 'active'){ // If complexity is active...
                activeComplexities.push(button) // ...push complexity to activeComplexities array
            }
        }

        setTenses(state => {
            for (let tier of ["tier2", "tier1"]){ 
                for (let button in state[tier]){ // Iterate through master and tense buttons
                    if (activeSubjects.filter(s => !buttonDetails[button].exclusions.subjects.includes(s)).length === 0
                        || activeComplexities.filter(c => !buttonDetails[button].exclusions.tenses.includes(c)).length === 0){
                        state[tier][button] = 'disabled' // Disable button if active complexities or subjects conflict with exclusions
                    } else if (tier === 'tier2' && state[tier][button] === 'disabled'){ // Else, if master is disabled...
                        state[tier][button] = 'inactive' // ...set button to inactive
                    }
                }
            }

            for (let button in state["tier3"]){ // Iterate through complexity buttons
                if (activeSubjects.length === 0){ // If no subjects are active...
                    state.tier3[button] = 'disabled' // Disable all buttons
                } else if (state.tier3[button] === 'disabled'){ // Else, if button is currently disabled...
                    state.tier3[button] = 'inactive' // ...set to inactive
                }
            }

            return {...state} // Finally, update state
        })
    }

    function handleClickSubject(button){ 

        setSubjects(state => {   

            state[button] = state[button] === 'active' ? 'inactive' : 'active'

            if (button !== 'all'){ // Executes if any button except the all subjects button is clicked

                let inactiveSubjects = 0 // Count inactive subjects (0 by default)

                for (let subject in state){ // Iterate through subjects
                    if (subject !== "all"){ // Excludes "all" button
                        if (state[subject] === 'inactive'){ // If any subject is inactive...
                            inactiveSubjects++ // ... increment inactiveSubjects by 1
                        }
                    }
                }

                state["all"] = inactiveSubjects > 0 ? "inactive" : "active" // If inactive subjects > 0, set all button to inactive
                
            } else { // Executes all subjects button is clicked
                if (state["all"] === 'active'){ // If "all" button is set to active...
                    for (let subject in state){ // ...activate all subjects
                        state[subject] = 'active'
                    } 
                } else { // If "all" button is set to inactive...
                    for (let subject in state){ // ...inactivate all subjects
                        state[subject] = 'inactive'
                    } 
                }
            }

            checkSubjectExclusions(state) // Check if any tenses must be disabled according to active subjects
                // Required to use state variable within callback, as opposed to after, as setTense is asynchronous

            return {...state} // Finally, update state
        })
    }

    function handleClickTense(id){
        let tier = buttonDetails[id].tier

        let activeSubjects = [] // Record active subjects (empty by default)
        let activeComplexities = [] // Record active complexities (empty array by default)

        // Switch from active to inactive (and vice-versa)
        setTenses(prevState => ({ // Use callback to access previous state
            ...prevState, [`tier${tier}`]: // Maintain previous state (top level / all tiers)
            {
                ...prevState[`tier${tier}`], // Maintain previous state (bottom level / tier-specific)
                [id]: 
                    (tenses[`tier${tier}`][id] === 'active' && 'inactive') // If active, inactivate
                    || 
                    (tenses[`tier${tier}`][id] === 'inactive' && 'active') // If inactive, activate
            }
        }))

        // Check complexity status
        setTenses(state => {
            
            for (let subject in subjects){ // Iterate through subjects
                if (subjects[subject] === 'active'){ // If subject is active...
                    activeSubjects.push(subject) // ...push subject to activeSubjects array
                }
            }

            for (let button in state.tier3){ // Iterate through complexities
                if (state.tier3[button] === 'active'){ // If complexity is active...
                    activeComplexities.push(button) // ...push complexity to activeComplexities array
                }
            }

            for (let button in state.tier2){ // Iterate through masters
                if (activeComplexities.filter(c => !buttonDetails[button].exclusions.tenses.includes(c)).length === 0 
                    || activeSubjects.filter(s => !buttonDetails[button].exclusions.subjects.includes(s)).length === 0){
                    state.tier2[button] = 'disabled' // Disable button if active complexities or subjects conflict with exclusions
                } else if (state.tier2[button] === 'disabled'){ // Else, if no conflicts occur...
                    state.tier2[button] = 'inactive' //... and if button is currently disabled, set button to inactive
                }
            }


            for (let button in state.tier1){ // Iterate through tenses
                if (activeComplexities.filter(complexity => !buttonDetails[button].exclusions.tenses.includes(complexity)).length === 0
                    || activeSubjects.filter(s => !buttonDetails[button].exclusions.subjects.includes(s)).length === 0){
                    state.tier1[button] = 'disabled' // Disable button if active complexities or subjects conflict with exclusions
                } else if (state.tier1[button] === 'disabled'){ // Else, if no conflicts occur...
                    state.tier1[button] = 'inactive' //... and if button is currently disabled, set button to inactive
                }
            }
            return {...state} // Update state
        })

        // Check master status
        setTenses(state => {
            for (let button in state.tier2){
                if (state.tier2[button] !== 'active'){
                    for (let child in state.tier1){
                        if (child.includes(buttonDetails[button].family)){
                            state.tier1[child] = 'disabled'
                        }
                    }
                }
                else{
                    let active = 0

                    for (let child in state.tier1){
                        if (child.includes(buttonDetails[button].family) && state.tier1[child] === 'active'){
                            active++
                        }
                    }

                    if (active === 0 && id.includes('master')){
                        for (let child in state.tier1){
                            if (child.includes(buttonDetails[button].family)){
                                state.tier1[child] = 'active'
                            }
                        }
                    }

                    if (active === 0 && !id.includes('master')){
                        state.tier2[button] = 'inactive'
                        
                        for (let child in state.tier1){
                            if (child.includes(buttonDetails[button].family)){
                                state.tier1[child] = 'disabled'
                            }
                        }
                    }
                }
            }

            return {...state} // Update state
        })

    }
    
    for (let button of buttons.tenses){ // Iterate through tense buttons and assign details to objects
        buttonDetails[button.id] = { // Uses button ID as key
            family: button.family,
            tier: button.tier,
            exclusions: button.exclusions,
        }

        if (button.family !== 'complexity'){
            if (button.family in familySize){
                familySize[button.family]++
            } else {
                familySize[button.family] = 1
            }
        }
    }

    useEffect(() => {
        let activeTenses = [];
        let activeComplexities = []

        for (let button in tenses.tier3){
            if (tenses.tier3[button] === 'active'){
                activeComplexities.push(button)
            }
        }

        for (let button in tenses.tier1){
            if (tenses.tier1[button] === 'active'){
                for (let complexity of activeComplexities){
                    if (!buttonDetails[button].exclusions.tenses.includes(complexity)){
                        activeTenses.push(`${complexity}-${button}`)
                    }
                }
            }
        }

        setActiveTenses(activeTenses)
    }, [tenses])

    useEffect(() => {
        let activeSubjects = [];
        
        for (let subject of buttons.subjects){
            if (subjects[subject["genericId"]] === "active" && subject['genericId'] !== "all"){
                activeSubjects.push(subject["specificId"])
            }
        }

        setActiveSubjects(activeSubjects)
    }, [subjects])

    useEffect(() => props.setConfiguration(state => (
        {
            ...state,
            subjects: 
                {
                    active: activeSubjects,
                    buttons: subjects
                },
            tenses: 
                {
                    active: activeTenses,
                    buttons: tenses
                }
        }
    )), [activeSubjects, activeTenses])

    return(
        <>
            <section id = {styles["subjects"]}>
                <div id = {styles["tenses-tab-title"]} className = {`${styles["tab"]} ${styles["title"]}`}>
                    Subjects
                </div>
                <div id = "subjects-tab-value" className = {`${styles["tab"]} ${styles["value"]}`}>
                    <div className = {styles["number"]}>
                            <p>{activeSubjects.length}</p>
                    </div>
                </div>
                <div id = {styles["subjects"]} className = {styles["container"]}>
                    {buttons.subjects.map(button =>
                        <>
                            <button 
                                key = {styles[button.specificId]}
                                className = {`${styles["button"]} ${styles["subjects"]} ${styles[subjects[button.genericId]]} ${styles[button.position]}`}
                                id = {styles[button.genericId]}
                                onClick = {() => handleClickSubject(button.genericId)}>
                                {button.text}
                            </button>
                            {button.genericId === "all" && <div className = {styles["vl"]} />}
                        </>
                    )}
                </div>
            </section>
            <section id = {styles["tenses"]}>
                <div id = {styles["tenses-tab-title"]} className = {`${styles["tab"]} ${styles["title"]}`}>
                    Tenses
                </div>
                <div id = {styles["tenses-tab-value"]} className = {`${styles["tab"]} ${styles["value"]}`}>
                    <div className = {styles["number"]}>
                            <p>{activeTenses.length}</p>
                    </div>
                </div>
                <div id = {styles["tenses"]} className = {styles["container"]}>
                    {rows.map(row => <div
                        key = {`tense-row-${row + 1}`}
                        className = {styles["tense-row"]}
                        id = {styles[`tense-row-${row + 1}`]}
                        style = {{marginBottom: row === rows[rows.length - 1] ? "0" : "0.5em"}}>
                    
                        {buttons.tenses.map(button => {
                            if (button.row === row + 1){
                                return <>                       
                                    <button 
                                        key = {button.id}
                                        className = {styles["button"] + " " + styles["tenses"] + " " +
                                            `${button.position ? `${styles[button.position] + " "} ` : ''}` +
                                            styles[`tier-${familySize[button.family] === 1 ? 2 : button.tier}`] + " " +
                                            styles[`${tenses[`tier${button.tier}`][button.id]}`]}
                                        id = {styles[button.id]}
                                        onClick = {() => handleClickTense(button.id)}>

                                        {button.text}
                                    </button>
                                    {button.divider && <div className = {styles["vl"]} />}
                                </>
                            }
                        })}
                    </div>
                    )}
                </div>
            </section>
        </>
    )
}

export default Buttons;