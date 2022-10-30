import { useState } from "react";

function useHTTP(){
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    const sendRequest = async ( config, retry = false ) => {
        setLoading(true)
        setError(null)

        try{
            const response = await fetch(
                config.url,
                {
                    method: config.method ? config.method : "GET",
                    headers: config.headers
                    ?    {
                            ...config.headers,
                            "Content-Type": "application/json",
                            "Accept": "application/json",
                        } 
                    :
                        {
                            "Content-Type": "application/json",
                            "Accept": "application/json",
                        },
                    body: config.body ? JSON.stringify(config.body) : null
                }
            )
            

            if ( !response.ok ){
                throw new Error(response.status)
            }

            const contentType = response.headers.get("content-type")
            const data = contentType.includes("json") 
                ? await response.json() 
                : contentType.includes("text") 
                    ? await response.text() 
                    : null
            
            setLoading(false)
            
            return data
        }

        catch( err ){
            if (err.message === "401"){
                if ( !retry ){
                    const tokenResponse = await fetch("/auth/token", 
                        {
                            method: "post",
                            headers: {
                                "Content-Type": "application/json",
                                "Accept": "application/json"
                            }
                        })

                    if ( tokenResponse.ok )
                        return sendRequest( config, retry = true )
                }
            }

            setError(err.message)
            // document.location.reload()
        }
    }

    // localStorage.removeItem("user")

    return { sendRequest, error, loading }
}

export default useHTTP;