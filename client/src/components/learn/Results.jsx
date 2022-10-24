import { useState, useEffect } from 'react';
import { useNav } from '../../store/NavContext';
import { useLang } from '../../store/LangContext';
import useHTTP from '../../hooks/useHTTP';
import ProgressCircle from '../common/ProgressCircle/ProgressCircle';
import RaisedButton from '../common/RaisedButton/RaisedButton';
import styles from './styles/results.module.css';
import { getLevel } from '../../utils/xp';

const Results = props => {
    const [displayButton, setDisplayButton] = useState(false);
    const [XP, setXP] = useState({ current: 0, new: 0 });

    const { language, forceUpdate: updateLanguageData } = useLang();
    const { sendRequest } = useHTTP();
    const { displayNav } = useNav();
    displayNav(false);

    useEffect(async () => {
        const data = await sendRequest({ 
            url: `/api/learn/results/${language.name}`,
            method: 'POST',
            body: {
                lessonIndex: props.tenseIndex,
                bonus: props.correct.reduce((count, correct) => {
                    if (correct) count++
                    return count
                }, 0) 
            }
        })

        props.setCorrect([])

        if (data){
            localStorage.setItem('lessonProgress', JSON.stringify({
                ...JSON.parse(localStorage.getItem('lessonProgress')),
                [language.name]: {
                    lessonXP: data.lessonXP,
                    lastLesson: data.lastLesson
                }
            }))

            const languageData = JSON.parse(localStorage.getItem('languageData'))

            if (languageData) {
                localStorage.setItem('languageData', JSON.stringify({
                    ...languageData,
                    [language.name]: {
                        ...languageData[language.name],
                        xp: data.totalXP.new + data.totalXP.bonus,
                        level: getLevel(data.totalXP.new + data.totalXP.bonus)
                    }
                }))
            }

            updateLanguageData()
            setXP(data.totalXP)
        }
    }, [])

    useEffect(() => {
        let timeout = setTimeout(() => setDisplayButton(true), 2500)
        return () => clearTimeout(timeout)
    }, [XP])

    return(
        <div id = { styles["results"] }>
            <div 
                id = { styles['backdrop'] }
                style = {{
                    backgroundImage: 'url(./subtle-waves.svg)'
                }}
            />
            <div
                id = { styles['circle__container'] }
                style = {{
                    translate: displayButton ? '0 0.5em' : '0 3em'
                }}
            >
                { XP.new !== 0 && <ProgressCircle 
                    xp = { XP }
                /> }
            </div>
            <div 
                id = { styles['button__container'] }
                style = {{
                    translate: displayButton ? '0 0.5em' : '0 3em',
                    opacity: displayButton ? 1 : 0
                }}
            >
                <RaisedButton 
                    text = 'Continue'
                    onClick = { () => props.setStage('selection') }
                />
            </div>
        </div>
    );
}

export default Results