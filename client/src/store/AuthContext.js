import React, { useState, useContext } from 'react';

const AuthContext = React.createContext();

export function useAuth(){
    return useContext(AuthContext)
}

export function AuthProvider( { children } ){

    const ls = localStorage

    const [auth, setAuth] = useState({
        isLoggedIn: ls.getItem('id') && ls.getItem("accessToken") && ls.getItem("refreshToken"),
        id: ls.getItem('id'),
        accessToken: ls.getItem("accessToken"),
        refreshToken: ls.getItem("refreshToken"),
        userData: JSON.parse(ls.getItem("userData"))
    })

    function login(id, accessToken, refreshToken, userData){
        setAuth({
            isLoggedIn: true,
            id: id,
            accessToken: accessToken,
            refreshToken: refreshToken,
            userData: userData
        })

        ls.setItem("id", id)
        ls.setItem("accessToken", accessToken)
        ls.setItem("refreshToken", refreshToken)
        ls.setItem("userData", JSON.stringify(userData))
    }

    function logout(){
        setAuth({ isLoggedIn: false })

        ls.removeItem("id")
        ls.removeItem("accessToken")
        ls.removeItem("refreshToken")
        ls.removeItem("userData")
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