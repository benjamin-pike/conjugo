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

// function Tooltip(props){
//     return(
//         <div className = {`${styles["tooltip"]} ${styles[props.direction]}`}>
//             <div className = {styles["tooltip__arrow"]} style = {{borderColor: `transparent transparent var(--${props.color})`}} />
//             <p className = {styles["tooltip__body"]} style = {{backgroundColor: `var(--${props.color}`}}>
//                 {props.text}
//             </p>
//         </div>
//     )
// }

// function Search(props){
//     const { language } = useLang()

//     const buttonFunction = props.searchText ? () => handleSearch() : () => {
//             props.starred ? props.hideStarred() : props.showStarred();
            
//             props.setStarred(state => !state)
            
//             setTimeout(() => {
//                 document.getElementById(styles["verb-carousel__content"]).scrollTop = 0
//             }, 1)
//         }

//     function handleSearch(e = ''){ // Update search results upon search box input
        
//         let content = e ? e.target.value.normalize("NFD").replace(/\p{Diacritic}/gu, "") : ''

//         if (props.starred) props.setStarred(false)

//         props.setInfinitives(() => {
//             const primary = []
//             const secondary = []

//             for (let verb of props.infinitivesAll[language.name]){
//                 let slice = verb[0].slice(0, content.length).normalize("NFD").replace(/\p{Diacritic}/gu, "")
                
//                 if (slice === content){
//                     primary.push(verb)
//                 } else if (slice.includes(content)) {
//                     secondary.push(verb)
//                 }
//             }

//             props.setDisplayedCards(primary.concat(secondary).length)

//             return primary.concat(secondary)
//         })

//         props.setSearchText(content)

//         setTimeout(() => {
//             document.getElementById(styles["verb-carousel__content"]).scrollTop = 0
//         }, 1)
//     }

//     return(
//         <div id = {styles["verb-search"]}>
//             <FontAwesomeIcon icon = { faMagnifyingGlass } />
//             <input
//                 id = {styles["verb-search__input"]}
//                 onChange = {handleSearch}
//                 type = "text" 
//                 placeholder = "Search . . ." 
//                 autoComplete = "off"
//                 spellCheck = "false"
//                 value = {props.searchText}
//             />
//             <button onClick = {buttonFunction}>
//                 {props.searchText ? <FontAwesomeIcon icon = { faXmark } />
//                     : <div id = {styles["verb-search__star"]}>
//                         <FontAwesomeIcon 
//                             icon = {farFaStar}
//                         />
//                         <FontAwesomeIcon 
//                             icon = {fasFaStar} 
//                             style = {{ opacity: props.starred ? 1 : 0 }}
//                         />
//                     </div>
//                 }
//             </button>
//         </div>
//     )
// }

// function Carousel(props){
//     let detailsScrollTimeout;
//     let loadVerbs = props.infinitives.length > 100 && props.cardLimit < props.displayedCards 
//     let bottomMargin = props.cardLimit < props.infinitives.length ? {} : {paddingBottom: "1em"}

//     const loadingDotsStyle = {
//         marginTop: "1.85em"
//     }

//     function checkScroll(e){ // Check carousel scroll and append additional cards

//         clearTimeout(detailsScrollTimeout)
        
//         const container = e.target
//         const cardHeight = container.firstChild.offsetHeight
//         const prevScroll = e.target.scrollTop

//         if ( loadVerbs ){
//             if (e.target.scrollTop + e.target.offsetHeight >= e.target.scrollHeight - cardHeight){
//                 detailsScrollTimeout = setTimeout(() => {
//                     e.target.style.scrollSnapType = "none"
//                     props.setCardLimit(current => current + 100)
//                     e.target.scroll({top: prevScroll})
//                 }, 250)
//             }
//         }
//     }

//     useEffect(() => { // Scroll to newly focused card
//         const container = document.getElementById(styles['verb-carousel__content'])
//         const containerHeight = container.offsetHeight
//         const cardHeight = container.firstChild.offsetHeight

//         let newPos;

//         for (let i in container.children){
//             if (+container.children[i].id === +props.state.focus){
//                 newPos = +i + 1
//             }  
//         }
        
//         let target = (newPos * cardHeight) - (containerHeight / 2)

//         container.style.scrollSnapType = "y mandatory"
//         container.scroll({ top: target, behavior: 'smooth' })
//     }, [props.state.focus])

//     return(
//         <div id = {styles["verb-carousel__content"]}
//             onScroll = {e => checkScroll(e)}
//             style = {bottomMargin}>
                
//             {props.infinitives.map(infinitive =>
//                 <div
//                     className = {styles["verb-card"]}
//                     id = {infinitive[1]}
//                     key = {`infinitive_${infinitive[1]}`}>
//                         <div 
//                             className = {styles["verb-card-face"]}
//                             id = {props.state.focus === infinitive[1] ? `${styles["verb-card-face__focused"]}` : ""}
//                             onClick = {() => {
//                                 props.postStarred(props.state.starredVerbs)
//                                 props.dispatch({ type: props.ACTIONS.UPDATE_VERB, payload: { focus: infinitive[1] } })
//                             }}>
                            
//                             <p>
//                                 <span style = {{fontWeight: 500}}>{infinitive[1]}</span> • {infinitive[0]}
//                             </p>
//                             {props.state.starredVerbs && props.state.starredVerbs.includes(infinitive[0]) && <div className = {styles["verb-card__right-bar"]} />}
//                         </div>
//                 </div>
//             ).slice(0, props.cardLimit)}

//             {loadVerbs && <LoadingDots id = {"carousel"} style = {loadingDotsStyle} dark = {true} size = {0.75}/>}
//             {!props.displayedCards && <p id = {styles["verb-carousel__empty"]}>No Matches</p>}
//             {props.starred && props.infinitives.length === 0 && <p id = {styles["verb-carousel__empty"]}>No Saved Verbs</p>}
//         </div>
//     );
// }

// function Translation(props){

//     const frequency = props.weight > 0.7 ? 3 : props.weight > 0.4 ? 2 : 1
//     const frequencyText = frequency > 2 ? "Very Common" : frequency > 1 ? "Common" : "Uncommon" 

//     return(
//         <div className = {styles["translation"]}>
//             <p className = {styles["eng"]}>
//                 <span style = {{fontWeight: 500, opacity: "40%"}}>to </span>
//                 {props.translation}
//             </p>

//             <div className = {styles["translation-bars"]}>
//                 <div className = {styles["translation-bars__1"]} />
//                 <div className = {styles["translation-bars__2"]} style = {{opacity: frequency > 1 ? "100%" : "25%"}} />
//                 <div className = {styles["translation-bars__3"]} style = {{opacity: frequency > 2 ? "100%" : "25%"}} />
//             </div>
        
//             <Tooltip text = { frequencyText } color = {"var(--blue)"} direction = {"left"} />
//         </div>
//     )
// }

// function Details(props){
//     const [translationsOpen, setTranslationsOpen] = useState(false)
//     const { language } = useLang()

//     const rankColor = props.state.content.rank <= 50 ? 'green' : props.state.content.rank <= 200 ? 'yellow' : props.state.content.rank <= 500 ? 'orange' : props.state.content.rank <= 1000 ? 'red' : 'purple'
//     const regularityColor = props.state.content.regularity === 'i' ? 'red' : props.state.content.regularity === 'r' ? 'green' : 'orange'
//     const regularityText = props.state.content.regularity === 'i' ? 'Irregular' : props.state.content.regularity === 'r' ? "Regular" : "Stem-Changing"

//     const validTranslations = 
//         props.state.content.translations.weighted.filter( ( [_, weight] ) => weight > 0.1 ).slice(0, 8)

//     useEffect(() => { // Control scrolling behaviour of detail tooltips 
//         const detailsBar = document.getElementById(styles["verb-details"])

//         if (detailsBar){
//             const details = detailsBar.children
            
//             let timer;
            
//             function checkDetails(){
//                 const scroll = detailsBar.scrollLeft
//                 const em = detailsBar.offsetHeight / 4

//                 for (let detail of details){
//                     if (detail.classList[0].includes(styles["detail"])){
//                         for (let child of detail.children){
//                             if ((child.classList.length && child.classList[0].includes(styles["tooltip"])) || child.id === styles["verb-details__translation-dropdown"]){
//                                 if (scroll < child.offsetLeft - em ){
//                                     child.style.transform = `translateX(-${scroll}px)`
//                                 } else {
//                                     child.style.transform = `translateX(-${child.offsetLeft - em}px)`
//                                 }

//                                 child.style.visibility = 'hidden'
//                             }
//                         }
//                     }
//                 }

//                 clearTimeout(timer)
                
//                 timer = setTimeout(() => {
//                     for (let detail of details){
//                         if (detail.classList[0].includes(styles["detail"])){
//                             for (let child of detail.children){
//                                 if ((child.classList.length && child.classList[0].includes(styles["tooltip"])) || child.id === styles["verb-details__translation-dropdown"]){
//                                     child.style.visibility = 'visible'
//                                 }
//                             }
//                         }
//                     }
//                 }, 200)
//             }
            
//             detailsBar.addEventListener("scroll", e => checkDetails(e))
//             new ResizeObserver(e => checkDetails(e)).observe(detailsBar)

//             return () => detailsBar.removeEventListener("scroll", checkDetails)
//         }
        
//     }, [props.state.content])


//     useEffect(() => {            
//         function checkClick(e){
//             if (props.renderContent && document.getElementById(styles["verb-details__translation-dropdown__backdrop"])){
//                 const dropdown = document.getElementById(styles["verb-details__translation-dropdown__backdrop"]).getBoundingClientRect()
//                 let close = true

//                 if (e.target.closest(`#${styles["verb-details__translation-toggle"]}`)){
//                     close = false
//                 }

//                 if (close && (e.clientX > dropdown.left && e.clientX < dropdown.right) && (e.clientY > dropdown.top && e.clientY < dropdown.bottom)){
//                     close = false
//                 }

//                 if (close){
//                     setTranslationsOpen(false)
//                 }            
//             }
//         }

//         document.addEventListener('click', checkClick)

//         return () => document.removeEventListener('click', checkClick)

//     }, [props.renderContent])

//     return(
//         <div id = {styles["verb-details"]}>
//             <div className = {styles["detail"]} id = {styles['verb-details__infinitive']}>
//                 <img id = {styles["flag"]} src = {language.flag} className = { styles["verb-details__icon"] } />
//                 <p>{props.state.content.infinitive}</p>

//                 <button 
//                     id = { styles["verb-details__infinitive-audio"] }
//                     onClick = { () => getAudio( language.name, props.state.content.infinitive, props.state.content.infinitive, true )}>
//                     <FontAwesomeIcon icon = { faVolumeHigh } />
//                 </button>
//                 <button
//                     id = { styles["verb-details__infinitive-star"]}
//                     onClick = { () => props.dispatch({ type: props.ACTIONS.TOGGLE_STAR }) }>
//                         <FontAwesomeIcon 
//                             icon = {farFaStar} 
//                             id = {styles["star__inactive"]} 
//                         />
//                         <FontAwesomeIcon 
//                             icon = {fasFaStar} 
//                             id = {styles["star__active"]} 
//                             style = {{ opacity: props.state.isStarred ? 1 : 0 }}
//                         />
//                 </button>

//                 <Tooltip text = {"Infinitive"} color = "textcolor" direction = {"top"} />
//             </div>

//             <div className = {styles["detail"]} id = {styles['verb-details__translation']}>
//                 <FontAwesomeIcon icon = { faEarthEurope } className = { styles["verb-details__icon"] } />
//                 <p>{`to ${props.state.content.translations.principal}`}</p>

//                 { validTranslations.length > 1 && <button 
//                     id = { styles["verb-details__translation-toggle"] }
//                     onClick = {(() => setTranslationsOpen(!translationsOpen))}>
//                     <FontAwesomeIcon icon = { faListUl } />
//                 </button> }

//                 <div 
//                     id = {styles["verb-details__translation-dropdown"]}
//                     style = {{height: translationsOpen ? `${validTranslations.length * 3}em` : 0}}>
                    
//                     <div id = {styles["verb-details__translation-dropdown__backdrop"]} />
                    
//                     {
//                         validTranslations.length > 1 && validTranslations.map( ( [translation, weight] ) =>
//                             <Translation 
//                                 translation = { translation } 
//                                 weight = { weight } 
//                             /> 
//                         )
//                     }                    
//                     {/* <Translation translation = "eat" frequency = {3} />
//                     <Translation translation = "consume" frequency = {2} />
//                     <Translation translation = "feed" frequency = {2} />
//                     <Translation translation = "imbibe" frequency = {1} />
//                     <Translation translation = "scoff" frequency = {1} /> */}
//                 </div>

//                 <Tooltip text = {"Translation"} color = "blue" direction = {"top"} />

//             </div>

//             <div className = {styles['divider-vertical']} />
            
//             <div className = {styles["detail"]} id = {styles['verb-details__rank']}
//             style = {{backgroundColor: `var(--${rankColor})`,color: `var(--${rankColor})`}}>
//                 <div className = {styles["verb-details__icon"]}>
//                     <div id = {styles["verb-details__rank-icon"]} style = {{backgroundColor: `var(--${rankColor})`}}/>
//                 </div>
//                 <p>{props.state.content.rank}</p>
//                 <Tooltip text = {"Rank"} color = {rankColor} direction = {"top"} />
//             </div>
            
//             <div className = {styles["detail"]} id = {styles['verb-details__regularity']}
//             style = {{backgroundColor: `var(--${regularityColor})`, color: `var(--${regularityColor})`}}>
//                 <FontAwesomeIcon icon = { faShapes } className = { styles["verb-details__icon"] }/>
//                 <p>{regularityText}</p>

//                 {props.state.content.regularity !== "r" && <button 
//                     id = { styles["verb-details__regularity-toggle"] }>
//                     <FontAwesomeIcon icon = { faEye } />
//                 </button>}

//                 <Tooltip text = {"Regularity"} color = {regularityColor} direction = {"top"} />
//             </div>
            
//             <div className = {styles['divider-vertical']} />

//             <div className = {styles["detail"]} id = {styles['verb-details__participle-present']}>
//                 <FontAwesomeIcon icon = { faChevronCircleDown } className = { styles["verb-details__icon"] }/>
//                 <p>{`${props.state.content.conjugations.participle.present}`}</p>
//                 <Tooltip text = {"Present Participle"} color = "purple" direction = {"top"} />
//             </div>

//             <div className = {styles["detail"]} id = {styles['verb-details__participle-past']}>
//                 <FontAwesomeIcon icon = { faChevronCircleLeft } className = { styles["verb-details__icon"] }/>
//                 <p>{`${props.state.content.conjugations.participle.past.replace('; ', ' • ')}`}</p>
//                 <Tooltip text = {"Past Participle"} color = "purple" direction = {"top"} />
//             </div>
//         </div>
//     );
// }

// function ButtonArrow(props){
//     return(
//         <div id = { props.id } 
//             className = {`${styles["arrow-button"]} ${styles[props.direction]}`}
//             onClick = { props.onClick }>
            
//             <FontAwesomeIcon icon = {faAngleLeft} />
//         </div>
//     );
// }

// function ButtonExpand(props){
//     return(
//         <div id = {styles["conjugations__expand"]}>
//             <button id = {styles["conjugations__expand-button"]} onClick = {() => props.displayNav(!props.navVisible)}>
//                 <FontAwesomeIcon icon= { props.navVisible ? faExpand : faCompress } />
//             </button>
//         </div>
//     );
// }

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


    useEffect(() => { // Prevent transitions during window resize
        const classes = document.body.classList;
        let timer;

        function disableTransitions(){
            if (timer) {
                clearTimeout(timer);
                timer = null;               
            
            } else {
                classes.add('disable-transitions');

                timer = setTimeout(() => {
                    classes.remove('disable-transitions');
                    timer = null;
                }, 100)
            }
        }

        window.addEventListener('resize', disableTransitions)

        return () => window.removeEventListener('resize', disableTransitions)
    }, [])

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