import {combineReducers} from "redux";
import {conferenceReducer} from "./conferenceReducer";
import {streamReducer} from "./streamReducer";

export const rootReducer = combineReducers({
    conference: conferenceReducer,
    stream: streamReducer,
});
