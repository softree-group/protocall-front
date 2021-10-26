import {useCallback, useContext, useEffect, useMemo, useRef, useState} from "react";
import Connection from "../Connection/Connection";
import Meet from "../Meet/Meet";
import {SIPClient} from "../../sip/client";
import {SessionState} from "sip.js";
import {UserContext} from "../../context/context";
import {useHistory} from "react-router";
import axios from "axios";
import {API} from "../../backend/api";

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
        const client = new SIPClient("wss://pbx.softex-team.ru:10089/ws");

        client.registrationStateChangeListener = setRegistrationHandler;

        client.invitationListener = async (invitation) => {
            if (callState === SessionState.Established) {
                await client.terminate();
            }

            console.log("INVITE")
            invitation.stateChange.addListener((state) => {
                console.log(props.audioRef.current);
                client.handleMedia(props.audioRef.current, state, invitation);
            });

            try {
                await invitation.accept();
            } catch (e) {
                console.error(e);
            }
        }

        client.callStateChangeListener = handleCallStateChange;

        return client;
    }, []);  // eslint-disable-line react-hooks/exhaustive-deps

    const handleOnCall = useCallback(async () => {
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

    useEffect(() => {
        if (!userData) {
            return;
        }
        const username = userData["account"]["username"];
        const password = userData["account"]["password"];

        (async () => {
            if (!client.initialized) {
                await client.connect(`sip:${username}@pbx.softex-team.ru`, username, password);
                console.log("CLIENT STATE: ", client.lastState);
            }

            if (callState === SessionState.Established || callState === SessionState.Established) {
                await handleOnTerminate();
            }
        })();
    }, [userData]); // eslint-disable-line react-hooks/exhaustive-deps

    return <>
        <audio ref={props.audioRef}/>
        {connected && <Meet handleSoundOnToggle={handleSoundOnToggle} handleMicrophoneOnToggle={handleMicrophoneOnToggle} handleOnTerminate={handleOnTerminate}/>}
        {!connected && <Connection connectionHandler={SetConnected} registrationState={registrationState}/>}
    </>
}

export default Conference;
