import React, { useState, useContext, useEffect } from 'react';
import useHTTP from '../hooks/useHTTP';

import spanishFlag from "../assets/images/spanish.svg"
import frenchFlag from "../assets/images/french.svg"
import germanFlag from "../assets/images/german.svg"
import italianFlag from "../assets/images/italian.svg"
import portugueseFlag from "../assets/images/portuguese.svg"

const LangContext = React.createContext();

export function useLang(){
    return useContext(LangContext)
}

export function LangProvider( { children } ){

    const { sendRequest } = useHTTP()

    const [languageData, setLanguageData] = useState({
        current: "spanish",
        languages: {
            spanish: {
                name: "spanish",
                flag: "/static/spanish.svg",
                level: 0,
                xp: 0
            }
        }
    })

    const flags = {
        spanish: spanishFlag, 
        french: frenchFlag, 
        german: germanFlag, 
        italian: italianFlag, 
        portuguese: portugueseFlag
    }

    const localData = localStorage.getItem("language")

    useEffect(async () => {
        let data;

        if ( localData ){
            data = JSON.parse( localData )
        } else {
            data = await sendRequest({ url: "/api/language/user-data" })
        }

        if (data){
            for (let language in data.languages) 
                data.languages[language].flag = flags[language]

            localStorage.setItem("language", JSON.stringify(data))
            setLanguageData( data )
        }
    }, [])

    const changeLanguage = language => {
        localStorage.setItem("currentLanguage", language)
        setLanguageData({...languageData, current: language})
    }

    const value = {
        language: languageData.languages[languageData.current],
        allLanguages: languageData.languages,
        changeLanguage
    }

    return(
        <LangContext.Provider value = { value }>
            { children }
        </LangContext.Provider>
    );
}