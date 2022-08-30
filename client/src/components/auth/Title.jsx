import { useState, useEffect } from 'react';

function Title(props) {

    const [title, setTitle] = useState({text: "​", forwards: true, delay: 0})

    useEffect(() => {

        setTitle( { text: "​", forwards: true, delay: 0 } )

        function type(){
            setTitle(({ text, forwards, delay }) => {
                if (forwards){
                    if (text.length !== props.fullTitle.length){
                        text = props.fullTitle.slice(0, text.length + 1)
                    } else {
                        delay++
                    }

                } else {
                    if (text.length > 1){
                        text = props.fullTitle.slice(0, text.length - 1)
                    } else {
                        delay++
                    }
                }

                if (( delay > 20 && forwards ) || delay > 5 && !forwards){
                    forwards = !forwards
                    delay = 0
                }

                return { text, forwards, delay }
            })
        }

        let typeInterval = setInterval(type, 100)

        return () => clearInterval(typeInterval);
    }, [props.role])

    return(
        <>{title.text}</>
    );
}

export default Title;