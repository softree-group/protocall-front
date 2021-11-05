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

function Conference(props) {
    const [connected, SetConnected] = useState(false);
    const [soundOn, setSoundOn] = useState(true);
    const [microphoneOn, setMicrophoneOn] = useState(true);
    const [registrationState, setRegistrationHandler] = useState(null)
    const [callState, setCallState] = useState(null)
    const [startedTime, setCallStartedTime] = useState(null)

    const {userData, delUserData} = useContext(UserContext);
    const history = useHistory();

    if (!userData) {
        console.log("REDIRECT", userData)
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
        const client = new CyberMegaPhone(username,username, password, "pbx.softex-team.ru", true);

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
            console.log("failed");
        });

        client.handle("ended", function (reason) {
            console.log("ended");
        });

        client.handle("streamAdded", function (stream) {
            console.log("stream added")
            console.log(stream);
            // document.getElementById("media-views").appendChild(createMediaView(stream));
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
    }, [props.audioRef, client]);

    const handleOnTerminate = useCallback(async () => {
        try {
            await client.terminate();
            delUserData();
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
        client.microphone = value;
    }, [client],);

    const handleMicrophoneOnToggle = useCallback(() => controlMicrophone(!microphoneOn), [microphoneOn]);

    // useEffect(() => {
    //     if (!userData) {
    //         return;
    //     }
    //     const username = userData["account"]["username"];
    //     const password = userData["account"]["password"];
    //
    //     (async () => {
    //         if (!client.initialized) {
    //             await client.connect(`sip:${username}@pbx.softex-team.ru`, username, password);
    //             console.log("CLIENT STATE: ", client.lastState);
    //         }
    //
    //         if (callState === SessionState.Established || callState === SessionState.Established) {
    //             await handleOnTerminate();
    //         }
    //     })();
    // }, [userData]); // eslint-disable-line react-hooks/exhaustive-deps

    return <>
        <audio ref={props.audioRef}/>
        {connected && <Meet handleSoundOnToggle={handleSoundOnToggle} handleMicrophoneOnToggle={handleMicrophoneOnToggle} handleOnTerminate={handleOnTerminate}/>}
        {!connected && <Connection connectionHandler={SetConnected} registrationState={registrationState} call={handleOnCall}/>}
    </>
}

export default Conference;
