import "./Main.css";
import rocket from "../../images/rocket.svg";
import planet from "../../images/planet.svg";
import {useContext, useState} from "react";
import {UserContext} from "../../context/context";
import StartForm from "./StartForm";
import {joinHandler, startHandler} from "../../backend/handlers";
import JoinForm from "./JoinForm";

function calcButtonClass(choice) {
    switch (choice) {
        case null:
            return ["", ""];
        case "start":
            return [" full", " none"];
        case "join":
            return [" none", " full"];
        default:
            return ["", ""];
    }
}


function Main(props) {
    const [choice, setChoice] = useState(null)
    const localUserData = JSON.parse(localStorage.getItem("user"))

    const {userData, setUserData} = useContext(UserContext);

    if (userData) {
        props.history.push("/meet");
    }

    let [startButtonClassName, joinButtonClassName] = calcButtonClass(choice);

    return (
        <div className="main-page_wrapper" onClick={e => {setChoice(null)}}>
            <img className="background-rocket" src={rocket} alt="rocket"/>
            <div className="logo">Protocall</div>
            <div className="main-page_control">
                <div className={"main-page_button-wrapper start" + startButtonClassName} onClick={e => {
                    e.stopPropagation()
                    setChoice("start")
                }}>
                    <div className={"button" + (choice === "start" ? " hidden" : "")}>
                        <img src={rocket} alt="rocket"/>
                        <p>Start meeting</p>
                    </div>
                    <div className={"action-form start" + (choice === "start" ? "" : " hidden")}>
                        <StartForm initData={localUserData} submitHandler={(e, formData) => startHandler(e, props.history, formData, setUserData)}/>
                    </div>
                </div>
                <div className={"main-page_button-wrapper join" + joinButtonClassName} onClick={e => {
                    e.stopPropagation()
                    setChoice("join")
                }}>
                    <div className={"button" + (choice === "join" ? " hidden" : "")}>
                        <img src={planet} alt="planet"/>
                        <p>Join meeting</p>
                    </div>
                    <div className={"action-form join" + (choice === "join" ? "" : " hidden")}>
                        <JoinForm initData={localUserData} submitHandler={(e, formData) => joinHandler(e, props.history, formData, setUserData)}/>
                    </div>
                </div>
            </div>
        </div>);
}

export default Main;
