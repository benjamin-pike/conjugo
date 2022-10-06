import React, { useState, useEffect, useReducer } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../store/AuthContext'
import Title from './Title';
import Input from './Input';
import LoadingDots from '../common/LoadingDots/LoadingDots';
import fields from './input-fields';
import styles from './styles/auth.module.css';

const ACTIONS = {
    UPDATE_FIELD: "update-field",
    CHECK_VALIDITY: "check-validity-single",
    SET_SUBMIT: "set-submit",
    SET_ERROR: "set-error",
    RESET_STATE: "reset-state"
}

function Auth() {

    const navigate = useNavigate()
    const [role, setRole] = useState()
    const { pathname } = useLocation()
    const { login } = useAuth()
    
    useEffect(() => setRole( pathname.slice(1) ), [pathname])
    
    const defaultState = {
        submit: false,
        isValid: true,
        register: {
            fname: { value: "", error: "" }, 
            lname: { value: "", error: "" }, 
            username: { value: "", error: "" }, 
            dob: { value: "", error: "" }, 
            email: { value: "", error: "" }, 
            password: { value: "", error: "" }, 
            confirmPassword: { value: "", error: "" }
        },
        login: {
            identifier: { value: "", error: "" },
            password: { value: "", error: "" }
        }
    }

    const [formState, dispatch] = useReducer(reducer, defaultState)

    async function postForm(formData){
        const response = await fetch(`/auth/${role}`, 
            {
                method: "POST",
                body: JSON.stringify(formData),
                headers:
                    {
                        "Content-Type": "application/json",
                        "Accept": "application/json"
                    }
            }
        )

        const resStatus = response.status
        const resBody = await response.json()

        return { status: resStatus, body: resBody }
    }

    function reducer(currentState, action){

        let newState = {...currentState, submit: false}

        switch(action.type){
            case ACTIONS.UPDATE_FIELD:
                if ( action.payload.field.includes("password") ){
                    newState[role][action.payload.field].value = action.payload.value
                } else {
                    newState[role][action.payload.field].value = action.payload.value.trim()
                }

                return newState

            case ACTIONS.CHECK_VALIDITY:
                let value = currentState[role][action.payload.field].value
                let error = ""

                switch ( action.payload.field ){
                    case "fname":
                        if ( !value.match( /^[A-Za-z]+$/ ) ){
                            error = "characters"
                        }

                        if ( value.trim().length > 32 ){
                            error = "maxLength"
                        }
                        break

                    case "lname":
                        if ( !value.match( /^[A-Za-z]+$/ ) ){
                            error = "characters"
                        }

                        if ( value.trim().length > 32 ){
                            error = "maxLength"
                        }
                        break
                    
                    case "username":
                        if ( !value.match( /^[A-Za-z0-9_\-\.]+$/ ) ){
                            error = "characters"
                        }

                        if ( !value.match( /^[A-za-z].*/ ) ){
                            error = "firstChar"
                        }

                        if ( !value.match( /^.*[A-za-z0-9]$/ ) ){
                            error = "lastChar"
                        }

                        if ( value.match( /^!?.*[_\-\.]{2}.*$/ )){
                            error = "consecutive"
                        }
                        
                        if ( value.trim().length > 32 ){
                                error = "maxLength"
                        }

                        if ( value.trim().length < 6 ){
                            error = "minLength"
                        }
                        break

                    case "dob":
                        let date = Date.parse(value)
                        
                        const earliest = Date.parse("1900-01-01")
                        const latest = (new Date()).getTime()
                        
                        if ( date < earliest || date > latest){
                            error = "date"
                        }
                        break

                    case "email":
                        const emailPattern = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
                        if ( !emailPattern.test(value) ){
                            error = "pattern"
                        }
                        break
                    
                    case "password":
                        const required = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*\-+]).{0,}$/
                        const valid = /^[a-zA-Z0-9#?!@$%^&*\-+]+$/

                        if ( !value.match(required) ){
                            error = "requiredChars"
                        }

                        if ( !value.match(valid) ){
                            error = "invalidChars"
                        }

                        if (value.length < 8){
                            error = "minLength"
                        }
                        break

                    case "confirmPassword":
                        if (value !== currentState.register.password.value){
                            error = "mismatch"
                        }
                        break
                }

                if ( value.trim().length === 0 ){
                    error = "empty"
                }
                
                newState[role][action.payload.field].error = error

                newState.isValid = Object.values( newState[role] )
                    .map(({ error }) => error )
                    .every( err => err === "" )

                return newState

            case ACTIONS.RESET_STATE:
                newState = defaultState
                return newState

            case ACTIONS.SET_SUBMIT:
                newState.submit = action.payload.submit && currentState.isValid
                return newState

            case ACTIONS.SET_ERROR:
                newState[role][action.payload.field].error = action.payload.error
                newState.isValid = false

                return newState

            default:
                return formState
        }
    }

    const activeFields = fields.filter(field => field.role === role).map(field => field.name)

    function formSubmit(e){
        e.preventDefault()

        for (let field of activeFields){
            dispatch({
                type: ACTIONS.CHECK_VALIDITY,
                payload: { field: field } 
            })
        }

        dispatch({
            type: ACTIONS.SET_SUBMIT,
            payload: { submit: true }
        })
    }

    useEffect(() => {dispatch( { type: ACTIONS.RESET_STATE } )}, [role])

    useEffect (() => {
        if ( formState.submit ){
            let formData = Object.fromEntries(
                Object.entries(formState[role]).map( ( [field, { value } ] ) => {
                    return [field, value]
                }).filter(([field]) => field !== 'confirmPassword')
            )

            postForm(formData).then(({ status, body }) => {
                console.log(body)
                if (status === 400 || status === 401){
                    if (body.error === "exists"){
                        return dispatch({
                            type: ACTIONS.SET_ERROR,
                            payload: { field: body.field, error: "exists" }
                        })
                    } 
                    
                    if (body.error === "not found"){
                        return dispatch({
                            type: ACTIONS.SET_ERROR,
                            payload: { field: "identifier", error: "notFound" }
                        })
                    }

                    if (body.error === "invalid password"){
                        return dispatch({
                            type: ACTIONS.SET_ERROR,
                            payload: { field: "password", error: "incorrect" }
                        })
                    }
                }

                if (status === 200 || status === 201){
                    const { username, fname, image } = body
                    login({ username, fname, image })
                }
            });
        }
    }, [formState.submit])

    useEffect(() => { // Adjust horizontal scroll to center if errors are visible 
        if (!formState.isValid) {
            const container = document.getElementById(styles["container"])
            window.scroll( (container.offsetWidth / 2) - (window.innerWidth / 2), 0 )
        }
    }, [formState])

    return (
        <>
            <div id = {styles["container"]}
                style = {{minWidth: formState.isValid ? "30em" : "65em"}}>
                <div className = {styles["bounding-box"]}>
                    <h2 className = {styles["title"]}>
                        <Title
                            role = {role}
                            fullTitle = {role === 'register' 
                                ? "​Create an Account " 
                                : "​Log In "
                            }
                        />
                    </h2>

                    <form method = "POST">
                        {fields.map((field) => {
                            if (field.role === role){
                                return <Input
                                    formRole = {role}
                                    formState = {formState}
                                    formDispatch = {dispatch}
                                    fieldState = {formState[role][field.name]}
                                    ACTIONS = {ACTIONS}
                                    styles = {styles}
                                    key = {field.key}
                                    id = {field.id}
                                    class = {field.class}
                                    name = {field.name}
                                    type = {field.type}
                                    focus = {field.focus}
                                    placeholder = {field.placeholder}
                                />
                            }
                        })}

                        <div className = {`${styles["buttons"]} ${styles[role]}`}>
                            <div className = {styles["button-3d-wrapper"]}>
                                <button 
                                    className = {styles["button-3d"]}
                                    type = "submit"
                                    id = {styles["primary"]}
                                    onClick = {formSubmit}
                                    disabled = {formState.submit}>

                                    {!formState.submit ? 
                                        role === 'register' ? 'Create Account' : 'Log In'
                                        :
                                        <LoadingDots
                                            id = {"auth-button"}
                                            size = {0.5}
                                            dark = {false} 
                                        />
                                    }
                                    <div className = {styles["button-3d-overlay"]} />
                                </button>
                            </div>
                            <p id = {styles["buttons__alternative"]}>
                                {role === 'register' ? 
                                    <><strike>{' '.repeat(11)}</strike><span>{' '.repeat(3)}</span>Already have an account?<span> {' '.repeat(3)}</span><strike>{' '.repeat(11)}</strike></>
                                    : 
                                    <><strike>{' '.repeat(18)}</strike><span>{' '.repeat(3)}</span>Need an account?<span> {' '.repeat(3)}</span><strike>{' '.repeat(18)}</strike></>}
                            </p>
                            <div className = {styles["button-3d-wrapper"]}>
                                <button 
                                    className = {styles["button-3d"]}
                                    id = {styles["secondary"]}
                                    type = "button"
                                    onClick = {() => {navigate(role === "register" ? "/login" : "/register")}}>
                                        
                                    {role === 'register' ? 'Log In' : 'Create Account'}
                                    <div className = {styles["button-3d-overlay"]} />
                                </button>
                            </div>
                        </div>
                    </form>

                    <div className = {styles["terms"]}>
                        <p>By {role === 'register' ? 'creating an account' : 'logging in to conjugo'}, you are agreeing to our<br /><a href = '#'><strong>Terms and Conditions</strong></a> and <a href = '#'><strong>Privacy Policy</strong></a>.</p>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Auth;