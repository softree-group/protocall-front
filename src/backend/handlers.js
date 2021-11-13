import {API} from "./api";
import axios from "axios";

export const startHandler = (e, history, formData, setUserData) => {
    e.preventDefault();
    formData["need_protocol"] = true;
    axios.post(API.start, formData)
        .then(response => {
            if (response.status !== 200 && response.status !== 208) {
                console.error("Error connection: ", response.status);
                return null;
            }
            setUserData(response.data);
            history.push('/meet');
        })
        .catch(err => console.log(err))
};

export const joinHandler = (e, history, formData, setUserData) => {
    e.preventDefault();
    axios.post(API.join(formData["meetID"]), formData)
        .then(response => {
            if (response.status !== 200 && response.status !== 208) {
                console.error("Error connection: ", response.status);
                return null
            }
            setUserData(response.data);
            history.push('/meet');
        })
        .catch(err => console.log(err))
}
