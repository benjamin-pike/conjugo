import React, { useState, useEffect } from "react";
import { buttonsMap } from "./map-buttons";

function Buttons(props){
    const styles = props.styles

    const buttons = buttonsMap[props.language.name]
    
    const genericSubjects = [
        'firstSingular',
        'secondSingular',
        'thirdSingular',
        'firstPlural',
        'secondPlural',
        'thirdPlural'
    ]

    const tenseButtons = buttons.tenses.flat().reduce( (IDs, button) => {
        if (!button.complexities)
            IDs.complexities.push(button)

        if (!button.mood && button.complexities && !button.isolate)
            IDs.moods.push(button)
        
        if ((button.mood || button.isolate) && button.complexities)
            IDs.tenses.push(button)

        return IDs
    }, { complexities: [], moods: [], tenses: [] })

    const [activeSubjects, setActiveSubjects] = useState(props.subjects)
    const [activeTenses, setActiveTenses] = useState(props.tenses)

    const [subjects, setSubjects] = useState(
			Object.fromEntries(
				["all", ...genericSubjects].map(subject => [
                    subject, 
                    activeSubjects.length === 6 || activeSubjects.includes(subject)
                        ? 'active' 
                        : 'inactive'
                ])
			)
		);

    const [tenses, setTenses] = useState(
        Object.fromEntries(buttons.tenses.flat().reduce((buttonStates, button) => {
            if (!button.complexities)
                buttonStates.push([
                    button.id, 
                    activeTenses.map(tense => tense.split('-')[0]).includes(button.id) 
                        ? 'active'
                        : 'inactive'
                ])
            
            if (!button.mood && button.complexities && !button.isolate)
                buttonStates.push([
                    button.id, 
                    activeTenses.map(tense => tense.split('-')[1]).includes(button.id) 
                        ? 'active'
                        : 'inactive'
                ])
            
            if ((button.mood || button.isolate) && button.complexities)
                buttonStates.push([
                    button.id, 
                    activeTenses.map(tense => tense.split('-').slice(1).join('-')).includes(button.id) 
                        ? 'active'
                        : 'inactive'
                ])
        
            return buttonStates
        }, []))
    )

    const handleSubjectClick = subject => {
        setSubjects(prevSubjects => {
            const newSubjects = { ...prevSubjects };
            
            if (subject === "all") {
                newSubjects["all"] =
                    newSubjects["all"] === 'active' ? "inactive" : "active";
                genericSubjects.forEach(
                    subject => (newSubjects[subject] = newSubjects["all"])
                );

                return newSubjects;
            }

            newSubjects[subject] =
                newSubjects[subject] === "active" ? "inactive" : "active";

            
            newSubjects["all"] =
                Object.entries(newSubjects).some(([key, value]) => key !== 'all' && value === 'inactive') 
                    ? "inactive" 
                    : "active";

            return newSubjects;
        })
    }
    
    const checkValidity = state => {
        const allButtons = [...tenseButtons.complexities, ...tenseButtons.moods, ...tenseButtons.tenses]

        allButtons.forEach(button => {
            if (Object.values(subjects).every(value => value === 'inactive')){
                state[button.id] = 'disabled'
                return
            }

            if (button.mood && state[button.mood] !== 'active'){
                state[button.id] = 'disabled'
                return
            }

            if (button.complexities && button.complexities.every(complexity => state[complexity] !== 'active')){
                state[button.id] = 'disabled'
                return
            }

            if (button.excludedSubjects && Object.keys(subjects).filter(subject => !button.excludedSubjects.includes(subject)).every(subject => subjects[subject] === 'inactive')){
                state[button.id] = 'disabled'
                return
            }

            if (state[button.id] === 'disabled')
                state[button.id] = 'inactive'
        })

        return state
    }

    const handleTenseClick = button => {
        setTenses(prevState => {
            const newState = { ...prevState };
            
            if (!button.complexities) 
                newState[button.id] = prevState[button.id] === 'active' ? 'inactive' : 'active'

            if (!button.mood && button.complexities)
                if (button.complexities.some(complexity => prevState[complexity] === 'active'))
                    newState[button.id] = prevState[button.id] === 'active' ? 'inactive' : 'active'

            if (button.mood && button.complexities)
                if (prevState[button.mood] === 'active')
                    newState[button.id] = prevState[button.id] === 'active' ? 'inactive' : 'active'

            return checkValidity(newState);
        })
    }

    useEffect(() => {
        setActiveSubjects(Object.entries(subjects).reduce((active, [key, value]) => {
            if (key !== 'all' && value === 'active')
                active.push(key)
            
            return active
        }, []))

        setTenses(prevState => checkValidity({...prevState}))
    }, [subjects])

    useEffect(() => {        
        setActiveTenses(tenseButtons.tenses.reduce((active, tense) => {
            if (tenses[tense.id] === 'active'){
                tense.complexities.forEach(complexity => {
                    if (tenses[complexity] === 'active'){
                        active.push(`${complexity}-${tense.id}`)
                    }
                })
            }

            return active
        }, []))
    }, [tenses])

    useEffect(() => props.setConfiguration(
        state => ({
            ...state,
            subjects: activeSubjects,
            tenses: activeTenses
        })
    ), [activeSubjects, activeTenses])

    return (
			<>
				<section id={styles["subjects"]}>
					<div
						id={styles["tenses-tab-title"]}
						className={`${styles["tab"]} ${styles["title"]}`}
					>
						Subjects
					</div>
					<div
						id="subjects-tab-value"
						className={`${styles["tab"]} ${styles["value"]}`}
					>
						<div className={styles["number"]}>
							<p>{activeSubjects.length}</p>
						</div>
					</div>
					<div id={styles["subjects"]} className={styles["container"]}>
						<button
							className={`${styles["button"]} ${styles["subjects"]}`}
							id={styles["all"]}
                            state = {subjects["all"]}
							onClick={() => handleSubjectClick("all")}
						>
							all
						</button>
						<div className={styles["vl"]} />
						{buttons.subjects.map((text, index) => (
							<button
								key={genericSubjects[index]}
								className={`${styles["button"]} ${styles["subjects"]}`}
                                state = {subjects[genericSubjects[index]]}
								id={styles[genericSubjects[index]]}
								onClick={() => handleSubjectClick(genericSubjects[index])}
							>
								{text}
							</button>
						))}
					</div>
				</section>
				<section id={styles["tenses"]}>
					<div
						id={styles["tenses-tab-title"]}
						className={`${styles["tab"]} ${styles["title"]}`}
					>
						Tenses
					</div>
					<div
						id={styles["tenses-tab-value"]}
						className={`${styles["tab"]} ${styles["value"]}`}
					>
						<div className={styles["number"]}>
							<p>{activeTenses.length}</p>
						</div>
					</div>
					<div id={styles["tenses"]} className={styles["container"]}>
						{buttons.tenses.map((row, index, arr) => (
							<div
								key={`tense-row-${index + 1}`}
								className={styles["tense-row"]}
								id={styles[`tense-row-${row + 1}`]}
								style={{
									marginBottom: index === arr.length - 1 ? "0" : "0.5em"
								}}
							>
								{row.map((button, i, arr) => (
									<>
										<button
											key = { button.id }
											className = { styles["button"] + " " + styles["tenses"] }
                                            role = { button.mood ? 'tense' : button.complexities ? 'mood' : 'complexity' }
                                            state = { tenses[button.id] }
											id = { styles[button.id] }
											onClick = { () => handleTenseClick(button) }
										>
											{button.text}
										</button>
										{((!button.mood && arr[i + 1]?.mood) || (button.mood && arr[i + 1] && !arr[i + 1].mood)) 
                                            && <div className={styles["vl"]} />
                                        }
									</>
								))}
							</div>
						))}
					</div>
				</section>
			</>
		);
}

export default Buttons;