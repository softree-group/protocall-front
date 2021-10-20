import "./Main.css";
import rocket from "../../images/rocket.svg";
import planet from "../../images/planet.svg";
import {useContext, useState} from "react";
import axios from "axios";
import {inputChangeHandler} from "../../utils";
import {API} from "../../backend/api";
import {UserContext} from "../../context/userContext";

function Main(props) {
    const [choice, setChoice] = useState(null)
    const localUserData = JSON.parse(localStorage.getItem("user"))
    const [formData, setFormData] = useState(localUserData ? localUserData : {
        "name": "",
        "email": ""
    });

    const {userData, setUserData} = useContext(UserContext);

    if (userData) {
        props.history.push("/meet");
    }

    let startButtonClassName = "";
    let joinButtonClassName = "";
    if (choice) {
        if (choice === "start") {
            startButtonClassName = " full";
            joinButtonClassName = " none";
        } else {
            startButtonClassName = " none";
            joinButtonClassName = " full";
        }
    }

    const submitHandler = (e, type) => {
        e.preventDefault();
        let url = "";
        if (type === "start") {
            url = API.start;
        } else {
            const {meetID} = formData;
            url = API.join(meetID)
        }
        axios.post(url, formData)
            .then(response => {
                if (response.status !== 200 && response.status !== 208) {
                    console.error("Error connection: ", response.status);
                    return null
                }
                console.log("Response: ", response.data);
                setUserData(response.data);
                console.log("USER", userData);
                props.history.push('/meet');
            })
            .catch(err => console.log(err))
    }

    return (
        <div className="main-page_wrapper" onClick={e => {setChoice(null)}}>
            <img className="background-rocket" src={rocket} alt="rocket"/>
            <div className="main-page_log-in-button">Log in</div>
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
                        <form className="action-form_form" onSubmit={e => submitHandler(e, "start")}>
                            <p className="action-form_title">Start meeting</p>
                            <div className="form-input">
                                <p className="label">Your name</p>
                                <input type="text" defaultValue={formData["name"]} required={true} name="name" onChange={e => inputChangeHandler(e, setFormData, "user")}/>
                            </div>
                            <div className="form-input">
                                <p className="label">Your email</p>
                                <input type="email" defaultValue={formData["email"]} required={false} name="email"  onChange={e => inputChangeHandler(e, setFormData, "user")}/>
                                <p className="hint">for getting protocol after call</p>
                            </div>
                            <input type="submit" value="Start"/>
                        </form>
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
                        <form className="action-form_form join" onSubmit={e => submitHandler(e, "join")}>
                            <p className="action-form_title">Join meeting</p>
                            <div className="form-input">
                                <p className="label">Your name</p>
                                <input type="text" defaultValue={formData["name"]} required={true} name="name"  onChange={e => inputChangeHandler(e, setFormData, "user")}/>
                            </div>
                            <div className="form-input">
                                <p className="label">MeetID</p>
                                <input type="text" required={true} name="meetID"  onChange={e => inputChangeHandler(e, setFormData, )}/>
                            </div>
                            <div className="form-input">
                                <p className="label">Your email</p>
                                <input type="email" defaultValue={formData["email"]} required={false} name="email"  onChange={e => inputChangeHandler(e, setFormData, "user")}/>
                                <p className="hint">for getting protocol after call</p>
                            </div>
                            <input type="submit" value="Start"/>
                        </form>
                    </div>
                </div>
            </div>
        </div>);
}

export default Main;
