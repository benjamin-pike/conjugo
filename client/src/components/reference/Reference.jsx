import React, { useState, useEffect, useReducer } from "react";
import { useNav } from "../../store/NavContext";
import { useLang } from "../../store/LangContext";
import useHTTP from "../../hooks/useHTTP";
import getAudio from "../../functions/getAudio.js"
import LoadingDots from "../common/LoadingDots/LoadingDots";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAngleLeft, faChevronCircleDown, faChevronCircleLeft, faCompress, faEarthEurope, faExpand, faEye, faListUl, faMagnifyingGlass, faShapes, faStar as fasFaStar, faVolumeHigh, faXmark } from '@fortawesome/free-solid-svg-icons'
import { faStar as farFaStar } from '@fortawesome/free-regular-svg-icons'

import Conjugations from "./Conjugations.jsx"
import infinitivesAll from "../../assets/js/infinitives-array.js"
import styles from "./styles/reference.module.css"

import Search from "./Search"
import Carousel from "./Carousel"
import Details from "./Details"
import ButtonArrow from "./ButtonArrow"
import ButtonExpand from "./ButtonExpand"

const ACTIONS = {
    UPDATE_VERB: "update-verb",
    UPDATE_CONTENT: "update-content",
    TOGGLE_STAR: "toggle-star"
}

function Reference(){
    const { visible: navVisible, displayNav } = useNav()
    useEffect( () => displayNav( true ), [] )

    const { language } = useLang()
    const [infinitives, setInfinitives] = useState(infinitivesAll[language.name])
    
    const [cardLimit, setCardLimit] = useState(100)
    const [displayedCards, setDisplayedCards] = useState(2000)

    const [searchText, setSearchText] = useState("")
    const [starred, setStarred] = useState(false)

    const [displayLeft, setDisplayLeft] = useState(true)
    const [expanded, setExpanded] = useState(false)

    const [regularityVisible, setRegularityVisible] = useState( false )

    const { sendRequest } = useHTTP()

    const [state, dispatch] = useReducer(reducer, {
        language: language.name, 
        focus: 1, 
        verb: '',
        rank: '',
        regularity: '',
        content: {},
        isStarred: false
    })

    const loadingDotsStyle = {
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)"
    }

    const showStarred = () => setInfinitives(infinitivesAll[language.name].filter(( [verb, rank, reg] ) => state.starredVerbs.includes(verb)))
    const hideStarred = () => setInfinitives(infinitivesAll[language.name])

    let renderContent = Object.values(state.content).length > 0 && state.content.language === language.name

    async function fetchData(verb){
        const verbParam = verb ? verb : infinitivesAll[language.name][state.focus - 1][0]
        const data = await sendRequest({ url: `http://localhost:9000/api/reference/data?language=${language.name}&verb=${verbParam}` })
        dispatch( { type: ACTIONS.UPDATE_CONTENT, payload: { content: data.content, starred: data.starred }} )
    }

    async function postStarred(starredVerbs){
        await sendRequest({
            url: `http://localhost:9000/api/reference/starred?language=${language.name}`,
            method: "POST",
            body: { starred: starredVerbs }
        }) 
    }

    function reducer(state, action){ // Reducer function
        switch(action.type){
            case ACTIONS.UPDATE_VERB:
                let lang = language.name
                let focus = action.payload.focus
                let [verb, rank, regularity] = infinitivesAll[language.name][focus - 1]

                fetchData(verb)

                return {...state, language: lang, focus: focus, verb: verb, rank: rank, regularity: regularity}
            
            case ACTIONS.UPDATE_CONTENT:
                const { content, starred } = action.payload
                const isStarred = starred.includes(state.verb)
                return { ...state, content, isStarred, starredVerbs: starred }

            case ACTIONS.TOGGLE_STAR:
                if ( state.isStarred ){
                    state.starredVerbs = state.starredVerbs.filter(verb => verb !== state.verb)
                } else {
                    state.starredVerbs.push(state.verb)
                }
                return { ...state, isStarred: !state.isStarred}
            
            default:
                return state
        }
    }

    useEffect(() => { // Reset variables upon language change
        dispatch( { type: ACTIONS.UPDATE_VERB, payload: { focus: 1 } } )     
        setInfinitives(infinitivesAll[language.name])
        setSearchText("")
        
    }, [language])

    useEffect(() => { // Reset variables upon change of language or starred state
        setCardLimit(100)
        setDisplayedCards(2000)
    }, [language, starred])

    return(
        <div id = {styles["reference"]}
            style = {{ height: navVisible ? "calc(100vh - 8.5em)" : "100vh" }}>
            
            <div id = {styles["left-content"]} 
                style = {{
                    width: displayLeft ? "20vw" : "0",
                    minWidth: displayLeft ? "15em" : "0",
                    opacity: displayLeft ? "100%" : "0%",
                }}>

                <Search
                    language = {language}
                    searchText = {searchText}
                    setSearchText = {setSearchText}
                    infinitivesAll = {infinitivesAll}
                    setInfinitives = {setInfinitives}
                    setDisplayedCards = {setDisplayedCards}
                    starred = {starred}
                    setStarred = {setStarred}
                    showStarred = {showStarred}
                    hideStarred = {hideStarred}
                />

                <div id = {styles["verb-carousel"]}>
                    <Carousel
                        infinitives = {infinitives}
                        state = {state}
                        ACTIONS = {ACTIONS}
                        dispatch = {dispatch}
                        cardLimit = {cardLimit}
                        setCardLimit = {setCardLimit}
                        displayedCards = {displayedCards}
                        starred = {starred}
                        postStarred = {postStarred}
                    />

                    <ButtonArrow 
                        id = {styles["left-content__collapse"]}
                        direction = "left"
                        onClick = { () => setDisplayLeft(false) }
                    />
                </div>
                
            </div>

            <div id = {styles["right-content"]} style = {{marginLeft: displayLeft ? "1em" : "0"}}>    
                <div id = {styles["detail-bar"]}>
                    {renderContent &&  
                        <Details
                            language = {language}
                            state = {state}
                            dispatch = {dispatch}
                            ACTIONS = {ACTIONS}
                            regularityVisible = { regularityVisible }
                            setRegularityVisible = { setRegularityVisible }
                            renderContent = {renderContent}
                        />
                    }

                    <ButtonExpand 
                        navVisible = {navVisible}
                        displayNav = {displayNav}
                    />
                    
                </div>
                <div id = {styles["conjugations__container"]}>
                    <div id = {styles["conjugations__content"]}>
                        {renderContent ?
                            <Conjugations
                                verb = {state.verb} 
                                conjugations = {state.content.conjugations}
                                language = {language.name}
                                regularityVisible = {regularityVisible}
                            /> : 
                            <LoadingDots
                                id = {"conjugations"} 
                                style = {loadingDotsStyle}
                                dark = {true} 
                                size = {1}
                            />
                        }
                    </div>

                    {!displayLeft && 
                        <ButtonArrow 
                            id = {styles["right-content__collapse"]}
                            direction = "right"
                            onClick = { () => setDisplayLeft(true) }
                        />
                    }
                </div>
            </div>
        </div>
    );
}

export default Reference;