import React from 'react';

function PasswordButtons(props){

    const styles = props.styles

    function generatePassword(){
        let generatedPassword = "";
        let length = 20 + Math.floor(Math.random() * 6)
        const required = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*\-+]).{0,}$/
        const validChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789#?!@$%^&*-+"

        for (let i = 0; i < length; i++) {
            let randomNumber = crypto.getRandomValues(new Uint32Array(1))[0];
            randomNumber = randomNumber / 0x100000000;
            randomNumber = Math.floor(randomNumber * validChars.length);
    
            generatedPassword += validChars[randomNumber];
        }

        if ( !generatedPassword.match(required) ){
            generatedPassword = generatePassword()
        }

        return generatedPassword;
    }

    function handleShow(e){
        let mainInput = e.target.parentElement.parentElement.children[0]
        let confirmInput = mainInput.parentElement.nextElementSibling.id.includes("confirm") ? 
            mainInput.parentElement.nextElementSibling.children[0] : ""
        
        switch(mainInput.type){
            case "password":
                mainInput.type = "text";
                mainInput.style.letterSpacing = "var(--textspacing)"

                if (confirmInput){
                    confirmInput.type = "text";
                    confirmInput.style.letterSpacing = "var(--textspacing)"
                }

                break

            case "text":
                mainInput.type = "password";
                mainInput.style.letterSpacing = "0.25em";
                
                if (confirmInput){
                    confirmInput.type = "password";
                    confirmInput.style.letterSpacing = "0.25em"
                }

                break
        }
    }

    function handleAuto(e){
        let mainInput = e.target.parentElement.parentElement.children[0]
        let confirmInput = mainInput.parentElement.nextElementSibling.children[0]
        let generatedPassword = generatePassword()

        props.formDispatch({ 
            type: props.ACTIONS.UPDATE_FIELD, 
            payload: {
                field: "passwordRegister",
                value: generatedPassword
            }
        })

        props.formDispatch({ 
            type: props.ACTIONS.UPDATE_FIELD, 
            payload: {
                field: "passwordConfirm",
                value: generatedPassword
            }
        })

        if (props.fieldState.error){
            props.formDispatch({
                type: props.ACTIONS.CHECK_VALIDITY,
                payload: { field: "passwordRegister" }
            })

            props.formDispatch({
                type: props.ACTIONS.CHECK_VALIDITY,
                payload: { field: "passwordConfirm" }
            })
        }

        mainInput.value = generatedPassword
        confirmInput.value = generatedPassword

        mainInput.type = "text"
        confirmInput.type = "text"

        mainInput.style.letterSpacing = "var(--textspacing)"
        confirmInput.style.letterSpacing = "var(--textspacing)"

        setTimeout(function(){
            mainInput.type = "password"
            confirmInput.type = "password"
    
            mainInput.style.letterSpacing = "0.35vh"
            confirmInput.style.letterSpacing = "0.35vh"
        }, 1000)        
    }

    return(
        <div className = {styles["password-buttons"]}>
            <p id = {styles["show-password"]} onClick = {handleShow}>show</p>
            <p> · </p>
            {props.id === 'password-register' ? 
                <p id = {styles["auto-password"]} onClick = {handleAuto}>auto</p>
                :
                <p id = {styles["forgot-password"]}>forgot</p>
            }
        </div>
    )
}

export default PasswordButtons;