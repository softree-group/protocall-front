import "./joinForm.css";
import {inputChangeHandler} from "../../utils";
import {useState} from "react";

function JoinForm({initData, submitHandler, meetIDByUser}) {
    const [formData, setFormData] = useState(initData ? initData : {
        "name": "",
        "email": "",
        "meetID": "",
    });

    const [needProtocol, setNeedProtocol] = useState(false);

    formData["need_protocol"] = needProtocol;

    return (
        <form className="action-form_form join" onSubmit={e => submitHandler(e, formData)}>
            <p className="action-form_title">Join meeting</p>
            <div className="form-input">
                <p className="label">Your name</p>
                <input type="text" defaultValue={formData["name"]} required={true} name="name"  onChange={e => inputChangeHandler(e, setFormData, "user")}/>
            </div>
            <div className="form-input" style={meetIDByUser ? {"display": "none"} : {}}>
                <p className="label">MeetID</p>
                <input type="text" defaultValue={formData["meetID"]} required={true} name="meetID" onChange={e => inputChangeHandler(e, setFormData, )}/>
            </div>
            <div className="form-input checkbox">
                <p className="label">Need protocol after call</p>
                <input type="checkbox" checked={needProtocol} onClick={e => setNeedProtocol(!needProtocol)}/>
            </div>
            <div className="form-input" style={needProtocol ? {} : {"display": "none"}}>
                <p className="label">Your email</p>
                <input type="email" defaultValue={formData["email"]} required={false} name="email"  onChange={e => inputChangeHandler(e, setFormData, "user")}/>
                <p className="hint">for getting protocol after call</p>
            </div>
            <input type="submit" value="Start"/>
        </form>
    );
}

export default JoinForm;
