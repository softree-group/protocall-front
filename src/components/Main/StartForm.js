import {inputChangeHandler} from "../../utils";
import {useState} from "react";

function StartForm({initData, submitHandler}) {
    const [formData, setFormData] = useState(initData ? initData : {
        "name": "",
        "email": ""
    });

    return (
        <form className="action-form_form" onSubmit={e => submitHandler(e, formData)}>
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
    );
}

export default StartForm;
