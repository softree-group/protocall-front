import {Web} from "sip.js"
import {useEffect, useMemo, useState} from "react";
import {getAudioElement} from "../../utils";
import {SIPClient} from "../../sip/client";
import PhoneAuth from "./Auth/PhoneAuth";


function Phone() {
    const [options, setOptions] = useState({});
    const [registrationState, setRegistrationHandler] = useState(null)
    const [callState, setCallState] = useState(null)
    const client = useMemo(() => {
        const sipClient = new SIPClient("wss://pbx.softex-team.ru:10089/ws");

        sipClient.registrationStateChangeListener = registrationState;


        return sipClient;
    }, [])

    useEffect(() => {
        const username = options["username"];
        const password = options["password"];
    }, [options])

    return (
        <div className="block">
            {!options && <PhoneAuth optionsHandler={setOptions}/>}
            {options && <>
                            <div className="phone-timer">00:00</div>
                            <div className="phone-control">
                                <div>Start</div>
                                <div>Stop</div>
                            </div>
                        </>
            }

        </div>
    );
}

export default Phone;
