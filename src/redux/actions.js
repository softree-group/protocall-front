import {CONFERENCE, SOCKET} from "./types";

export const connected = (user) => ({type: SOCKET.CONNECTED, payload: user});
export const leave = (user) => ({type: SOCKET.LEAVE, payload: user});
export const endConference = () => ({type: SOCKET.END});

export const newConference = (conference) => ({type: CONFERENCE.NEW, payload: conference});
export const startRecording = () => ({type: CONFERENCE.START_RECORD});
