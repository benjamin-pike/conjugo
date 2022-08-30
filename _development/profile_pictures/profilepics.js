import React, { useEffect } from "react";
import ReactDOM from "react-dom";
import { toPng, toJpeg, toBlob, toPixelData, toSvg } from 'html-to-image';
import download from "downloadjs";

function App(){
    useEffect(async () => {
        const background = document.getElementById("background")
        const foreground = document.getElementById("letter")
    
        const colors = ["red", "orange", "yellow", "green", "blue", "purple", "pink"]
        const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"

        for (let color of colors){
            background.style.backgroundColor = `var(--${color}`

            for (let letterIndex in letters){
                let letter = letters[letterIndex]

                foreground.innerHTML = letter

                let imageURL = await toPng(background)
                download(imageURL, `${letter}-${color}.png`);
            }
        }
    }, [])

    return (
        <div id = "background">
            <p id = "letter">O</p>
        </div>
    );
}

ReactDOM.render(<App />, document.getElementById('root2'))
