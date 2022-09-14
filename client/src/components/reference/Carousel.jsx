import { useEffect } from 'react'
import LoadingDots from '../common/LoadingDots/LoadingDots';

import styles from "./styles/carousel.module.css";

function Carousel(props){
    let detailsScrollTimeout;
    let loadVerbs = props.infinitives.length > 100 && props.cardLimit < props.displayedCards 
    let bottomMargin = props.cardLimit < props.infinitives.length ? {} : {paddingBottom: "1em"}

    function checkScroll(e){ // Check carousel scroll and append additional cards

        clearTimeout(detailsScrollTimeout)
        
        const container = e.target
        const cardHeight = container.firstChild.offsetHeight
        const prevScroll = e.target.scrollTop

        if ( loadVerbs ){
            if (e.target.scrollTop + e.target.offsetHeight >= e.target.scrollHeight - cardHeight){
                detailsScrollTimeout = setTimeout(() => {
                    e.target.style.scrollSnapType = "none"
                    props.setCardLimit(current => current + 100)
                    e.target.scroll({top: prevScroll})
                }, 250)
            }
        }
    }

    useEffect(() => { // Scroll to newly focused card
        const container = document.getElementById(styles['verb-carousel__content'])
        const containerHeight = container.offsetHeight
        const cardHeight = container.firstChild.offsetHeight

        let newPos;

        for (let i in container.children){
            if (+container.children[i].id === +props.state.focus){
                newPos = +i + 1
            }  
        }
        
        let target = (newPos * cardHeight) - (containerHeight / 2)

        container.style.scrollSnapType = "y mandatory"
        container.scroll({ top: target, behavior: 'smooth' })
    }, [props.state.focus])

    return(
        <div id = {styles["verb-carousel__content"]}
            onScroll = {e => checkScroll(e)}
            style = {bottomMargin}>
                
            {props.infinitives.map(infinitive =>
                <div
                    className = {styles["verb-card"]}
                    id = {infinitive[1]}
                    key = {`infinitive_${infinitive[1]}`}>
                        <div 
                            className = {styles["verb-card-face"]}
                            id = {props.state.focus === infinitive[1] ? `${styles["verb-card-face__focused"]}` : ""}
                            onClick = {() => {
                                props.postStarred(props.state.starredVerbs)
                                props.dispatch({ type: props.ACTIONS.UPDATE_VERB, payload: { focus: infinitive[1] } })
                            }}>
                            <p className = { styles["rank"] } style = {{ width: `${infinitive[1].toString().length}ch` }}>{ infinitive[1] }</p>
                            <div className = { styles["divider"] } />
                            <p className = { styles["infinitive"] }>{ infinitive[0] }</p>
                            {/* <p>
                                <span style = {{fontWeight: 500}}>{infinitive[1]}</span> • {infinitive[0]}
                            </p> */}
                            {props.state.starredVerbs && props.state.starredVerbs.includes(infinitive[0]) && <div className = {styles["verb-card__right-bar"]} />}
                        </div>
                </div>
            ).slice(0, props.cardLimit)}

            {loadVerbs && <LoadingDots id = {"carousel"} style = {{ marginTop: "1.85em" }} dark = {true} size = {0.75}/>}
            {!props.displayedCards && <p id = {styles["verb-carousel__empty"]}>No Matches</p>}
            {props.starred && props.infinitives.length === 0 && <p id = {styles["verb-carousel__empty"]}>No Saved Verbs</p>}
        </div>
    );
}

export default Carousel;