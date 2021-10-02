
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
