import {CONFERENCE, SOCKET} from "../types";

const initialState = {
    id: null,
    participants: [],
    is_recording: false,
    started_at: null
}

const defaultMediaMuted = {
    audioMuted: true,
    videoMuted: true,
}

export const conferenceReducer = (state = initialState, action) => {
    switch (action.type) {
        case SOCKET.TOGGLE_MEDIA:
            const foundIdx = state.participants.findIndex(user => user.id === action.payload.user)
            if (foundIdx === -1) {
                return state;
            }
            const [found] = state.participants.splice(foundIdx, 1);
            return {...state, participants: [...state.participants, {...found, ...action.payload.options}]};
        case SOCKET.CONNECTED:
            const foundIndex = state.participants.findIndex(user => user.id === action.payload.id)
            if (foundIndex !== -1) {
                const [found] = state.participants.splice(foundIndex, 1);
                return {...state, participants: [...state.participants, {...action.payload, ...defaultMediaMuted}]}
            }
            return {...state, participants: [...state.participants, {...action.payload, ...defaultMediaMuted}]}
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
