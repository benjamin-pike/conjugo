import React from 'react';
import { useNav } from '../../store/NavContext';
import { Link } from 'react-router-dom';

function NavItem(props) {

    const styles = props.styles

    const { current, setCurrent } = useNav()
    const highlight = current === props.text

    return (
        <div className = {`${styles["nav-item"]} ${highlight ? styles["current"] : ""}`} id = {styles[props.text]}>
            <Link to = {props.link}>
                <button onClick = { () => { 
                    setCurrent( props.text )
                    props.setOpen( current => ( { ...current, pages: false } ) )
                }}>
                    <p><strong>{props.text}</strong></p>
                </button>
            </Link>
        </div>
    );
  };

export default NavItem;