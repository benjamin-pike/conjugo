import infinitives from "../assets/js/infinitives-object.js"

const urlEncoded = {
    spanish: {
        á: 'a%CC%81',
        é: 'e%CC%81',
        í: 'i%CC%81',
        ó: 'o%CC%81',
        ú: 'u%CC%81',
        ü: 'u%CC%88',
        ñ: 'n%CC%83',
    }
}

export default async ( language, infinitive, conjugation, instantPlay = false ) => {

    const context = new AudioContext();
    const sourceNode = new AudioBufferSourceNode( context );
    const rank = infinitives[ language ][ infinitive ]

    const encodedConjugation = [...conjugation.replace( " ", "_" )].reduce((output, char) => {
        return output + (urlEncoded[language][ char ] || char)
    }, '')
    
    const response = await fetch(`https://conjugo.s3.eu-west-2.amazonaws.com/conjugations/${language}/${rank}_${infinitive}/${encodedConjugation}.mp3`)
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