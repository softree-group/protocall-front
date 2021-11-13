import avatar from "../../../images/avatar.svg"
import {useEffect, useRef} from "react";

function Participant({user}) {

    const videoRef = useRef(null);

    useEffect(() => {
        if (!videoRef.current || !user.stream) {
            console.log("Cannot set stream: videoref(", videoRef.current, ") stream(", user.stream, ")")
            return;
        }

        console.log("Set stream: ", user.stream);
        videoRef.current.srcObject = user.stream;

        const tracks = user.stream.getTracks();
        console.log("tracks: ", tracks);
        for (let idx = 0; idx < tracks.length; idx++) {
            tracks[idx].enabled = true;
        }

        videoRef.current.onloadedmetadata = () => {
            console.log("loaded")

        }
    }, [videoRef.current, user.stream])

    return (
        <div className="participant">
            <div className="participant_picture">
                <img src={avatar} alt="user avatar"/>
                <video ref={videoRef} autoPlay={true}/>
            </div>
            <p className="participant_name">{user.name}</p>
        </div>
    )
}

export default Participant;
