import {useEffect, useRef} from "react";

function Audio({track}) {
    const audioRef = useRef(null);

    useEffect(() => {
        if (!audioRef.current) {
            return;
        }
        const stream = new MediaStream([track]);
        audioRef.current.srcObject = stream;
        track.enabled = true;
        audioRef.current.valume = 1;
        console.log("Enable stream: ", stream);
    }, [audioRef.current, track])

    return (
        <>
            <audio ref={audioRef} autoPlay={true}/>
        </>
    );
}

export default Audio;
