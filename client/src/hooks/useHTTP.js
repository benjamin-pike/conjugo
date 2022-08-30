import { useState } from "react";

function useHTTP(){
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    const sendRequest = async ( config, retry = false ) => {
        setLoading(true)
        setError(null)

        let accessToken;
        let refreshToken;

        try{
            if ( config.token ){
                accessToken = config.token.access
                refreshToken = config.token.refresh
            } else {
                accessToken = localStorage.getItem('accessToken')
                refreshToken = localStorage.getItem('refreshToken')
            }
        }

        catch ( err ) { setError(401) }

        try{
            const response = await fetch(
                config.url,
                {
                    method: config.method ? config.method : "GET",
                    headers: config.headers ? 
                        {
                            ...config.headers,
                            "Content-Type": "application/json",
                            "Accept": "application/json",
                            "Authorization": "Bearer " + accessToken
                        } 
                    :
                        {
                            "Content-Type": "application/json",
                            "Accept": "application/json",
                            "Authorization": "Bearer " + accessToken
                        },
                    body: config.body ? JSON.stringify(config.body) : null
                }
            )
            

            if ( !response.ok ){
                throw new Error(response.status)
            }

            const contentType = response.headers.get("content-type")
            const data = contentType.includes("json") ? await response.json() : contentType.includes("text") ? await response.text() : null
            
            setLoading(false)
            
            return data
        }

        catch( err ){
            console.log(err)
            if (err.message === "403"){
                if ( !retry ){
                    const tokenResponse = await fetch("http://localhost:8000/token", 
                    {
                        method: "post",
                        headers: {
                            "Content-Type": "application/json",
                            "Accept": "application/json"
                        },
                        body: JSON.stringify({ token: refreshToken })
                    })

                    if ( tokenResponse.ok ){
                        const { access: newAccess, refresh: newRefresh } = await tokenResponse.json()
    
                        localStorage.setItem('accessToken', newAccess)
                        localStorage.setItem('refreshToken', newRefresh)
    
                        return sendRequest( config, retry = true )
                    }
                }
            }

            setError(err.message)

            localStorage.removeItem("id")
            localStorage.removeItem("accessToken")
            localStorage.removeItem("refreshToken")

            // document.location.reload()
        }
    }

    return { sendRequest, error, loading }
}

export default useHTTP;