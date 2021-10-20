import "./Connection.css";
import rocket from "../../images/rocket.svg"
import planet from "../../images/planet.svg"
import {useEffect, useState} from "react";
import axios from "axios";
import {API} from "../../backend/api";

function Connection(props) {
    const [progress, setProgress] = useState(5)
    const wrapperStyle = {
        "bottom": `${progress}%`
    }

    const rocketStyle = {
        "transform": `translate(-50%, 0) scale(${1 - progress/100})`
    }

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
        if (props.registrationState !== "Registered") {
            return
        }
        setProgress(50);
        axios.post(API.ready)
            .then(response => {
                if (response.status !== 200) {
                    console.error(response.status, response.data)
                    return
                }
                done();
            })
            .catch(err => console.error(err))
    }, [props.registrationState])

    const done = () => {
        setProgress(90);
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
