import {API} from "./api";
import axios from "axios";
import {toast} from "react-hot-toast";

export const startHandler = (e, history, formData, setUserData) => {
    e.preventDefault();
    formData["need_protocol"] = true;
    formData["title"] = formData["title"] ? formData["title"] : `${formData["name"]}'s meeting`
    axios.post(API.start, formData)
        .then(response => {
            if (response.status !== 200 && response.status !== 208) {
                toast.error("Cannot start, sorry :(")
                console.error("Error connection: ", response.status);
                return null;
            }
            setUserData(response.data);
            history.push('/meet');
        })
        .catch(err => toast.error("Cannot start, sorry :("));
};

export const joinHandler = (e, history, formData, setUserData) => {
    e.preventDefault();
    axios.post(API.join(formData["meetID"]), formData)
        .then(response => {
            if (response.status !== 200 && response.status !== 208) {
                toast.error("Cannot join, sorry :(")
                console.error("Error connection: ", response.status);
                return null
            }
            setUserData(response.data);
            history.push('/meet');
        })
        .catch(err => toast.error("Cannot join, sorry :("))
}
