export const API = {
    start: "/conference/start",
    join: id => `/conference/${id}/join`,
    leave: "/conference/leave",
    record: "/conference/record",
    ready: "/conference/ready",
    session: "/session",
    conferenceInfo: "/conference",
}

function setPrefix(prefix, API) {
    for (const property in API) {
        if (API[property] instanceof Function) {
            const tmpFunc = API[property];
            API[property] = (...args) => "/api" + tmpFunc(...args);

            continue;
        }
        API[property] = '/api' + API[property]
    }
}

setPrefix("/api", API)
