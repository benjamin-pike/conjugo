import { useState, useEffect } from 'react'
import { useLang } from '../../store/LangContext';
import useHTTP from '../../hooks/useHTTP';
import getAudio from '../../utils/getAudio';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faVolumeHigh, faStar as fasFaStar, faEarthEurope, faListUl, faShapes, faEye, faChevronCircleDown, faChevronCircleLeft, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { faStar as farFaStar } from '@fortawesome/free-regular-svg-icons'

import Tooltip from "./Tooltip";
import Translation from "./Translation";

import styles from "./styles/details.module.css";

function Details(props){
    const [translationsOpen, setTranslationsOpen] = useState(false)
    const { language } = useLang()
    const { sendRequest } = useHTTP()

    const rankColor = props.state.content.rank <= 50 ? 'green' : props.state.content.rank <= 200 ? 'yellow' : props.state.content.rank <= 500 ? 'orange' : props.state.content.rank <= 1000 ? 'red' : 'purple'
    const regularityColor = props.state.content.regularity === 'i' ? 'red' : props.state.content.regularity === 'r' ? 'green' : 'orange'
    const regularityText = props.state.content.regularity === 'i' ? 'Irregular' : props.state.content.regularity === 'r' ? "Regular" : "Stem-Changing"

    const validTranslations = 
        props.state.content.translations.weighted.filter( ( [_, weight] ) => weight > 0.1 ).slice(0, 8)

    const handleStarClick = async () => {
        const updatedSavedVerbs = await sendRequest({ 
            url: `/api/reference/saved/${language.name}/${props.state.verb}`,
            method: props.state.isSaved ? 'DELETE' : 'PUT'
        })

        props.dispatch({
            type: props.ACTIONS.UPDATE_CONTENT,
            payload: { 
                content: props.state.content, 
                savedVerbs: updatedSavedVerbs
            }
        })
    }

    useEffect(() => { // Control scrolling behaviour of detail tooltips 
        const detailsBar = document.getElementById(styles["verb-details"])

        if (detailsBar){
            const details = detailsBar.children
            
            let timer;
            
            function checkDetails(){
                const scroll = detailsBar.scrollLeft
                const em = detailsBar.offsetHeight / 4

                for (let detail of details){
                    if (detail.classList[0].includes(styles["detail"])){
                        for (let child of detail.children){
                            if ((child.classList.length && child.classList[0].includes(styles["tooltip"])) || child.id === styles["verb-details__translation-dropdown"]){
                                if (scroll < child.offsetLeft - em ){
                                    child.style.transform = `translateX(-${scroll}px)`
                                } else {
                                    child.style.transform = `translateX(-${child.offsetLeft - em}px)`
                                }

                                child.style.visibility = 'hidden'
                            }
                        }
                    }
                }

                clearTimeout(timer)
                
                timer = setTimeout(() => {
                    for (let detail of details){
                        if (detail.classList[0].includes(styles["detail"])){
                            for (let child of detail.children){
                                if ((child.classList.length && child.classList[0].includes(styles["tooltip"])) || child.id === styles["verb-details__translation-dropdown"]){
                                    child.style.visibility = 'visible'
                                }
                            }
                        }
                    }
                }, 200)
            }
            
            detailsBar.addEventListener("scroll", e => checkDetails(e))
            new ResizeObserver(e => checkDetails(e)).observe(detailsBar)

            return () => detailsBar.removeEventListener("scroll", checkDetails)
        }
        
    }, [props.state.content])

    useEffect(() => {            
        function checkClick(e){
            if (props.renderContent && document.getElementById(styles["verb-details__translation-dropdown__backdrop"])){
                const dropdown = document.getElementById(styles["verb-details__translation-dropdown__backdrop"]).getBoundingClientRect()
                let close = true

                if (e.target.closest(`#${styles["verb-details__translation-toggle"]}`)){
                    close = false
                }

                if (close && (e.clientX > dropdown.left && e.clientX < dropdown.right) && (e.clientY > dropdown.top && e.clientY < dropdown.bottom)){
                    close = false
                }

                if (close){
                    setTranslationsOpen(false)
                }            
            }
        }

        document.addEventListener('click', checkClick)

        return () => document.removeEventListener('click', checkClick)

    }, [props.renderContent])

    return(
        <div id = {styles["verb-details"]}>
            <div className = {styles["detail"]} id = {styles['verb-details__infinitive']}>
                <img id = {styles["flag"]} src = {language.flag} className = { styles["verb-details__icon"] } />
                <p>{props.state.content.infinitive}</p>

                <button 
                    id = { styles["verb-details__infinitive-audio"] }
                    onClick = { () => getAudio( language.name, props.state.content.infinitive, props.state.content.infinitive, true )}>
                    <FontAwesomeIcon icon = { faVolumeHigh } />
                </button>
                <button
                    id = { styles["verb-details__infinitive-star"]}
                    onClick = { handleStarClick }>
                        <FontAwesomeIcon 
                            icon = {farFaStar} 
                            id = {styles["star__inactive"]} 
                        />
                        <FontAwesomeIcon 
                            icon = {fasFaStar} 
                            id = {styles["star__active"]} 
                            style = {{ opacity: props.state.isSaved ? 1 : 0 }}
                        />
                </button>

                <Tooltip text = {"Infinitive"} color = "textcolor" direction = {"top"} />
            </div>

            <div className = {styles["detail"]} id = {styles['verb-details__translation']}>
                <FontAwesomeIcon icon = { faEarthEurope } className = { styles["verb-details__icon"] } />
                <p>{`to ${props.state.content.translations.principal}`}</p>

                { validTranslations.length > 1 && <button 
                    id = { styles["verb-details__translation-toggle"] }
                    onClick = {(() => setTranslationsOpen(!translationsOpen))}>
                    <FontAwesomeIcon icon = { faListUl } />
                </button> }

                <div 
                    id = {styles["verb-details__translation-dropdown"]}
                    style = {{height: translationsOpen ? `${validTranslations.length * 3}em` : 0}}>
                    
                    <div id = {styles["verb-details__translation-dropdown__backdrop"]} />
                    
                    {
                        validTranslations.length > 1 && validTranslations.map( ( [translation, weight] ) =>
                            <Translation 
                                translation = { translation } 
                                weight = { weight } 
                            /> 
                        )
                    }                    
                </div>

                <Tooltip text = {"Translation"} color = "blue" direction = {"top"} />

            </div>

            <div className = {styles['divider-vertical']} />
            
            <div className = {styles["detail"]} id = {styles['verb-details__rank']}
            style = {{backgroundColor: `var(--${rankColor})`,color: `var(--${rankColor})`}}>
                <div className = {styles["verb-details__icon"]}>
                    <div id = {styles["verb-details__rank-icon"]} style = {{backgroundColor: `var(--${rankColor})`}}/>
                </div>
                <p>{props.state.content.rank}</p>
                <Tooltip text = {"Rank"} color = {rankColor} direction = {"top"} />
            </div>
            
            <div className = {styles["detail"]} id = {styles['verb-details__regularity']}
            style = {{backgroundColor: `var(--${regularityColor})`, color: `var(--${regularityColor})`}}>
                <FontAwesomeIcon icon = { faShapes } className = { styles["verb-details__icon"] }/>
                <p>{regularityText}</p>

                {props.state.content.regularity !== "r" && <button 
                    id = { styles["verb-details__regularity-toggle"] }
                    onClick = { () => props.setRegularityVisible( current => !current ) }>
                    {props.regularityVisible ? 
                        <FontAwesomeIcon icon = { faEyeSlash } id = { styles["regularity-toggle__active"] } />
                        : <FontAwesomeIcon icon = { faEye } id = { styles["regularity-toggle__inactive"] } />
                    }
                </button>}

                <Tooltip text = {"Regularity"} color = {regularityColor} direction = {"top"} />
            </div>
            
            <div className = {styles['divider-vertical']} />

            <div className = {styles["detail"]} id = {styles['verb-details__participle-present']}>
                <FontAwesomeIcon icon = { faChevronCircleDown } className = { styles["verb-details__icon"] }/>
                <p>{`${props.state.content.participles.present}`}</p>
                <Tooltip text = {"Present Participle"} color = "purple" direction = {"top"} />
            </div>

            <div className = {styles["detail"]} id = {styles['verb-details__participle-past']}>
                <FontAwesomeIcon icon = { faChevronCircleLeft } className = { styles["verb-details__icon"] }/>
                <p>{`${props.state.content.participles.past.replace('; ', ' • ')}`}</p>
                <Tooltip text = {"Past Participle"} color = "purple" direction = {"top"} />
            </div>
        </div>
    );
}

export default Details;