import { useState, useEffect, useRef } from 'react'
import { useLang } from '../../../store/LangContext'
import { getXP, getLevel } from '../../../utils/xp'
import styles from './progress-circle.module.css'

const ProgressCircle = props => {
    const { language } = useLang()
    const [start, setStart] = useState(false)

    const getBoundaries = xp => {
        const level = getLevel( xp )
        const low = getXP( level )
        const high = getXP( level + 1 )

        return { level, low, high }
    }

    const getPosition = (xp, boundaries) => {
        return 360 * (xp - boundaries.low) / (boundaries.high - boundaries.low) 
    }

    const bonus = props.xp.bonus ?? 0

    const [xp, setXP] = useState( props.xp.current )
    const [level, setLevel] = useState( getLevel( xp ) )
    const [boundaries, setBoundaries] = useState( getBoundaries( xp ) )
    const [initialXP, setInitialXP] = useState( props.xp.current )
    const [position, setPosition] = useState({
        initial: getPosition( xp, boundaries ),
        targetBase: getPosition( props.xp.new, boundaries ),
        targetBonus: getPosition( props.xp.new + bonus, boundaries )
    })

    const circleRef = useRef(null)
    const baseRef = useRef(null)
    const bonusRef = useRef(null)

    useEffect(() => {
        const simple = level === getLevel( props.xp.new + bonus ) 

        const baseDelta = simple ? props.xp.new - initialXP : boundaries.high - initialXP
        const bonusDelta = simple ? props.xp.new + bonus - initialXP : boundaries.high - initialXP
        
        const speed = parseFloat( getComputedStyle(circleRef.current).getPropertyValue( "--speed" ) )
        
        const baseDuration = baseDelta > 0 
            ? ( ( 1 / speed * 250 ) + ( baseDelta / 360 ) * ( 1 / speed * 2000 ))
            : 0
        const bonusDuration = ( ( 1 / speed * 250 ) + ( bonusDelta / 360 ) * ( 1 / speed * 2000 ))
        const totalDuration = baseDuration + bonusDuration

        circleRef.current.style.setProperty('--initial', position.initial);
        circleRef.current.style.setProperty('--animation-duration--base', `${baseDuration}ms`);
        circleRef.current.style.setProperty('--animation-duration--bonus', `${bonusDuration}ms`);

        if (simple) {
            circleRef.current.style.setProperty('--target--base', position.targetBase);
            circleRef.current.style.setProperty('--target--bonus', position.targetBonus);

            bonusRef.current.onanimationend = () => {
                bonusRef.current.style.setProperty('animation', 
                    `${styles['draw-arc--bonus']} var(--animation-duration--bonus) ease forwards`
                )
            }
        } else {
            const baseOverlap = level !== getLevel(props.xp.new)
            let hasPivoted = false

            circleRef.current.style.setProperty('--target--base',
                baseOverlap ? 360 : position.targetBase
            )

            circleRef.current.style.setProperty('--target--bonus', 360);
            console.log(circleRef.current.style.getPropertyValue('--target--bonus'))
            
            const pivot = boundaries.high
            const newBoundaries = getBoundaries(pivot)

            if (baseOverlap) {
                bonusRef.current.onanimationend = () => {
                    setBoundaries(newBoundaries)
                    setPosition({
                        initial: getPosition(pivot, newBoundaries),
                        targetBase: getPosition(props.xp.new, newBoundaries),
                        targetBonus: getPosition(props.xp.new + bonus, newBoundaries)
                    })
                    setInitialXP(pivot)
                    setLevel(currentLevel => currentLevel + 1)
                }            
            } else {
                bonusRef.current.onanimationend = () => {
                    if (!hasPivoted) {
                        bonusRef.current.style.setProperty('animation', 
                            `${styles['draw-arc--bonus']} var(--animation-duration--bonus) ease forwards`
                        )

                        return hasPivoted = true
                    }

                    setBoundaries(newBoundaries)
                    setPosition({
                        initial: getPosition(pivot, newBoundaries),
                        targetBase: 0,
                        targetBonus: getPosition(props.xp.new + bonus, newBoundaries)
                    })
                    setInitialXP(pivot)
                    setLevel(currentLevel => currentLevel + 1)
                }
            }
        }
        
        let interval = setInterval( () => {
            setXP(current => {
                if (current < props.xp.new + bonus)
                    return current + 1
                
                clearInterval( interval )

                return current
            })
        }, props.xp.new >= boundaries.high 
            ? (baseDuration / bonusDelta)
            : (totalDuration / bonusDelta)
        )

        return () => clearInterval( interval )
    }, [level, start])

    useEffect(() => {
        if (level !== getLevel(props.xp.current)) 
            new Audio ('/level-up.mp3').play()
    }, [level])

    useEffect(() => setTimeout(() => setStart(true), 3000), [])

    return(
        <div 
            ref = { circleRef }
            id = {styles["progress"]}
            key = { `${level}-bonus` }
            style = { level !== getLevel(props.xp.current) ? {
                animation: `${styles['new-level']} 750ms ease forwards`
            } : {} }
        >
            <div id = {styles["progress-circle"]}>
                <svg>
                    <circle
                        id = {styles["progress-circle__background"]}
                        cx = "50%" cy = "50%"
                        r = "calc( 50% - ( 4.5vh / 2 ) )" 
                    />
                    <circle
                        ref = { bonusRef }
                        key = { `${level}-bonus` }
                        id = {styles["progress-circle__bonus"]}
                        cx = "50%" cy = "50%"
                        r = "calc( 50% - ( 4.5vh / 2 ) )" 
                    />
                    <circle
                        ref = { baseRef }
                        key = { `${level}-base` }
                        id = {styles["progress-circle__base"]}
                        cx = "50%" cy = "50%"
                        r = "calc( 50% - ( 4.5vh / 2 ) )" 
                    />
                </svg>
            </div>

            <p id = {styles["current-level-title"]}>Level</p>

            <p id = {styles["current-level-value"]}> { level } </p>

            <div id = {styles["xp"]}>
                <div id = {styles["current-xp"]}>
                    <p className = {styles["main-text"]}>{ xp }</p>
                    <p className = {styles["sub-text"]}>Current XP</p>
                </div>

                <div className = {styles["main-text"]} id = {styles["divider"]} /> 

                <div id = {styles["next-level"]}>
                    <p className = {styles["main-text"]} id = {styles["next-level-xp"]}>{ boundaries.high }</p>
                    <p className = {styles["sub-text"]} id = {styles["current-xp-label"]}>Next Level</p>
                </div>
            </div>

            <div id = {styles["language"]}>
                <img src = {language.flag} alt = "" draggable = "false" />
                <div id = {styles["img-shadow"]} />
            </div>
        </div>
    );
}

export default ProgressCircle;