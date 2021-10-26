import Participant from "./Participant";
import "./Participants.css";
import {useContext, useState} from "react";
import {ConferenceContext, UserContext} from "../../../context/context";

function Participants() {
    const {conference} = useContext(ConferenceContext);
    const {userData} = useContext(UserContext);
    const [clicked, setClicked] = useState(false);
    let users = [];
    if (!conference) {
        users = []
    } else {
        users = conference.participants.filter(user => user.id !== userData.account.username);
    }
    const link = conference && window.location.origin + "/join/" + conference.id;
    const copyHandler = () => {
        navigator.clipboard.writeText(link)
            .then(() => {
                setClicked(true);
            })
            .catch(() => {
                setClicked(false);
            })
    }

    const nobodyMessage = (
        <div className="nobody-message" onClick={e => copyHandler()}>
            <p>Nobody here ;(</p>
            <p className="button-link">{clicked ? "Link copied to clipboard!" : "Click to copy link and invite!"}</p>
            <p className="link">{link}</p>
        </div>
    )
    return (
        <div className="participants-wrapper">
            {users.length > 0 ? users.map(user => <Participant user={user}/>) : nobodyMessage}
        </div>
    )
}

export default Participants;
