import { useEffect, useState } from 'react';
import Menu from './Menu';
import Results from './Results';
import Session from './Session'

const Learn = () => {
    const [stage, setStage] = useState('selection')
    const [tense, setTense] = useState({ root: '', index: 0 })
    const [correct, setCorrect] = useState([])

    console.log(correct)

    useEffect(() => {
        if (tense.root !== '') setStage('session')
    }, [tense])

    useEffect(() => {
        if (stage === 'selection') setTense({ root: '', index: 0 })
    }, [stage])

    return(
        stage === 'selection'
            ? <Menu setTense = { setTense } />
        : stage === 'session' 
            ? <Session 
                tense = { tense } 
                setStage = { setStage }
                setCorrect = { setCorrect }
            />
            : <Results
                correct = { correct }
                setCorrect = { setCorrect }
                tenseIndex = { tense.index }
                setStage = { setStage }
            />
    );
}

export default Learn;