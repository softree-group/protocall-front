import "./Meet.css";
import leavePhone from "../../images/leave_phone.svg";
import avatar from "../../images/avatar.svg";
import microphone from "../../images/microphone.svg";
import microphoneMute from "../../images/microphone_mute.svg"
import video from "../../images/video.svg";
import videoOff from "../../images/video_off.svg";
import {createContext, useCallback, useContext, useEffect, useMemo, useRef, useState} from "react";
import Timer from "./Timer/Timer";
import axios from "axios";
import {API} from "../../backend/api";
import {ConferenceContext, UserContext} from "../../context/context";
import {useHistory} from "react-router";
import Participants from "./Participants/Participants";
import Centrifuge from "centrifuge";
import {useDispatch, useSelector} from "react-redux";
import {actionsStream, connected, endConference, leave, newConference, startRecording} from "../../redux/actions";
import {toast} from "react-hot-toast";

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

    const {userData, delUserData} = useContext(UserContext);

    const dispatch = useDispatch();
    const isRecording = useSelector(state => state.conference.is_recording);
    const startedAt = useSelector(state => state.conference.started_at);
    const userVideo = useSelector( state => state.stream.local.video);
    const remotes = useSelector(state => state.stream.remote);

    const localVideo = useRef(null);
    const localVideoOverlay = useRef(null);

    console.log("REMOTES: ", remotes);

    useEffect(() => {
        if (!localVideo.current) {
            console.log("No localVideo.current");
            return;
        }
        console.log("Has localVideo");
        console.log("USER VIDEO: ", userVideo.stream);
        localVideo.current.srcObject = new MediaStream([userVideo.stream]);
        // localVideoOverlay.current.width = localVideo.current.width
    }, [localVideo.current, userVideo])

    const eventHandler = useCallback( (event) => {
        switch (event.event) {
            case "end":
                toast("Conference ended by host")
                props.handleOnTerminate();
                history.push("/");
                delUserData();
                dispatch(endConference());
                dispatch(actionsStream.deleteAll());
                return;
            case "start_record":
                toast("Recording has started!", {
                    icon: "🎬"
                })
                dispatch(startRecording());
                return;
            case "connected":
                dispatch(connected(event.user));
                return;
            case "leave":
                dispatch(leave(event.user));
                return;
            default:
                console.log();
        }
    }, []);

    useEffect(() => {
        const centrifuge = new Centrifuge("wss://" + window.location.host + "/connection/websocket")
        centrifuge.setToken(userData["cent_token"]);

        centrifuge.on('connect', function(ctx) {
            console.log("connected", ctx);
        });

        centrifuge.on('disconnect', function(ctx) {
            console.log("disconnected", ctx);
        });

        centrifuge.subscribe("conference~" + userData["conference"]["id"], function(ctx) {
            eventHandler(ctx.data)
        });

        centrifuge.connect();
        return () => centrifuge.disconnect()
    }, []);

    const isHost = userData["account"]["username"] === userData["conference"]["host_user_id"]

    useEffect(() => {
        axios.get(API.conferenceInfo)
            .then(response => {
                console.log(response.data);
                dispatch(newConference(response.data));
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
                        dispatch(startRecording());
                    }
                }
            )
            .catch(err => console.error(err));
    }

    const history = useHistory();

    const handleOnLeave = () => {
        props.handleOnTerminate();
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
                    {/*<p className="meet_status-bar_text"></p>*/}
                    <p className="meet_status-bar_text"><Timer startedTime={startedAt ? new Date(startedAt * 1000) : null} isRunning={!!startedAt}/></p>
                </div>
                <div className={"recording_status" + (isRecording ? " enabled" : " disabled")}/>
                <div className="meet_user_video" ref={localVideoOverlay}>
                    {userVideo === null ? <div>no video</div> : <video autoPlay={true} ref={localVideo}/>}
                </div>
                <Participants/>
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
                    <div className="meet_control-panel_button video" onClick={e => {
                        props.handleVideoToggle();
                        setWithoutVideo(!withoutVideo)
                    }}>
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
