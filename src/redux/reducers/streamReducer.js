import {STREAM} from "../types";

const initialState = {
    local: {
        video: null,
        audio: null,
    },
    remote: []
}

export const streamReducer = (state = initialState, action) => {
    switch (action.type) {
        case STREAM.ADD:
            if (action.payload.local) {
                if (action.payload.kind === "video") {
                    return {...state, local: {...state.local, video: action.payload}};
                }
                return {...state, local: {...state.local, audio: action.payload}};
            }

            let remotes = state.remote;
            let streamIdx = remotes.findIndex(stream => stream.id === action.payload.id);
            if (streamIdx === -1) {
                return {...state, remote: [...state.remote, action.payload]};
            }

            const [found] = remotes.splice(streamIdx, 1);
            return {...state, remote: [...remotes, {...found, ...action.payload}]};
        case STREAM.DELETE_ALL:
            return initialState;
        default:
            return state;
    }
}
