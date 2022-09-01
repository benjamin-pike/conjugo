import React, { useEffect } from 'react';
import useHTTP from '../../hooks/useHTTP.js';
import { useAuth } from "../../store/AuthContext.js"
import { useLang } from "../../store/LangContext.js"
import { v4 as uuidv4 } from 'uuid';
import styles from './styles/language-selector.module.css'

function NavLanguageSelector(props) {

    const { language } = useLang()

    return (
        <div id = {styles["nav-language-selector"]} onClick = {() => {
            if ( props.open.avatar || props.open.pages ){
                props.setOpen( { language: false, avatar: false, pages: false } )
                setTimeout(() => props.setOpen( { language: true, avatar: false, pages: false } ) , 200)
            } else {
                props.setOpen( { ...props.open, language: !props.open.language})
            }
        }}>

            <div id = {styles["nav-language-selector-toggle"]}>
                <img src = { language.flag } draggable = 'false' />
                <div className = {styles["level"]}><p>{ language.level }</p></div>
            </div>

            <Dropdown 
                open = { props.open.language }
                setLanguage = { props.setLanguage }
                highlight = {props.highlight}
            />

        </div>
    );
};

function Dropdown(props){

    const { auth } = useAuth()
    const { language, allLanguages } = useLang()
    const { sendRequest } = useHTTP()
    const languages = Object.values(allLanguages).sort((a, b) => b.level - a.level)

    const openStyle = {
        height: `${3.25 * languages.length}em`, 
        boxShadow: '0 0 0.5em 0.25em var(--selected)',
        padding: "0.275em 0",
        pointerEvents: "auto"
    }

    useEffect(() => {
        if (language.name === ""){
            sendRequest({
                url: "http://localhost:9000/api/language/current",
                method: "POST",
                body: { id: auth.id }
            })
        }
    }, [])

    return (
        <div id = {styles['language-selector-dropdown']} style = {props.open ? openStyle : null}>
            {languages.map(language => 
            <DropdownItem
                key = {uuidv4()} 
                flag = {language.flag}
                language = {language.name}
                level = {language.level}
                open = {props.open}
                highlight = {props.highlight}
            />)}
        </div>
    );
};

function DropdownItem(props) {

    const { auth } = useAuth()
    const { language, changeLanguage } = useLang()

    const formattedName = props.language[0].toUpperCase() + props.language.slice(1)
    const fixedHighlight = !props.open && props.highlight && language.name === props.language
    
    return (
        <div 
            className = {`${styles["dropdown-item"]} ${fixedHighlight ? styles["dropdown-item__fixed"] : ""}`} 
            onClick = {() => changeLanguage(props.language, auth.id)}>

            <img src = {props.flag} alt = {`${props.language}_flag`} />
            
            <p>{ formattedName }</p>
        </div>
    );
};

export default NavLanguageSelector;