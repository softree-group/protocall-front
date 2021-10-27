import Participant from "./Participant";
import "./Participants.css";
import {useContext, useState} from "react";
import {ConferenceContext, UserContext} from "../../../context/context";
import {useSelector} from "react-redux";

function Participants() {
    const {userData} = useContext(UserContext);
    const [clicked, setClicked] = useState(false);
    const participants = useSelector(state => state.conference.participants);
    const conferenceID = useSelector(state => state.conference.id);
    const users = participants.filter(user => user.id !== userData.account.username);
    const link = conferenceID && window.location.origin + "/join/" + conferenceID;
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
