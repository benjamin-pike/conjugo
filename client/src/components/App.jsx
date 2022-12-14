import React, { useState, useRef, useEffect } from "react";
import { BrowserRouter as Router, useRoutes, Navigate } from 'react-router-dom';
import { AuthProvider } from "../store/AuthContext";
import { LangProvider } from "../store/LangContext";
import { NavProvider } from "../store/NavContext";
import { useAuth } from "../store/AuthContext";
import NavBar from "./navbar/NavBar";
import Footer from "./footer/Footer";
import Learn from "./learn/Learn";
import Practice from "./practice/Practice"
import Auth from "./auth/Auth"
import Reference from "./reference/Reference"
import "./master.css"

function Routes() {

    const [language, setLanguage] = useState(
        {
            name: "spanish",
            flag: "./spanish.svg",
            level: 0,
        }
    )

    const { auth } = useAuth()

    const config = {
        learn: <Learn />,
        practice: <Practice language = {language} setLanguage = {setLanguage} />,
        reference: <Reference language = {language} setLanguage = {setLanguage} />,
        auth: <Auth />,

        defaultAuth: <Navigate to = {{pathname: "/login"}} />,
        defaultPrivate: <Navigate to = {{pathname: "/"}} />
    }

    const AuthRoutes = () => useRoutes([
        { path: "/login", element: config.auth },
        { path: "/register", element: config.auth },
        { path: "*", element: config.defaultAuth }
    ])

    const PrivateRoutes = () => useRoutes([
        { path: "/", element: config.reference },
        { path: "/learn", element: config.learn },
        { path: "/practice", element: config.practice },
        { path: "/reference", element: config.reference },
        { path: "*", element: config.defaultPrivate }
    ])

    if ( auth.isLoggedIn ) return (
        <LangProvider>
            <NavProvider>
                <NavBar />
                <PrivateRoutes />
                <Footer />
            </NavProvider>
        </LangProvider>
    )
    
    return <AuthRoutes />
}

function App() {

    const ref = useRef()

    useEffect(() => {
        let mouseIsOutside = false
        
        document.onmouseleave = () => mouseIsOutside = true
        document.onmouseenter = () => mouseIsOutside = false

        const resizeObserver = new ResizeObserver(() => {
            if ( mouseIsOutside ) {
                ref.current.classList.add( "disable-transitions" )

                setTimeout( () => {
                    ref.current.classList.remove( "disable-transitions" )
                })
            }
        })

        resizeObserver.observe( ref.current )
        return () => resizeObserver.disconnect( ref.current )
    }, [])

    return (
        <div ref = { ref }>
            <AuthProvider>
                    <Router>
                        <Routes />
                    </Router>
            </AuthProvider>
        </div>
    );
}

export default App;