import React, { useState, useContext, useEffect } from 'react';

const NavContext = React.createContext();

export function useNav(){
    return useContext(NavContext)
}

export function NavProvider( { children } ){

    const [visible, setVisible] = useState(true)
    const [current, setCurrent] = useState("about")

    const value = {
        visible, displayNav: setVisible,
        current, setCurrent
    }

    return(
        <NavContext.Provider value = { value }>
            { children }
        </NavContext.Provider>
    );
}