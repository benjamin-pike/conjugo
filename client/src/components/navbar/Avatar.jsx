import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowRightFromBracket, faGear, faQuestion } from '@fortawesome/free-solid-svg-icons'
import { useAuth } from '../../store/AuthContext';
import { v4 as uuidv4 } from 'uuid';
import styles from "./styles/avatar.module.css"

function NavAvatar(props) {

    return (
        <div id = {styles["nav-avatar"]} onClick = {() => {
            if ( props.open.language || props.open.pages ){
                props.setOpen( { language: false, avatar: false, pages: false } )
                setTimeout(() => props.setOpen( { language: false, avatar: true, pages: false } ) , 200)
            } else {
                props.setOpen( { ...props.open, avatar: !props.open.avatar } )
            }
        }}>

          <img src = {`http://localhost:7000/images/profile_defaults/${props.img}`} draggable = 'false' />

          <Dropdown open = {props.open.avatar} img = {props.img}/>
        </div>
    );
};

function Dropdown(props){

    const { auth: { user: {fname} } } = useAuth()

    const dropdownItems = [
        { key: uuidv4(), text: 'Settings', icon: faGear, function: 'settings' },
        { key: uuidv4(), text: 'Help', icon: faQuestion, function: 'help' },
        { key: uuidv4(), text: 'Log Out', icon: faArrowRightFromBracket, function: 'log_out' },
    ]

    const openStyle = {
        height: `${4.5 + 3.25 * dropdownItems.length}em`, 
        boxShadow: '0 0 0.5em 0.25em var(--selected)',
        padding: "0 0 0.2em 0.1em",
        pointerEvents: "auto"
        }

    return (
        <div id = {styles["avatar-dropdown"]} style = {props.open ? openStyle : null}>
            <div id = {styles["avatar-dropdown__profile"]}>
                <img 
                    src = {`http://localhost:7000/images/profile_defaults/${props.img}`} 
                    id =  {styles["avatar-dropdown__profile-image"]}
                />
                <div id = {styles["avatar-dropdown__profile-text"]}>
                    <p id = {styles["avatar-dropdown__profile-name"]}>
                        {fname}
                    </p>
                    <p id = {styles["avatar-dropdown__profile-view"]}>
                        View your profile
                    </p>
                </div>
            </div>
                {dropdownItems.map(item => 
                    <DropdownItem
                        key = {uuidv4()} 
                        icon = {item.icon}
                        text = {item.text}
                        function = {item.function}
                    />
                )}
        </div>
    );
};

function DropdownItem(props) {

    const { logout } = useAuth() 
        
    return (
        <div className = {styles["dropdown-item"]} 
            onClick = {() => {
                props.function === "log_out" && logout()
            }}>
            <FontAwesomeIcon icon = {props.icon} />
            <p>{props.text}</p>
        </div>
    );
};

export default NavAvatar;