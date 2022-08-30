import React, { useRef } from "react";
import { useNav } from "../../store/NavContext";
import styles from "./footer.module.css"

function Footer(){

    const { visible } = useNav()

    if ( visible ) return(
            <div id = {styles["footer"]}>
                <div id = {styles["footer-items"]}>
                    <ul id = {styles["wrapper"]}>
                        <li>Terms of Use</li>
                        •
                        <li>Privacy Policy</li>
                        •
                        <li>Contact</li>
                        
                        <li id = {styles["copyright"]}>
                            <span id = {styles["bold"]} >© </span>  
                            <span className = {styles["light"]}>{new Date().getFullYear()}</span> 
                            <span id = {styles["company-name"]} > Conjugo </span>  
                            <span className = {styles["light"]}>All Rights Reserved</span>
                        </li>
                    </ul>
                </div>
            </div>
    )

    return <></>
}

export default Footer;