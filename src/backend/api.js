export const API = {
    start: "/conference/start",
    join: id => `/conference/${id}/join`,
    leave: "/conference/leave",
    record: "/conference/record",
    ready: "/conference/ready"
}

function setPrefix(prefix, API) {
    for (const property in API) {
        if (API[property] instanceof Function) {
            API[property] = (...args) => '/api' + API[property](...args)
        }
        API[property] = '/api' + API[property]
    }
}

setPrefix("/api", API)
