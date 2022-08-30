import { useState, useRef, useEffect } from "react"
import { useLang } from "../../../store/LangContext" 
import getAudio from "../../../functions/getAudio.js"
import VerbCard from "../VerbCard"
import styles from "./styles_audio-card.module.css"

function AudioCard( props ){

    const { language } = useLang()
    const [audio, setAudio] = useState( { play: () => {}, duration: null, waveData: [] })
    const [opacity, setOpacity] = useState()

    const barsRef = useRef()

    useEffect(async () => {
        const filterData = ( audioBuffer, samples ) => {
            const rawData = audioBuffer.getChannelData(0);
            const blockWidth = Math.floor( rawData.length / samples );
            const filteredData = [];
            
            for ( let i = 0; i < samples; i++ ) {
              let blockStart = blockWidth * i;
              let sum = 0;
              
              for ( let j = 0; j < blockWidth; j++ ) {
                sum = sum + Math.abs( rawData[blockStart + j] )
              }

              filteredData.push(sum / blockWidth);
            }

            const max = Math.max( ...filteredData )
            const normalizedData =  filteredData.map( bar => bar / max )

            let start = null
            let end = 0
    
            normalizedData.forEach( (bar, index) => {
                if ( bar > Math.max( ...normalizedData ) / 10 ) {
                    end = index
                    if ( start === null ) start = index
                }
            })

            return normalizedData.slice(start, end)
        }

        const { buffer, duration } = await getAudio( language.name, props.infinitive, props.audio )
        const filteredData = filterData( buffer, 26 )

        setAudio( { buffer, duration, waveData: [...filteredData] } )
        setOpacity( filteredData.map( () => Math.random() ) )
    }, [])

    const handleClick = () => {
        if ( !props.disabled ){
            const context = new AudioContext();
            const sourceNode = new AudioBufferSourceNode( context );

            const bars = Array.from( barsRef.current.children )
            const interval = 750 * audio.duration / bars.length

            bars.forEach( (bar, index) => {
                const barHeight = bar.getAttribute("amplitude")

                setTimeout( () => {
                    bar.style.height = `${(barHeight * 80) + 40}%`
                }, ( index + 1 ) * interval )

                setTimeout( () => {
                    bar.style.height = `${(barHeight * 80) + 20}%`
                }, ( index + 5 ) * interval )
            })

            sourceNode.buffer = audio.buffer
            sourceNode.connect( context.destination )
        
            sourceNode.start( 0 )

            props.setDisabled( true )
            setTimeout( () => props.setDisabled( false ), ( audio.duration * 1000 ) - 200 )
        }
    }

    return(
        <div onClick = { handleClick } style = {{ perspective: "inherit" }}>
            <VerbCard
                disabled = { props.disabled }
                setDisabled = { props.setDisabled }
                duration = { audio.duration }>
                
                <div ref = { barsRef } id = { styles["waveform"]} >
                    {audio.waveData.map( ( bar, index ) => 
                        <div 
                            className = { styles["waveform__bar"] }
                            amplitude = { bar }
                            style = {{
                                height: `${(bar * 70) + 30}%`,
                                opacity: opacity ? `${opacity[index] * 0.75 + 0.25}` : 1
                            }}
                        />
                    )}
                </div>
            </VerbCard>
        </div>
        );
}

export default AudioCard