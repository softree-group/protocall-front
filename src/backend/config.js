export const AsteriskConfig = {
    domain: process.env.REACT_APP_ASTERISK_DOMAIN,
    websocketPort: process.env.REACT_APP_ASTERISK_PORT,
    websocketURL: process.env.REACT_APP_ASTERISK_WEBSOCKET_URL,
    // callNumber: process.env.REACT_APP_DEBUG ? "dev" : "000",
    callNumber: "dev",
}
