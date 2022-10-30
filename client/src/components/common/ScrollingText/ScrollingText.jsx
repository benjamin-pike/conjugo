import { useLang } from "../../../store/LangContext";
import corpus from "./corpus";
import styles from "./scrolling-text.module.css";

const ScrollingText = () => {
    const { language } = useLang()

    const colors = [
        'red',
        'orange',
        'yellow',
        'green',
        'aqua',
        'blue',
        'purple',
        'pink',
    ]
    
    return <div id = {styles['scrolling-text']}>
        <div id = {styles['scrolling-text--container']}>
        {
            corpus[language.name].map((text, rowIndex) => 
                <div className = {styles['row']}>
                    <div className = {styles['word-container']}>
                        { text.slice(0, 15).map((word, wordIndex) => 
                            <span 
                                className = {styles['word']}
                                color = {colors[wordIndex % colors.length]}
                                style = {{fontSize: `${ 1 + (rowIndex % 10) / 15 }em`}}
                            >
                                {word + ' '}
                            </span>) 
                        }
                    </div>
                        <div className = {styles['word-container']}>
                            { text.slice(0, 15).map((word, wordIndex) => 
                                <span 
                                    className = {styles['word']}
                                    color = {colors[wordIndex % colors.length]}
                                    style = {{fontSize: `${ 1 + (rowIndex % 10) / 15 }em`}}
                                >                                        
                                    {word + ' '}
                                </span>) 
                                }
                        </div>
                </div>
            )
        }
        </div>
    </div>
}

export default ScrollingText;