import avatar from "../../../images/avatar.svg"
import {useCallback, useEffect, useRef, useState} from "react";
import mutedMicrophone from "../../../images/microphone_mute.svg";
import mutedVideo from "../../../images/video_off.svg";

function Participant({user}) {
    const [full, setFull] = useState(false);
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
    }, [videoRef.current, user.stream]);

    const handleClick = e => {
        if (user.videoMuted) {
            return;
        }
        e.stopPropagation()
        setFull(!full);
    }

    return (
        <>
            <div className="participant" onClick={handleClick}>
                <div className="participant_picture">
                    <img className="avatar" src={avatar} alt="user avatar"/>
                    {!user.videoMuted && <video ref={videoRef} autoPlay={true}/>}
                </div>
                <div className="participant_user-media-container">
                    {user.audioMuted && <img src={mutedMicrophone} className="user_media_image" alt="muted audio"/>}
                    {user.videoMuted && <img src={mutedVideo} className="user_media_image" alt="muted video"/>}
                </div>
                <p className="participant_name">{user.name}</p>
            </div>
            <div style={full ? {} : {display : "none"}} className="video-full-size" onClick={handleClick}>
                <video onClick={handleClick} ref={videoRef} autoPlay={true}/>
            </div>
        </>
    );
}

export default Participant;
