import {CONFERENCE, SOCKET, STREAM} from "./types";

export const connected = (user) => ({type: SOCKET.CONNECTED, payload: user});
export const leave = (user) => ({type: SOCKET.LEAVE, payload: user});
export const endConference = () => ({type: SOCKET.END});
export const toggleMedia = (data) => ({type: SOCKET.TOGGLE_MEDIA, payload: data})

export const newConference = (conference) => ({type: CONFERENCE.NEW, payload: conference});
export const startRecording = () => ({type: CONFERENCE.START_RECORD});

export const actionsStream = {
    add: (stream) => ({type: STREAM.ADD, payload: stream}),
    delete: (id) => ({type: STREAM.DELETE, payload: id}),
    deleteAll: () => ({type: STREAM.DELETE_ALL}),
}
