import {useCallback, useContext, useEffect, useMemo, useRef, useState} from "react";
import Connection from "../Connection/Connection";
import Meet from "../Meet/Meet";
import {SIPClient} from "../../sip/client";
import {SessionState} from "sip.js";
import {UserContext} from "../../context/context";
import {useHistory} from "react-router";
import {CyberMegaPhone} from "../../sip/cyber";
import axios from "axios";
import {API} from "../../backend/api";
import Centrifuge from "centrifuge";
import {AsteriskConfig} from "../../backend/config";
import {useDispatch} from "react-redux";
import {actionsStream} from "../../redux/actions";
import {toast} from "react-hot-toast";

function Conference(props) {
    const [connected, SetConnected] = useState(false);
    const [soundOn, setSoundOn] = useState(true);
    const [microphoneOn, setMicrophoneOn] = useState(false);
    const [registrationState, setRegistrationHandler] = useState(null)
    const [callState, setCallState] = useState(null)
    const [startedTime, setCallStartedTime] = useState(null)

    const {userData, delUserData} = useContext(UserContext);
    const history = useHistory();
    const dispatch = useDispatch();

    if (!userData) {
        history.push("/");
    }

    const handleCallStateChange = useCallback((state) => {
        setCallState(state);

        switch (state) {
            case SessionState.Initial:
                controlSound(true);
                controlMicrophone(true);
                break;
            case SessionState.Established:
                setCallStartedTime(new Date());
                break;
            default:
        }
    }, [])

    const client = useMemo(() => {
        if (!userData) {
            return;
        }
        const {username, password} = userData.account;
        const client = new CyberMegaPhone(
            username,
            username,
            password,
            "aster.softex-team.ru",
            true,
            true,
            true);

        client.handle("connected", function () {
            console.log("Connected");
        });

        client.handle("disconnected", function () {
            console.log("disconnected");
        });

       client.handle("registered", function () {
           console.log("registered");
           setRegistrationHandler("Registered");
       });

        client.handle("registrationFailed", function () {
            console.log("registration failed");
            client.disconnect();
        });

        client.handle("incoming", function (reason) {
            console.log("incoming");
            console.log(reason);
            client.answer(reason);
        });

        client.handle("failed", function (reason) {
            console.log("failed: ", reason);
            if (reason.cause === "User Denied Media Access") {
                console.error("Denied Media Access")
            }
        });

        client.handle("ended", function (reason) {
            console.log("ended: ", reason)
            if (reason.originator === "local") {
                delUserData()
                dispatch(actionsStream.deleteAll())
                history.push("/")
                return
            }
            toast.loading("Something went wrong! Restarting")
            setTimeout(() => window.location.reload(), 500);
            // window.location.reload();
        });

        client.handle("streamAdded", function (stream) {
            console.log("stream added")
            console.log(stream);
            if (!stream.local) {
                console.log(stream.getTracks());
            }
            dispatch(actionsStream.add({id: stream.id, kind: stream.kind, local: stream.local, stream: stream}))
            // document.getElementById("media-views").appendChild(createMediaView(stream));
        });

        client.handle("channel", function (stream) {
            console.log("channel ", stream);
            dispatch(actionsStream.add(stream))
        });

        client.handle("streamRemoved", function (stream) {
            console.log("stream removed")
            console.log(stream);

            // removeMediaView(document.getElementById("media-views"), stream);
        });

        client.connect();

        return client;
    }, [userData]);  // eslint-disable-line react-hooks/exhaustive-deps

    const handleOnCall = useCallback(async () => {
        client.call(AsteriskConfig.callNumber)
        // client.toggleMuteAudio();
        // client.toggleMuteVideo();
    }, [props.audioRef, client]);

    const handleOnTerminate = useCallback(async () => {
        try {
            await client.terminate();
            client.disconnect();
            delUserData();
            dispatch(actionsStream.deleteAll());
            history.push("/");
        } catch (e) {
            console.error(e);
        }
    }, [client]);

    const controlSound = useCallback((value) => {
        setSoundOn(value);
        props.audioRef.current.volume = value ? 1 : 0;
    }, []);

    const handleSoundOnToggle = useCallback(() => controlSound(!soundOn), [soundOn]);

    const controlMicrophone = useCallback((value) => {
        setMicrophoneOn(value);
        client.toggleMuteAudio();
    }, [client],);

    const handleMicrophoneOnToggle = useCallback(() => controlMicrophone(!microphoneOn), [microphoneOn]);

    const handleVideoOnToggle = useCallback(() => client.toggleMuteVideo(), [client]);

    return <>
        <audio ref={props.audioRef}/>
        {connected && <Meet audio={props.audioRef} handleVideoToggle={handleVideoOnToggle} handleSoundOnToggle={handleSoundOnToggle} handleMicrophoneOnToggle={handleMicrophoneOnToggle} handleOnTerminate={handleOnTerminate}/>}
        {!connected && <Connection client={client} connectionHandler={SetConnected} registrationState={registrationState} call={handleOnCall}/>}
    </>
}

export default Conference;
