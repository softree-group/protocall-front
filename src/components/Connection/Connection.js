import "./Connection.css";
import rocket from "../../images/rocket.svg"
import planet from "../../images/planet.svg"
import {useContext, useEffect, useState} from "react";
import axios from "axios";
import {API} from "../../backend/api";
import Centrifuge from "centrifuge";
import {UserContext} from "../../context/context";
import {useHistory} from "react-router";

function Connection(props) {
    const [progress, setProgress] = useState(5);
    const [centConnected, setCentConnected] = useState(false);

    const {userData, delUserData} = useContext(UserContext);
    const history = useHistory();

    const wrapperStyle = {
        "bottom": `${progress}%`
    }

    const rocketStyle = {
        "transform": `translate(-50%, 0) scale(${1 - progress/100})`
    }


    const eventHandler = (data) => {
        switch (data.event) {
            case "ready":
                done();
                break;
            case "fail":
                delUserData();
                console.error("fail to connect: ", data.message)
                history.push("/");
                break;
            default:
                console.warn("unexpected event: ", data.event)
        }
    }

    useEffect(() => {
        if (userData === null) {
            return;
        }
        const centrifuge = new Centrifuge("wss://" + window.location.host + "/connection/websocket")
        centrifuge.setToken(userData["cent_token"]);

        centrifuge.on('connect', function(ctx) {
            console.log("connected", ctx);
            setCentConnected(true);
        });

        centrifuge.on('disconnect', function(ctx) {
            console.log("disconnected", ctx);
        });

        centrifuge.subscribe("notify#" + userData.account.username, function(ctx) {
            eventHandler(ctx.data)
        });

        centrifuge.connect();
        return () => centrifuge.disconnect()
    }, [userData]);

    useEffect(() => {
       const timer = setInterval(() => {
           if (progress >= 90) {
               setProgress(5);
               return;
           }
           setProgress(progress + 1);
       }, 1000);

       return () => clearInterval(timer);
    });

    useEffect(() => {
        if (props.registrationState !== "Registered" || !centConnected) {
            return
        }
        setProgress(50);
        props.call();
    }, [props.registrationState, centConnected])

    const done = () => {
        setProgress(90);
        props.client.toggleMuteAudio();
        props.client.toggleMuteVideo();
        setTimeout(() => {
            props.connectionHandler(true);
        }, 500)
    }

    return (
        <div className="main-page_wrapper">
            <div className="art">
                <div className="wrapper" style={wrapperStyle}>
                    <img id="planet" src={planet} alt="planet"/>
                    <div className="dotted"/>
                    <img style={rocketStyle} id="rocket" src={rocket} alt="rocket"/>
                </div>
                <p onClick={() => done()} >Connecting...</p>
            </div>
        </div>
        )

}

export default Connection;
