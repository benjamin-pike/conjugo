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

    const [xp, setXP] = useState( props.xp.current )
    const [level, setLevel] = useState( getLevel( xp ) )
    const [boundaries, setBoundaries] = useState( getBoundaries( xp ) )
    const [position, setPosition] = useState({
        initial: getPosition( xp, boundaries ),
        target: getPosition( props.xp.new, boundaries )
    })

    const circleRef = useRef(null)
    const arcRef = useRef(null)

    useEffect(() => {
        const simple = level === getLevel( props.xp.new ) 
        
        const delta = simple ? props.xp.new - xp : boundaries.high - xp
        const speed = parseFloat( getComputedStyle(circleRef.current).getPropertyValue( "--speed" ) )
        const duration = ( ( 1 / speed * 250 ) + ( delta / 360 ) * ( 1 / speed * 2000 ))
        
        circleRef.current.style.setProperty('--initial', position.initial);
        circleRef.current.style.setProperty('--animation-duration', `${duration}ms`);
        
        if ( simple ) circleRef.current.style.setProperty('--target', position.target);
        else circleRef.current.style.setProperty('--target', 360)

        if ( !simple ){
            const pivot = boundaries.high
            const newBoundaries = getBoundaries( pivot )

            arcRef.current.onanimationend = () => {    
                setBoundaries( newBoundaries )
                setPosition({
                    initial: getPosition( pivot, newBoundaries ),
                    target: getPosition( props.xp.new, newBoundaries )
                })
                setLevel( currentLevel => currentLevel + 1 )
            }
        }
        
        let interval  = setInterval( () => {
            setXP(current => {
                if (current < props.xp.new)
                    return current + 1
                
                clearInterval( interval )

                return current
            })
        }, ( duration / delta ) )

        return () => clearInterval( interval )
    }, [level, start])

    useEffect(() => setTimeout(() => setStart(true), 3000), [])

    return(
        <div 
            ref = { circleRef }
            id = {styles["progress"]}
        >
            <div id = {styles["progress-circle"]}>
                <svg>
                    <circle
                        id = {styles["progress-circle__background"]}
                        cx = "50%" cy = "50%"
                        r = "calc( 50% - ( 4.5vh / 2 ) )" 
                    />
                    <circle
                        ref = { arcRef }
                        key = { level }
                        id = {styles["progress-circle__foreground"]}
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