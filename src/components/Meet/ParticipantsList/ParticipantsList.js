import "./ParticipantsList.css"
import ParticipantElement from "./ParticipantElement";
import {toast} from "react-hot-toast";
import {useSelector} from "react-redux";

export default function ParticipantsList() {

    const participants = useSelector(state => state.conference.participants);
    const conferenceID = useSelector(state => state.conference.id);
    const link = conferenceID && window.location.origin + "/join/" + conferenceID;

    const copyHandler = () => {
        navigator.clipboard.writeText(link)
            .catch(reason => toast.error("Fail copy: ", reason))
            .then(() => toast.success("Invite link copied!"));
    }

    const clickHandler = (e) => {
       e.stopPropagation();
    }

    return (
        <div className="participants-list" onClick={clickHandler}>
            <div className="participant-list-container">
                {participants.map(user => <ParticipantElement username={user.name} key={user.id}/>)}
            </div>
            <div className="participant-list_control-container">
                <div className="participant-list_button" onClick={copyHandler}>Copy invite link</div>
            </div>
        </div>
    );
}
