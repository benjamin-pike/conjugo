import { useEffect, useState } from 'react';
import Menu from './Menu';
import Session from './Session'

const Learn = () => {
    const [stage, setStage] = useState('selection')
    const [tense, setTense] = useState('')

    useEffect(() => {
        if (tense) setStage('session')
    }, [tense])

    useEffect(() => {
        if (stage === 'selection') setTense('')
    }, [stage])

    return(
        stage === 'selection'
            ? <Menu setTense = { setTense } />
            : <Session 
                tense = { tense } 
                setStage = { setStage } 
            />
    );
}

export default Learn;