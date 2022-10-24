import React, { useState, useContext, useEffect } from 'react';
import useHTTP from '../hooks/useHTTP';
import { getLevel } from '../utils/xp';

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

    const localData = localStorage.getItem("languageData")

    useEffect(async () => {
        let data;

        if ( localData ){
            data = JSON.parse( localData )
        } else {
            data = await sendRequest({ url: "/api/user/languages" })
        }

        data = await sendRequest({ url: "/api/user/languages" })

        if (data){
            Object.keys(data.languages).forEach(language => {
                data.languages[language].name = language
                data.languages[language].level = getLevel(data.languages[language].xp)
                data.languages[language].flag = flags[language]

                if (!data.current || data.languages[data.current].xp < data.languages[language].xp)
                    data['current'] = language
            })
            
            localStorage.setItem("languageData", JSON.stringify(data))
            setLanguageData( data )
        }
    }, [])

    const changeLanguage = language => {
        const data = JSON.parse(localStorage.getItem('languageData'))

        data.current = language

        localStorage.setItem("languageData", JSON.stringify(data))
        setLanguageData(data)
    }

    const value = {
        language: languageData.languages[languageData.current],
        allLanguages: languageData.languages,
        forceUpdate: () => setLanguageData(state => ({...state})),
        changeLanguage
    }

    return(
        <LangContext.Provider value = { value }>
            { children }
        </LangContext.Provider>
    );
}