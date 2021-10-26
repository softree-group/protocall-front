import rocket from "../../images/rocket.svg";
import {joinHandler, startHandler} from "../../backend/handlers";
import JoinForm from "../Main/JoinForm";
import {useHistory, useParams} from "react-router";
import {useContext} from "react";
import {UserContext} from "../../context/context";

function Join() {
    let localUserData = JSON.parse(localStorage.getItem("user"))
    if (!localUserData) {
        localUserData = {};
    }
    const {meetID} = useParams();
    localUserData["meetID"] = meetID;

    console.log(localUserData);

    const history = useHistory();
    const {setUserData} = useContext(UserContext);

    return (
        <div className="main-page_wrapper">
            <img className="background-rocket" src={rocket} alt="rocket"/>
            <div className="logo">Protocall</div>
            <div className="main-page_control">
                <div className={"main-page_button-wrapper join full"}>
                    <div className={"action-form join"}>
                        <JoinForm meetIDByUser={true} initData={localUserData} submitHandler={(e, formData) => joinHandler(e, history, formData, setUserData)}/>
                    </div>
                </div>
            </div>
        </div>);
}

export default Join;
