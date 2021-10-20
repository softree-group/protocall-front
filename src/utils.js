
export const inputChangeHandler = (event, stateHandler, localStorageKey) => {
    event.persist();
    stateHandler(prev => {
        const newState = {...prev, [event.target.name]: event.target.value};
        if (localStorageKey) {
            localStorage.setItem(localStorageKey, JSON.stringify(newState));
        }
        return newState;
    })
}

export const getAudioElement = () => {
    const el = document.getElementById("remoteAudio");
    if (!(el instanceof HTMLAudioElement)) {
        throw new Error(`Element "remoteAudio" not found or not an audio element.`);
    }
    return el;
}
