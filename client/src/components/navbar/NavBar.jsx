import React, { useState, useEffect } from 'react';
import { useAuth } from '../../store/AuthContext';
import { useNav } from '../../store/NavContext';
import { v4 as uuidv4 } from 'uuid';
import NavBrand from './NavBrand';
import NavItem from './NavItem';
import NavLanguageSelector from './NavLanguageSelector';
import NavAvatar from './NavAvatar';
import items from './nav_items'
import styles from "./nav-bar.module.css";

function NavBar(props) {

    const { auth } = useAuth()
    const { visible, current } = useNav()
    const [open, setOpen] = useState( { language: false, avatar: false } );
    const [highlight, setHighlight] = useState()

    document.onclick = (e) => {

        for (let element of e.path.slice(0, -5)){

            let attributes = element.outerHTML.split(">")[0]

            if (attributes.includes("dropdown-item")) return setHighlight(true)
                        
            if (highlight) setHighlight(false)

            if (attributes.includes("nav-language-selector") || attributes.includes("nav-avatar")) return
        }

        if ( Object.values(open).includes(true)) setOpen( { language: false, avatar: false } )
    }

    useEffect(() => {
        const highlight = document.getElementById(styles["nav-item__highlight"])
        const current = document.querySelector(`.${styles["current"]}`)

        function adjustHighlight(){
            const itemWidth = current.offsetWidth
            const itemLeft = current.offsetLeft

            highlight.style.width = `calc(${itemWidth}px + 1.8em)`
            highlight.style.left = `calc(${itemLeft}px - 0.9em)`
        }
        
        if ( current && highlight ) adjustHighlight()
        
        visible && window.addEventListener("resize", adjustHighlight)

        return () => {visible && window.removeEventListener("resize", adjustHighlight)}

    }, [visible, current])

    const highlightColor = {about: "red", learn: "orange", practice: "yellow", reference: "green"}

    if ( visible ) return (
        <div className = {styles["navbar"]}>
            <nav>
                <NavBrand />

                <div id = {styles["nav-items"]}>
                    <div 
                        id = {styles["nav-item__highlight"]} 
                        style = {{
                            transition: document.getElementById(styles["nav-item__highlight"]) ? 
                            "left 200ms ease, width 200ms ease, background-color 200ms ease" 
                            :
                            "background-color 200ms ease",
                            backgroundColor: `var(--${highlightColor[current]})`
                        }}
                    />
                    {items.map(item => 
                        <NavItem
                            styles = {styles}
                            key = {uuidv4()} 
                            text = {item.text}
                            icon = {item.icon}
                            link = {item.link}
                        />
                    )}
                </div>

                <div id = {styles["profile-specific"]}>
                    <NavLanguageSelector
                        open = {open}
                        setOpen = {setOpen}
                        language = {props.language}
                        setLanguage = {props.setLanguage} 
                        highlight = {highlight}
                    />
                    <NavAvatar 
                        open = {open}
                        setOpen = {setOpen}
                        img = {auth.userData.image}
                    />
                </div>
            </nav>
        </div>
    );

    return <></>
  };

export default NavBar;