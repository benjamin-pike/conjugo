import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../store/AuthContext';
import { v4 as uuidv4 } from 'uuid';
import dropdownItems from './account_dropdown_items';
import styles from "./nav-avatar.module.css"

function DropdownItem(props) {

    const navigate = useNavigate()
    const { logout } = useAuth() 
        
    return (
        <div className = {styles["dropdown-item"]} 
            onClick = {() => {
                props.onClick()
                props.function === "log_out" && logout()
            }}>
            <FontAwesomeIcon icon = {props.icon} />
            <p>{props.text}</p>
        </div>
    );
};

function Dropdown(props){

    const { auth: { userData: {fname} } } = useAuth() 

  const openStyle = {
      height: `${4.5 + 3.25 * dropdownItems.length}em`, 
      boxShadow: '0 0 0.5em 0.25em var(--selected)',
      padding: "0 0 0.2em 0.1em",
      pointerEvents: "auto"
    }

  return (
      <div id = {styles["avatar-dropdown"]} style = {props.open ? openStyle : null}>
          <div id = {styles["avatar-dropdown__profile"]}>
            <img src = {props.img} id =  {styles["avatar-dropdown__profile-image"]} />
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
                    onClick = {item.onClick}
                />
            )}
      </div>
  );
};

function NavAvatar(props) {

    return (
        <div id = {styles["nav-avatar"]} onClick = {() => {
            if (props.open.language){
                props.setOpen( { language: false, avatar: false } )
                setTimeout(() => props.setOpen( { language: false, avatar: true } ) , 200)
            } else {
                props.setOpen( { ...props.open, avatar: !props.open.avatar } )
            }
        }}>

          <img src = {props.img} draggable = 'false' />

          <Dropdown open = {props.open.avatar} img = {props.img}/>
        </div>
    );
  };

export default NavAvatar;