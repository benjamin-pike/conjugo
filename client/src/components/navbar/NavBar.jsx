import React, { useState, useRef } from 'react';
import { useAuth } from '../../store/AuthContext';
import { useNav } from '../../store/NavContext';
import { v4 as uuidv4 } from 'uuid';
import Brand from './Brand';
import PageLink from './PageLink';
import LanguageSelector from './LanguageSelector';
import Avatar from './Avatar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styles from "./styles/navbar.module.css";
import { faBars } from '@fortawesome/free-solid-svg-icons';

function NavBar(props) {

    const { auth } = useAuth()
    const { visible, current } = useNav()
    const [open, setOpen] = useState( { language: false, avatar: false, pages: false } );
    const [highlight, setHighlight] = useState()
    const hamburgerRef = useRef()

    const pages = [
        { text: 'about', icon: './circle.svg', link: '#' },
        { text: 'learn', icon: './circle.svg', link: '/learn' },
        { text: 'practice', icon: './circle.svg', link: '/practice' },
        { text: 'reference', icon: './circle.svg', link: '/reference' },
    ]

    document.onclick = (e) => {

        for (let element of e.path.slice(0, -5)){

            let attributes = element.outerHTML.split(">")[0]

            if (attributes.includes("dropdown-item")) return setHighlight(true)
                        
            if (highlight) setHighlight(false)

            if (attributes.includes("nav-language-selector") || attributes.includes("nav-avatar") || attributes.includes("nav-items")) return
        }

        if ( Object.values(open).includes(true)) setOpen( { language: false, avatar: false, pages: false } )
    }

    window.onresize = () => {
        if ( getComputedStyle( hamburgerRef.current ).visibility === "hidden" ){
            if ( open.pages) setOpen( current => ({ ...current, pages: false })  )

            
        }
    }

    if ( visible ) return (
        <div className = {styles["navbar"]}>
            <nav>
                <Brand />

                <div id = {styles["nav-items"]}>
                    <div 
                        id = {styles["nav-items__container"]} 
                        style = { open.pages ? {
                            height: "13em",
                            boxShadow: '0 0 0.5em 0.25em var(--selected)',
                            padding: "0.2em 0",
                        } : {}}>
                        
                        { pages.map( item => 
                            <PageLink
                                styles = {styles}
                                key = {uuidv4()} 
                                text = {item.text}
                                icon = {item.icon}
                                link = {item.link}
                                setOpen = {setOpen}
                            />
                        ) }
                    </div>
                    <div    
                        id = {styles["hamburger"]}
                        ref = { hamburgerRef }
                        onClick = {() => {
                            if ( open.language || open.avatar ){
                                setOpen( { language: false, avatar: false, pages: false } )
                                setTimeout(() => setOpen( { language: false, avatar: false, pages: true } ) , 200)
                            } else {
                                setOpen( { open, pages: !open.pages } )
                            }
                        }}>
                        
                        <FontAwesomeIcon icon = { faBars }/>
                    </div>
                </div>

                <div id = {styles["profile-specific"]}>
                    <LanguageSelector
                        open = {open}
                        setOpen = {setOpen}
                        language = {props.language}
                        setLanguage = {props.setLanguage} 
                        highlight = {highlight}
                    />
                    <Avatar 
                        open = {open}
                        setOpen = {setOpen}
                        img = {auth.user.image}
                    />
                </div>
            </nav>
        </div>
    );

    return <></>
  };

export default NavBar;