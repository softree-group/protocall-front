import "./Meet.css";
import leavePhone from "../../images/leave_phone.svg";
import avatar from "../../images/avatar.svg";
import microphone from "../../images/microphone.svg";
import microphoneMute from "../../images/microphone_mute.svg"
import video from "../../images/video.svg";
import videoOff from "../../images/video_off.svg";
import {useContext, useState} from "react";
import Timer from "./Timer/Timer";
import axios from "axios";
import {API} from "../../backend/api";
import {UserContext} from "../../context/userContext";
import {useHistory} from "react-router";

function Meet(props) {
    const [mute, setMute] = useState(false);
    const [withoutVideo, setWithoutVideo] = useState(false);
    const [isRecording, setIsRecording] = useState(false);

    const {userData, delUserData} = useContext(UserContext);

    const isHost = userData["account"]["username"] === userData["conference"]["host_user_id"]

    const recordHandle = () => {
        axios.post(API.record)
            .then(response => {
                    if (response.status === 200) {
                        console.log("record started");
                    }
                }
            )
            .catch(err => console.error(err));
        setIsRecording(true);
    }

    const history = useHistory();

    const handleOnLeave = () => {
        axios.post(API.leave)
            .then(response => {
                delUserData();
                history.push("/");
            })
            .catch(err => {
                console.error(err);
                delUserData();
                history.push("/");
            })
    }

    return (
        <div className="meet-wrapper">
            <div className="meet_status-bar">
                <p className="meet_status-bar_text">{userData["conference"]["id"]}</p>
                <p className="meet_status-bar_text">Speaker Name</p>
                <p className="meet_status-bar_text"><Timer startedTime={props.startedTime} isRunning={true}/></p>
            </div>
            <div className="meet_control-panel">
                <div className="meet_control-panel_button participants">
                    <img src={avatar} alt="participants"/>
                </div>
                <div className="meet_control-panel_button microphone" onClick={e => {
                    props.handleMicrophoneOnToggle();
                    setMute(!mute);
                }
                }>
                    <img src={mute ? microphoneMute : microphone} alt="microphone"/>
                </div>
                <div className="meet_control-panel_button video" onClick={e => setWithoutVideo(!withoutVideo)}>
                    <img src={withoutVideo ? videoOff : video} alt="video"/>
                </div>
                {!isRecording && isHost && <div onClick={() => recordHandle()} className="meet_control-panel_button record">
                    <span>rec</span>
                </div>}
                <div onClick={() => handleOnLeave()} className="meet_control-panel_button leave">
                    <img src={leavePhone} alt="leave"/>
                </div>
            </div>
        </div>
    )
}

export default Meet;
