import infinitives from "../assets/js/infinitives-object.js"

export default async ( language, infinitive, conjugation, instantPlay = false ) => {

    const context = new AudioContext();
    const sourceNode = new AudioBufferSourceNode( context );
    const rank = infinitives[ language ][ infinitive ]
    
    const response = await fetch( `http://localhost:9000/audio/conjugations/${language}/${rank}_${infinitive}/${conjugation.replace( " ", "_" )}.mp3` )
    const arrayBuffer = await response.arrayBuffer()
    const audioBuffer = await context.decodeAudioData( arrayBuffer )

    sourceNode.buffer = audioBuffer
    sourceNode.connect( context.destination )

    const playAudio = () => sourceNode.start( 0 )

    if ( instantPlay ) return playAudio()
    
    return { 
        play: playAudio,
        buffer: audioBuffer,
        duration: audioBuffer.duration
    }
}