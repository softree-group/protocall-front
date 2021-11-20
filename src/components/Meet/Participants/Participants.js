import Participant from "./Participant";
import "./Participants.css";
import {useContext, useState} from "react";
import {ConferenceContext, UserContext} from "../../../context/context";
import {useSelector} from "react-redux";
import Audio from "../Audio";

function Participants() {
    const {userData} = useContext(UserContext);
    const [clicked, setClicked] = useState(false);
    const participants = useSelector(state => state.conference.participants);
    const streams = useSelector(state => state.stream.remote);
    const users = participants.filter(user => user.id !== userData.account.username);
    const conferenceID = useSelector(state => state.conference.id);
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

    const getStreamForChannel = (channel) => {
        console.log("get for channel ", channel);
        const [found] = streams.filter(stream => stream.channel === channel)
        console.log("FOUND: ", found)
        return found ? found.stream : null;
    }

    let tracks = [];
    for (let idx = 0; idx < streams.length; idx++) {
        if (!streams[idx].stream) {
            continue;
        }
        tracks = [...tracks, ...streams[idx].stream.getAudioTracks()];
        console.log("TRACKS: ", tracks)
    }

    const nobodyMessage = (
        <div className="nobody-message" onClick={e => copyHandler()}>
            {tracks.map(track => <Audio track={track} key={track.id}/>)}
            <p>Nobody here ;(</p>
            <p className="button-link">{clicked ? "Link copied to clipboard!" : "Click to copy link and invite!"}</p>
            <p className="link">{link}</p>
        </div>
    )
    return (
        <div className="participants-wrapper">
            {tracks.map(track => <Audio track={track} key={track.id}/>)}
            {users.length > 0 ? users.map(user => <Participant user={{...user, stream: getStreamForChannel(user.channel)}}/>) : nobodyMessage}
        </div>
    )
}

export default Participants;
