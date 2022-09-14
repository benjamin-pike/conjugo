import { useMemo } from 'react'
import measureText from '../../functions/measureText'
import styles from "./styles/carousel.module.css"

function CarouselCard( props ){

    const [verb, rank] = props.infinitive
    const verbWidth = useMemo( () => measureText(verb, 0), [] )

    return(
        <div
            className = {styles["verb-card"]}
            id = {rank}
            key = {`infinitive_${rank}`}>
                <div 
                    className = {styles["verb-card-face"]}
                    id = {props.state.focus === rank ? `${styles["verb-card-face__focused"]}` : ""}
                    onClick = {() => {
                        props.postStarred(props.state.starredVerbs)
                        props.dispatch({ type: props.ACTIONS.UPDATE_VERB, payload: { focus: rank } })
                    }}>
                    <p 
                        className = { styles["rank"] } 
                        style = {{ 
                            width: `${rank.toString().length}ch`,
                            padding: `0 ${ 1.35 - ( rank.toString().length - 1 ) / 5 }em 0 ${ 1.5 - ( rank.toString().length - 1 ) / 5 }em` 
                        }}>
                            { rank }
                    </p>
                    <div className = { styles["divider"] } />
                    <p 
                        className = { styles["infinitive"] }
                        style = {{ 
                            fontSize: `${ verbWidth > 75 ? 1 - (verbWidth - 75) / 100 : 1 }em`,
                            paddingRight: `${ ( 3 - rank.toString().length ) * 0.25 }em`
                        }}>
                            <span>{ verb }</span>
                    </p>
                    {props.state.starredVerbs && props.state.starredVerbs.includes(verb) && <div className = {styles["verb-card__right-bar"]} />}
                </div>
        </div>
    );
}

export default CarouselCard;