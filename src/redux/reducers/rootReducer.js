import {combineReducers} from "redux";
import {conferenceReducer} from "./conferenceReducer";

export const rootReducer = combineReducers({
    conference: conferenceReducer,
});
