import {CONFERENCE, SOCKET} from "../types";

const initialState = {
    "id": null,
    "participants": [],
    "is_recording": false,
    "started_at": null
}

export const conferenceReducer = (state = initialState, action) => {
    switch (action.type) {
        case SOCKET.CONNECTED:
            const found = state.participants.findIndex(user => user.id === action.payload.id)
            console.log("FOUND", found);
            if (found !== -1) {
                return state;
            }
            return {...state, participants: [...state.participants, action.payload]}
        case SOCKET.LEAVE:
            return {...state, participants: state.participants.filter(user => user.id !== action.payload.id)}
        case CONFERENCE.NEW:
            return action.payload;
        case CONFERENCE.START_RECORD:
            return {...state, is_recording: true};
        case SOCKET.END:
            return initialState;
        default:
            return state;
    }
}