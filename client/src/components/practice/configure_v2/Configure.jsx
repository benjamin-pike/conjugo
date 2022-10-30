import { useState, useEffect } from 'react';
import { useLang } from '../../../store/LangContext';
import useHTTP from '../../../hooks/useHTTP';
import ScrollingText from '../../common/ScrollingText/ScrollingText';
import RaisedButton from '../../common/RaisedButton/RaisedButton';
import subjectMap from '../../../assets/js/map-subject-person';
import tenseMap from '../../../assets/js/map-tense-names';
import subjectColors from '../../../assets/js/map-subject-colors';
import tenseColors from '../../../assets/js/map-tense-colors';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretRight } from '@fortawesome/free-solid-svg-icons';
import styles from './styles/configure.module.css'

const Chip = props => {
    const { language } = useLang()

    if (props.empty){
        return(
            <div 
                className = {`${styles['chip']} ${styles['empty']}`}
                color = 'black'
            >
                <p>Please select at least one {props.type === 'subject' ? 'subject' : 'tense'}</p>
            </div>
        );
    }
    
    const text = props.type === 'subject' 
        ? subjectMap[language.name]['subjects'][props.subject].slice(0, 2).join(' • ')
        : tenseMap[props.tenseRoot][language.name]['english']

    const color = props.type === 'subject'
        ? subjectColors[language.name][subjectMap[language.name]['subjects'][props.subject][0]]
        : tenseColors[props.tenseRoot.split('-').at(-1)]
    
        return(
            <div 
                className = {styles['chip']}
                color = {color}
                onClick = {() => props.type === 'subject' 
                    ? props.removeSubject(props.subject) 
                    : props.removeTense(props.tenseRoot)
                }
            >
                <p>{text.toLowerCase()}</p>
                <button 
                    className = {styles['remove-chip']} 
                />
            </div>
    );
}

const Slider = props => {
    const colorBoundaries = {
        verbs: [
            [2000, 'purple'],
            [1000, 'red'],
            [500, 'orange'],
            [200, 'yellow'],
            [50, 'green'],
        ],
        target: [
            [50, 'purple'],
            [40, 'red'],
            [30, 'orange'],
            [20, 'yellow'],
            [10, 'green'],
        ],
        time: [
            [300, 'green'],
            [240, 'yellow'],
            [180, 'orange'],
            [120, 'red'],
            [60, 'purple'],
        ]
    }

    const adjustValue = value => 
        props.type === 'target'
            ? Math.ceil((value / 2) / 5) * 5
        : props.type === 'time'
            ? Math.ceil((value / 0.3) / 15) * 15
        : value <= 60 ? Math.ceil((value * 5) / 6 / 10) * 10
        : value <= 120 ? Math.ceil(((value * 15) / 6 - 100) / 25) * 25
        : value <= 180 ? Math.ceil(((value * 30) / 6 - 400) / 50) * 50
        : value <= 240 ? Math.ceil(((value * 50) / 6 - 1000) / 100) * 100
        : Math.ceil(((value * 100) / 6 - 3000) / 200) * 200;

    const normalizeValue = value =>
        props.type === 'target'
            ? (value * 2)
        : props.type === 'time'
            ? Math.ceil(value * 0.3)
        : value <= 50 ? Math.ceil(value * 6 / 5)
        : value <= 200 ? Math.ceil((value * 6 + 100) / 15)
        : value <= 500 ? Math.ceil((value * 6 + 400) / 30)
        : value <= 1000 ? Math.ceil((value * 6 + 1000) / 50)
            : Math.ceil((value * 6 + 3000) / 100);

    const [rawValue, setRawValue] = useState(normalizeValue(props.configuration[props.type]));

    const adjustedValue = adjustValue(rawValue)

    const color = colorBoundaries[props.type].reduce((output, [boundary, color]) =>
        adjustedValue <= boundary ? color : output
    , '')

    const maxValue = props.type === 'verbs' ? 300 : props.type === 'target' ? 100 : 90
    
    useEffect(() => {
        props.setConfiguration(prevState => ({ ...prevState, [props.type]: adjustedValue }))
    }, [rawValue])

    return(
        <div className = {styles['slider__container']}>
            <div
                className = {styles['slider__value']}
                color = {color}
            >
                <p style = {{ width: `${ props.type !== "time" ? adjustedValue.toString().length : 4 }ch` }}>
                    {props.type !== 'time' 
                        ? adjustedValue
                        : `${Math.floor(adjustedValue / 60)}:${adjustedValue % 60 < 10 ? '0' : ''}${adjustedValue % 60}`
                    }
                </p>
            </div>
            <div 
                className = {styles['slider']}
                color = {color}
            >
                <div className = {styles['slider__background']} />
                <div 
                    className = {styles['slider__foreground']} 
                    style = {{ width: `calc(${100 * rawValue / maxValue}% + (var(--slider-height) * (1 - ${rawValue / maxValue})))` }}
                >
                    <div className = {styles['slider__thumb']} />
                </div>
                <input
                    type = 'range'
                    min = {5}
                    max = {maxValue}
                    value = {rawValue}
                    onChange = {e => setRawValue(e.target.value)}
                />
            </div>
        </div>
    );
}

const Configure = props => {

    const { language } = useLang()
    const { sendRequest } = useHTTP()

    const [sectionOpen, setSectionOpen] = useState({subjects: false, tenses: false})
    
    const [configuration, setConfiguration] = useState({
        subjects: [],
        tenses: [],
        verbs: 50,
        target: 50,
        time: 50,
    })
    
    const toggleSection = section => {
        console.log(`${sectionOpen.subjects}`)
        setSectionOpen(prevState => ({subjects: false, tenses: false, [section]: !prevState[section]}))
    }

    const subjects = [
        'firstSingular', 'secondSingular', 'thirdSingular', 'firstPlural', 'secondPlural', 'thirdPlural'
    ]

    const tenses = [
        "simple-indicative-present",
        "simple-indicative-preterite",
        "simple-indicative-imperfect",
        "simple-indicative-future",
        "simple-indicative-pluperfect",
        "simple-indicative-conditional",
        "simple-conditional-conditional",
        "simple-subjunctive-conditional",
        "compound-indicative-present",
        "compound-indicative-preterite",
        "compound-indicative-imperfect",
        "compound-indicative-future",
        "compound-indicative-conditional",
        "compound-conditional-conditional",
        "compound-subjunctive-conditional",
        "simple-subjunctive-present",
        "simple-subjunctive-imperfect",
        "simple-subjunctive-future",
        "compound-subjunctive-present",
        "compound-subjunctive-imperfect",
        "compound-subjunctive-future",
    ].filter(tense => tenseMap[tense][language.name] !== undefined)

    const removeSubject = subject => setConfiguration(prevState => 
        ({ ...prevState, subjects: prevState.subjects.filter(item => item !== subject) }))
    
    const removeTense = tense => setConfiguration(prevState => 
        ({ ...prevState, tenses: prevState.tenses.filter(item => item !== tense) }))

    const toggleSubject = subject => setConfiguration(prevState => {
        if (prevState.subjects.includes(subject))
            return { ...prevState, subjects: prevState.subjects.filter(item => item !== subject) }
        
        const unordered = [...prevState.subjects, subject]

        return { ...prevState, subjects: subjects.reduce((ordered, subject) => {
            if (unordered.includes(subject))
                ordered.push(subject)

            return ordered
        }, [])}
    })

    const toggleTense = tense => setConfiguration(prevState => {
        if (prevState.tenses.includes(tense))
            return { ...prevState, tenses: prevState.tenses.filter(item => item !== tense) }
        
        const unordered = [...prevState.tenses, tense]

        return { ...prevState, tenses: tenses.reduce((ordered, tense) => {
            if (unordered.includes(tense))
                ordered.push(tense)

            return ordered
        }, [])}
    })

    const isValid = configuration.subjects.length && configuration.tenses.length

    const postConfiguration = async ( data ) => {
        if (isValid){
            await sendRequest({
                url: `/api/practice/configure/${language.name}`,
                method: "PUT",
                body: data
            })

            props.setStage("round")
        } 
    }

    const handleHover = e => {
        if (e.type === 'mouseenter'){
            if (e.target.classList.contains(styles['button-hover']))
                return e.target.onanimationiteration = () => {}
            
            return e.target.classList.add(styles['button-hover'])
        }

        return e.target.onanimationiteration = e => {
            e.target.classList.remove(styles['button-hover'])
            
            e.target.onanimationiteration = () => {}
        }
    }

    useEffect(async () => {
        const data = await sendRequest({ url: `/api/practice/configure/${language.name}` })

        if (data) setConfiguration(data)
    }, [language])

    return(
        <div id = {styles['configure']}>
            <ScrollingText />
            {/* <div 
                id = {styles['backdrop']}
                style = {{backgroundImage: 'url(./subtle-waves.svg)'}}
            /> */}

            {/* <h1>Set up your practice session</h1> */}
            <div 
                id = {styles['mount']}
                opensection = {sectionOpen.subjects ? 'subjects' : sectionOpen.tenses ? 'tenses' : 'none'}
            >
                <section 
                    id = {styles['subjects']}
                    className = {styles['row'] + ' ' + styles['toggleable']}
                >
                    <div className = {styles['summary']}>
                        <h2 onClick = {() => toggleSection('subjects')}>Subjects</h2>
                        <button 
                            className = {styles['toggle']}
                            active = {`${sectionOpen.subjects}`}
                            onClick = {() => toggleSection('subjects')}
                        >
                            <FontAwesomeIcon icon = {faCaretRight} />
                        </button>
                        <div className = {styles['vertical-divider']} />
                        <div className = {styles['chips']}>
                            {configuration.language === language.name && configuration.subjects.length
                                ? configuration.subjects.map(subject => <Chip
                                    key = {subject} 
                                    type = 'subject'
                                    subject = {subject}
                                    removeSubject = {removeSubject}
                                />)
                                : <Chip 
                                    type = 'subject' 
                                    empty = {true} 
                                />
                        }
                        </div>
                    </div>
                    <div 
                        className = {`${styles['buttons__wrapper']} ${styles['subjects']}`}                        
                        active = {`${sectionOpen.subjects}`}
                    >
                        <div className = {styles['buttons__container']}>
                            <button
                                active = {`${configuration.subjects.length === 6}`}
                                onClick = {() => setConfiguration(prevState => 
                                    ({ ...prevState, subjects: configuration.subjects.length === 6 ? [] : subjects }))}
                                color = 'black'
                            >
                                <p>all</p>
                            </button>
                            <div className = {styles['vertical-divider']} />
                            {subjects.map(subject => 
                                <button
                                    active = {`${configuration.subjects.includes(subject)}`}
                                    color = {subjectColors[language.name][subjectMap[language.name]['subjects'][subject][0]]}
                                    onClick = {() => toggleSubject(subject)}
                                    onMouseEnter = {handleHover}
                                    onMouseLeave = {handleHover}
                                >
                                    <p>{subjectMap[language.name]['subjects'][subject].slice(0, 2).join(' • ')}</p>
                                </button>
                            )}
                        </div>
                    </div>
                </section>

                <section 
                    id = {styles['tenses']}
                    className = {styles['row'] + ' ' + styles['toggleable']}
                >
                    <div className = {styles['summary']}>
                    <h2 onClick = {() => toggleSection('tenses')}>Tenses</h2>
                        <button 
                            className = {styles['toggle']}
                            active = {`${sectionOpen.tenses}`}
                            onClick = {() => toggleSection('tenses')}
                        >
                            <FontAwesomeIcon icon = {faCaretRight} />
                        </button>
                        <div className = {styles['vertical-divider']} />
                        <div className = {styles['chips']}>
                            {configuration.language === language.name && configuration.tenses.length 
                                ? configuration.tenses.map(tenseRoot => <Chip
                                    key = {tenseRoot}
                                    type = 'tense' 
                                    tenseRoot = {tenseRoot} 
                                    removeTense = {removeTense}
                                />)
                                : <Chip 
                                    type = 'tense' 
                                    empty = {true} 
                                />
                            }
                        </div>
                    </div>
                    <div 
                        className = {`${styles['buttons__wrapper']} ${styles['tenses']}`}
                        active = {`${sectionOpen.tenses}`}
                    >
                        <div className = {styles['buttons__container']}>
                            {tenses.map(tense => 
                                <button
                                    active = {`${configuration.tenses.includes(tense)}`}
                                    color = {tenseColors[tense.split('-').at(-1)]}
                                    onClick = {() => toggleTense(tense)}
                                    language = {language.name}
                                    complexity = {tense.split('-')[0]}
                                    mood = {tense.split('-').at(-2)}
                                    tense = {tense.split('-').at(-1)}
                                    onMouseEnter = {handleHover}
                                    onMouseLeave = {handleHover}
                                >
                                    <p>{tenseMap[tense][language.name]['english']}</p>
                                </button>
                            )}
                        </div>
                    </div>
                </section>
                <section 
                    id = {styles['verbs']}
                    className = {styles['row']}
                >
                    <h2>Verbs</h2>
                    <Slider 
                        type = 'verbs'
                        configuration = {configuration}
                        setConfiguration = {setConfiguration}
                    />
                </section>
                <div className = {styles['combined-rows']}>
                    <section 
                        id = {styles['target']}
                        className = {styles['row']}
                    >
                        <h2>Target</h2>
                        <Slider
                            type = 'target' 
                            configuration = {configuration}
                            setConfiguration = {setConfiguration}
                        />
                    </section>
                    <div className = {styles['vertical-divider']} />
                    <section 
                        id = {styles['time']}
                        className = {styles['row']}
                    >
                        <h2>Time</h2>
                        <Slider
                            type = 'time' 
                            configuration = {configuration}
                            setConfiguration = {setConfiguration}
                        />
                    </section>
                </div>
            </div>
            <div id = {styles['button__start-round']}> 
                <RaisedButton
                    text = { "Start" }
                    disabled = { !isValid }
                    onClick = { () => postConfiguration(configuration) }
                    verticalPadding = { "0.5em" }
                    horizontalPadding = { "1.75em" }
                />
            </div>
        </div>
    );
}
export default Configure