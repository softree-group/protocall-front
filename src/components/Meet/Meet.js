import "./Meet.css";
import leavePhone from "../../images/leave_phone.svg";
import avatar from "../../images/avatar.svg";
import microphone from "../../images/microphone.svg";
import microphoneMute from "../../images/microphone_mute.svg"
import video from "../../images/video.svg";
import videoOff from "../../images/video_off.svg";
import {createContext, useContext, useEffect, useState} from "react";
import Timer from "./Timer/Timer";
import axios from "axios";
import {API} from "../../backend/api";
import {ConferenceContext, UserContext} from "../../context/context";
import {useHistory} from "react-router";
import Participants from "./Participants/Participants";

function devUserData() {
    return {
        "userData": {
            "account": {
                "username": "123"
            },
            "conference": {
                "host_user_id": "123"
            }
        },
        "delUserData": () => {}
    }
}

function Meet(props) {
    const [mute, setMute] = useState(false);
    const [withoutVideo, setWithoutVideo] = useState(false);
    const [isRecording, setIsRecording] = useState(false);
    const [conference, setConference] = useState(null);

    const {userData, delUserData} = useContext(UserContext);

    const isHost = userData["account"]["username"] === userData["conference"]["host_user_id"]

    useEffect(() => {
        axios.get(API.conferenceInfo)
            .then(response => {
                console.log(response.data);
                setConference(response.data);
            })
            .catch(err => {
                console.log(err);
                delUserData();
            })
    }, []);

    const recordHandle = () => {
        axios.post(API.record)
            .then(response => {
                    if (response.status === 200) {
                        console.log("record started");
                        setConference({...conference, is_recording: true})
                    }
                }
            )
            .catch(err => console.error(err));
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

    console.log("CONF", conference)

    return (
        <ConferenceContext.Provider value={{conference, setConference}}>
            <div className="meet-wrapper">
                <div className="meet_status-bar">
                    <p className="meet_status-bar_text">{userData["conference"]["id"]}</p>
                    {/*<p className="meet_status-bar_text"></p>*/}
                    <p className="meet_status-bar_text"><Timer startedTime={conference ? new Date(conference["started_at"] * 1000) : null} isRunning={!!conference}/></p>
                </div>
                <div className={"recording_status" + (conference && conference.is_recording ? " enabled" : " disabled")}/>
                <Participants participants={conference ? conference.participants : []}/>
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
                    {conference && !conference.is_recording && isHost && <div onClick={() => recordHandle()} className="meet_control-panel_button record">
                        <span>rec</span>
                    </div>}
                    <div onClick={() => handleOnLeave()} className="meet_control-panel_button leave">
                        <img src={leavePhone} alt="leave"/>
                    </div>
                </div>
            </div>
        </ConferenceContext.Provider>
    )
}

export default Meet;
