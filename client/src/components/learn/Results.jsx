import { useState, useRef, useEffect } from 'react';
import { useNav } from '../../store/NavContext';
import ProgressCircle from '../common/ProgressCircle/ProgressCircle';
import RaisedButton from '../common/RaisedButton/RaisedButton';
import styles from './styles/results.module.css';

const Results = props => {
    const circleRef = useRef(null);
    const [displayButton, setDisplayButton] = useState(false);

    const { displayNav } = useNav();
    displayNav(false);

    useEffect(() => {
        setTimeout(() => setDisplayButton(true), 2500)
    })

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
                <ProgressCircle 
                    xp = {{ current: 10, new: 50 }}
                />
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