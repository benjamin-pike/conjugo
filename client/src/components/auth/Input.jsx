import React from "react";
import PasswordButtons from "./PasswordButtons";

function Input(props){

    const styles = props.styles

    const errorMessages = {
        fname: {
            empty: <p>Please enter your <strong>first name</strong></p>,
            characters: <p>First name contains <strong>invalid characters</strong></p>,
            maxLength: <p>First name is too long</p>
        },
        lname: {
            empty: <p>Please enter your <strong>last name</strong></p>,
            characters: <p>Last name contains <strong>invalid characters</strong></p>,
            maxLength: <p>Last name is too long</p>
        },
        username: {
            empty: <p>Please enter a <strong>username</strong></p>,
            firstChar: <p>The first character of your username<br />must be a letter</p>,
            lastChar: <p>The last character of your username<br />must be a <strong>letter or number</strong></p>,
            consecutive: <p>Your username cannot contain<br />consecutive special characters</p>,
            maxLength: <p>Your username is too long</p>,
            minLength: <p>Your username must be at<br />least 6 characters long</p>,
            exists: <p>This username is registered<br />with an existing account</p>
        },
        dob: {
            empty: <p>Please enter your <strong>date of birth</strong></p>,
            date: <p>Invalid date of birth</p>
        },
        email: {
            empty: <p>Please enter your <strong>email address</strong></p>,
            pattern: <p>Invalid email</p>,
            exists: <p>This email is registered with<br />an existing account</p>
        },
        passwordRegister: {
            empty: <p>Please enter a <strong>password</strong></p>,
            requiredChars: <div>
                <p>Password must contain at least:</p>
                <ul>
                    <li>1 uppercase letter</li>
                    <li>1 lowercase letter</li>
                    <li>1 number</li>
                    <li>1 special character (#?!@$%^&*-+)</li>
                </ul>
            </div>,
            invalidChars: <p>Password contains invalid characters</p>,
            minLength: <p>Password must be at least<br />8 characters long</p>
        },
        passwordConfirm: {
            empty: <p>Please confirm your <strong>password</strong></p>,
            mismatch: <p>Passwords do not match</p>
        },
        usernameEmail: {
            empty: <p>Please enter your <strong>username</strong> or <strong>email</strong></p>,
            notFound: <p>We could not find your account</p>
        },
        passwordLogin: {
            empty: <p>Please enter your <strong>password</strong></p>,
            incorrect: <p>The password you entered is incorrect</p>
        }
    }

    function handleFocus(e){
        if (e.target.id.includes("auth_dob")){
            e.target.type = "date"
            e.target.min = "1900-01-01"
        }
    }

    function handleBlur(e){
        if (e.target.id.includes("auth_dob") && e.target.value === ""){
            e.target.type = "text"
            e.target.min = ""
        }

        props.formDispatch({
            type: props.ACTIONS.CHECK_VALIDITY,
            payload: { field: props.name }
        })
    }

    function handleChange(e){
        const field = e.target.name
        const value = e.target.value

        props.formDispatch({
            type: props.ACTIONS.UPDATE_FIELD,
            payload:{
                field: field,
                value: value 
            }
        })

        if (props.fieldState.error){
            if (props.fieldState.error === "empty"){
                props.formDispatch({
                    type: props.ACTIONS.SET_ERROR,
                    payload: { field: props.name, error: "" }
                })
            } else {
                props.formDispatch({
                    type: props.ACTIONS.CHECK_VALIDITY,
                    payload: { field: props.name }
                })
            }

        }
    }

    return(
        <div className = {styles["input-container"]} id = {styles[`${props.id}-container`]}>
            <input
                id = {styles[props.id]} 
                className = {props.fieldState.error ? styles["input__invalid"] : styles["input__valid"]}
                value = {props.fieldState.value}
                name = {props.name}
                type = {props.type}
                onChange = {handleChange}
                onFocus = {handleFocus}
                onBlur = {handleBlur}
                placeholder = {props.placeholder}
                spellCheck = "false"
                required
            />
            {(props.id === 'password-register' || props.id === 'password-login') && 
                <PasswordButtons 
                    id = {props.id} 
                    styles = {styles}
                    fieldState = {props.fieldState}
                    formDispatch = {props.formDispatch}
                    ACTIONS = {props.ACTIONS}
                />
            }
            <div className = {styles["error"]} id = {styles["error__" + props.id]}>
                {props.fieldState.error && errorMessages[props.name][props.fieldState.error]}
            </div>
        </div>
    )
}

export default Input;