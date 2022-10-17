import React, { useState, useEffect } from "react";
import { getXP, getLevel } from '../../../utils/xp'

function Level(props){

    const styles = props.styles

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

    useEffect(() => {
        const arc = document.getElementById( styles["progress-circle__foreground"] )
        const circle = document.getElementById( styles["progress"])
        const button = document.getElementById( styles["button-continue-level-wrapper"])
        const root = document.documentElement;
        
        const simple = level === getLevel( props.xp.new ) 

        const delta = simple ? props.xp.new - xp : boundaries.high - xp
        const speed = parseFloat( getComputedStyle( root ).getPropertyValue( "--speed" ) )
        const duration = ( ( 1 / speed * 250 ) + ( delta / 360 ) * ( 1 / speed * 2000 ))

        root.style.setProperty('--initial', position.initial);
        root.style.setProperty('--animation-duration', `${duration}ms`);

        if ( simple ) root.style.setProperty('--target', position.target);
        else root.style.setProperty('--target', 360)

        if ( !simple ){
            const pivot = boundaries.high
            const newBoundaries = getBoundaries( pivot )

            arc.onanimationend = () => {    
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
                if (current < props.xp.new){
                    return current + 1
                }
                
                clearInterval( interval )

                return current
            })
        }, ( duration / delta ) )

        try { clearInterval( displayButton ) }
        catch {}

        let displayButton = setTimeout(() => {
            button.style.animation = `${styles["slide-up"]} 500ms ease forwards`
            circle.style.animation = `${styles["slide-up"]} 500ms ease forwards`
        }, duration + 500)

        return () => clearInterval( interval )

    }, [level])

    return(
        <div id = {styles["level"]}>
            <div id = {styles["progress"]}>
                <div id = {styles["progress-circle"]}>
                <svg>
                    <circle
                        id = {styles["progress-circle__background"]}
                        cx = "50%" cy = "50%"
                        r = "calc( 50% - ( 4vh / 2 ) )" 
                    />
                    <circle 
                        key = { level }
                        id = {styles["progress-circle__foreground"]}
                        cx = "50%" cy = "50%"
                        r = "calc( 50% - ( 4vh / 2 ) )" 
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

                    <p className = {styles["main-text"]} id = {styles["divider"]}>|</p> 

                    <div id = {styles["next-level"]}>
                        <p className = {styles["main-text"]} id = {styles["next-level-xp"]}>{ boundaries.high }</p>
                        <p className = {styles["sub-text"]} id = {styles["current-xp-label"]}>Next Level</p>
                    </div>
                </div>

                <div id = {styles["language"]}>
                    <img src = {props.flag} alt = "" draggable = "false" />
                    <div id = {styles["img-shadow"]} />
                </div>
            </div>
            <div id = {styles["buttons"]}>
                <div id = {styles["button-continue-level-wrapper"]}>
                    <button
                        id = {styles["button-continue"]}
                        onClick = {() => setTimeout(() => props.setStage('configuration'), 50)}>
                        Continue
                        <div className = {styles["button-overlay"]} />
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Level;