import { useLang } from "../../store/LangContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass, faXmark, faStar as fasFaStar } from "@fortawesome/free-solid-svg-icons";
import { faStar as farFaStar } from '@fortawesome/free-regular-svg-icons'


import styles from "./styles/search.module.css"

function Search(props){
    const { language } = useLang()

    const buttonFunction = props.searchText ? () => handleSearch() : () => {
            props.starred ? props.hideStarred() : props.showStarred();
            
            props.setStarred(state => !state)
            
            setTimeout(() => {
                document.getElementById(styles["verb-carousel__content"]).scrollTop = 0
            }, 1)
        }

    function handleSearch(e = ''){ // Update search results upon search box input
        
        let content = e ? e.target.value.normalize("NFD").replace(/\p{Diacritic}/gu, "") : ''

        if (props.starred) props.setStarred(false)

        props.setInfinitives(() => {
            const primary = []
            const secondary = []

            for (let verb of props.infinitivesAll[language.name]){
                let slice = verb[0].slice(0, content.length).normalize("NFD").replace(/\p{Diacritic}/gu, "")
                
                if (slice === content){
                    primary.push(verb)
                } else if (slice.includes(content)) {
                    secondary.push(verb)
                }
            }

            props.setDisplayedCards(primary.concat(secondary).length)

            return primary.concat(secondary)
        })

        props.setSearchText(content)

        setTimeout(() => {
            document.getElementById(styles["verb-carousel__content"]).scrollTop = 0
        }, 1)
    }

    return(
        <div id = {styles["verb-search"]}>
            <FontAwesomeIcon icon = { faMagnifyingGlass } />
            <input
                id = {styles["verb-search__input"]}
                onChange = {handleSearch}
                type = "text" 
                placeholder = "Search . . ." 
                autoComplete = "off"
                spellCheck = "false"
                value = {props.searchText}
            />
            <button onClick = {buttonFunction}>
                {props.searchText ? <FontAwesomeIcon icon = { faXmark } />
                    : <div id = {styles["verb-search__star"]}>
                        <FontAwesomeIcon 
                            icon = {farFaStar}
                        />
                        <FontAwesomeIcon 
                            icon = {fasFaStar} 
                            style = {{ opacity: props.starred ? 1 : 0 }}
                        />
                    </div>
                }
            </button>
        </div>
    )
}

export default Search;