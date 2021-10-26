import avatar from "../../../images/avatar.svg"

function Participant({user}) {
    return (
        <div className="participant">
            <div className="participant_picture">
                <img src={avatar} alt="user avatar"/>
            </div>
            <p className="participant_name">{user.name}</p>
        </div>
    )
}

export default Participant;
