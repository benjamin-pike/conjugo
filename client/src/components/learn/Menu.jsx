import { useState } from 'react';
import styles from './styles/menu.module.css';
import { useLang } from '../../store/LangContext'
import { useNav } from '../../store/NavContext'
import tenseColors from "../../assets/js/map-tense-colors.js";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLock } from '@fortawesome/free-solid-svg-icons';


const CARDS = {
    spanish: [
        'simple-indicative-present',
        'simple-indicative-preterite',
        'simple-indicative-imperfect',
        'simple-indicative-future',
        'simple-indicative-conditional',
        'compound-indicative-present',
        'compound-indicative-preterite',
        'compound-indicative-imperfect',
        'compound-indicative-future',
        'compound-indicative-conditional',
        'simple-subjunctive-present',
        'simple-subjunctive-imperfect',
        'simple-subjunctive-future',
        'compound-subjunctive-present',
        'compound-subjunctive-imperfect',
        'compound-subjunctive-future'
    ],
    french: [
        'simple-indicative-present',
        'simple-indicative-preterite',
        'simple-indicative-imperfect',
        'simple-indicative-future',
        'simple-conditional-conditional',
        'compound-indicative-present',
        'compound-indicative-preterite',
        'compound-indicative-imperfect',
        'compound-indicative-future',
        'compound-conditional-conditional',
        'simple-subjunctive-present',
        'simple-subjunctive-imperfect',
        'compound-subjunctive-present',
        'compound-subjunctive-imperfect',
    ]
}

const Card = props => {
    const isSelected = props.cardIndex === props.selectedIndex 
    const scale = isSelected
        ? 1.1
        : 1 - Math.abs(props.selectedIndex - props.cardIndex) / 100

    const i = props.cardIndex
    const n = props.totalCards
    const s = props.selectedIndex

    const color = tenseColors[props.tenseRoot.split('-').at(-1)]

    const handleHover = (e, isSelected) => {
        const isButton = e.target.nodeName === 'P'
        const card = e.target.closest(`.${styles["card"]}`)

        if (isSelected && !isButton && e.type === 'mousemove'){
            const bounds = card.getBoundingClientRect()
    
            const xRotation = (e.clientX - bounds.left) / (bounds.right - bounds.left) - 0.5
            const yRotation = (e.clientY - bounds.top) / (bounds.bottom - bounds.top) - 0.5
    
            card.style.transform = `rotateY(${20 * xRotation}deg) rotateX(${20 * -yRotation}deg)`
            card.style.filter = `brightness(${1 - 0.15 * (xRotation + yRotation)})`

            return
        }
        card.style.transform = ''
        card.style.filter = ''
    }

    return(
        <div
            key = { props.cardIndex }
            className = {styles["card"]}
            distance = { Math.abs(props.selectedIndex - props.cardIndex) }
            unlocked = { props.unlocked.toString() }
            onClick = { () => props.setSelectedCard(props.cardIndex) }
            onMouseMove = { e => handleHover(e, isSelected) }
            onMouseLeave = { e => handleHover(e, isSelected) }
            style = {{ 
                backgroundImage: `url(./learn-cards/${props.language.name}-${props.tenseRoot}.svg)`,
                // translate: `${19.25 * (props.selectedIndex - props.cardIndex)}em`,
                // left: `${3 * (props.cardIndex + 1)}em`,
                left: `calc(${(((n-1)/2 - s) / ((n-1)/2))}em + ${100*i/(n - 1)}% - (var(--card-width) * ${i/(n - 1)}))`,
                zIndex: `${props.totalCards - Math.abs(props.selectedIndex - props.cardIndex)}`,
                scale:  `${scale}`,
                rotate: `y ${2.5 * (props.selectedIndex - props.cardIndex)}deg`,
                // filter: `grayscale(${0 + Math.abs(props.selectedIndex - props.cardIndex) / 5})`
                // filter: `blur(${0 + Math.abs(props.selectedIndex - props.cardIndex) / 10}px)`
            }}
        >
            
            {props.unlocked && <header className = {styles['progress']}>
                <div className = {styles['progress__bar']}>
                    <div className = {styles['progress__bar--background']} />
                    <div 
                        className = {styles['progress__bar--foreground']} 
                        style = {{
                            width: `${50}%`,
                            backgroundColor: `var(--${color})`
                        }}
                    />
                </div>
                <div className = {styles['progress__text']}>
                    <p style = {{outline: `1px solid var(--${color})`}}>
                        10
                    </p>
                </div>
            </header>}

            {isSelected && <button 
                onClick = { () => { if (props.unlocked) props.selectTense(props.tenseRoot) } }>
                {props.unlocked ? <>
                    <p className = {styles['inactive']}>
                        Start Lesson
                    </p>
                    <div className = {styles['active--wrapper']}>
                        <p
                            className = {styles['active']}
                            style = {{ backgroundImage: `url(./learn-cards/${props.language.name}-${props.tenseRoot}.svg)`}}
                        >
                            Start Lesson
                        </p>
                    </div>
                </>
                : <FontAwesomeIcon icon = {faLock} />
                }
            </button>}
        </div>
    )

}

const Menu = props => {
    const { language } = useLang();
    const [selectedCard, setSelectedCard] = useState(0)
    const [transition, setTransition] = useState(false)
    const { displayNav } = useNav()
    displayNav(true)

    const unlocked = 6

    window.onkeydown = e => setSelectedCard(index => {
        if (index !== 0 && (e.key === 'ArrowLeft' || e.key === 'ArrowDown'))
            index--
        
        if (index !== CARDS[language.name].length - 1 && (e.key === 'ArrowRight' || e.key === 'ArrowUp'))
            index++

        return index
    })

    const selectTense = tenseRoot => {
        setTransition(true)

        setTimeout(() => props.setTense(tenseRoot), 1000)
    }

    return(
        <div 
            key = 'menu'
            id = {styles["menu"]} 
            style = {{backgroundImage: 'url(./subtle-waves.svg)'}}
            transition = { transition.toString() }
        >
            <h1>Select the tense you would like to learn</h1>
            <div id = {styles["cards--container"]}>
                {CARDS[language.name].map((tenseRoot, index, arr) => <Card 
                    unlocked = {index < unlocked}
                    selectedIndex = { selectedCard }
                    setSelectedCard = { setSelectedCard }
                    cardIndex = { index }
                    totalCards = { arr.length }
                    language = {language}
                    tenseRoot = {tenseRoot}
                    selectTense = { selectTense }
                />)}
            </div>
            <div id = {styles["navigator"]}>
                {CARDS[language.name].map((tenseRoot, index, arr) => <div
                    key = { index }
                    className = { styles['nav-dot'] }
                    isselected = { `${selectedCard == index}` }
                    unlocked = { `${index < unlocked}` }
                    onClick = { () => setSelectedCard(index) }
                    connect = { `${index !== arr.length - 1 && 
                        tenseRoot.split("-")[0] === arr[index + 1].split("-")[0] &&
                        tenseRoot.split("-")[1] === arr[index + 1].split("-")[1] }` }
                    color = { tenseColors[ tenseRoot.split("-").at(-1)] }
                    style = {{color: `var(--${tenseColors[ tenseRoot.split("-").at(-1)]})`}}
                />)}
            </div>
        </div>
    );
}

export default Menu;