import React, { useState, useContext } from 'react';

const AuthContext = React.createContext();

export function useAuth(){
    return useContext(AuthContext)
}

export function AuthProvider( { children } ){

    const user = localStorage.getItem("user")

    const [auth, setAuth] = useState({
        isLoggedIn: Boolean(user),
        user: JSON.parse(user)
    })

    function login(user){
        console.log(user)
        setAuth({
            isLoggedIn: true,
            user: {
                username: user.username,
                fname: user.fname,
                image: user.image
            }
        })

        localStorage.setItem("user", JSON.stringify(user))
    }

    function logout(){
        setAuth({ isLoggedIn: false })
        localStorage.removeItem("user")
    }

    const value = {
        auth,
        login,
        logout,
    }

    return(
        <AuthContext.Provider value = { value }>
            { children }
        </AuthContext.Provider>
    );
}