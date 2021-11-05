
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

export function FullScreen(obj) {
    this._obj = obj;
}

FullScreen.prototype.can = function () {
    return !!(document.fullscreenEnabled || document.mozFullScreenEnabled ||
        document.msFullscreenEnabled || document.webkitSupportsFullscreen ||
        document.webkitFullscreenEnabled);
};

FullScreen.prototype.is = function() {
    return !!(document.fullScreen || document.webkitIsFullScreen ||
        document.mozFullScreen || document.msFullscreenElement ||
        document.fullscreenElement);
};

FullScreen.prototype.setData = function(state) {
    this._obj.setAttribute('data-fullscreen', !!state);
};

FullScreen.prototype.exit = function() {
    if (!this.is()) {
        return;
    }

    if (document.exitFullscreen) {
        document.exitFullscreen();
    } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
    } else if (document.webkitCancelFullScreen) {
        document.webkitCancelFullScreen();
    } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
    }

    this.setData(false);
};

function findMediaView(parent, stream) {
    let nodes = parent.childNodes;

    for (let i = 0; i < nodes.length; ++i) {
        if (nodes[i].id == stream.id) {
            return nodes[i];
        }
    }

    return null;
}

// export function createMediaControls(video) {
//     let controls = document.createElement("div");
//     controls.className = "media-controls";
//
//     // If only -webkit-media-controls were fully supported across browsers
//     let audioTracks = video.srcObject.getAudioTracks();
//     if (audioTracks.length > 0) {
//         let muteAudio = document.createElement("input");
//         muteAudio.type = "button";
//         muteAudio.value = "mute audio";
//         muteAudio.className = "audio-btn";
//         muteAudio.setAttribute("state", "unmute");
//         muteAudio.onclick = function() {
//             let state = this.getAttribute("state");
//             this.setAttribute("state", state == "mute" ? "unmute" : "mute");
//             this.value = state + " audio";
//             mute(video.srcObject, {audio: this.getAttribute("state") == "mute"});
//         };
//         controls.appendChild(muteAudio);
//     }
//
//     let videoTracks = video.srcObject.getVideoTracks();
//     if (videoTracks.length > 0) {
//         let muteVideo = document.createElement("input");
//         muteVideo.type = "button";
//         muteVideo.value = "mute video";
//         muteVideo.className = "video-btn";
//         muteVideo.setAttribute("state", "unmute");
//         muteVideo.onclick = function() {
//             let state = this.getAttribute("state");
//             this.setAttribute("state", state == "mute" ? "unmute" : "mute");
//             this.value = state + " video";
//             mute(video.srcObject, {video: this.getAttribute("state") == "mute"});
//         };
//         controls.appendChild(muteVideo);
//
//         if (video.srcObject.local == false) {
//             let fullScreen = document.createElement("input");
//             fullScreen.type = "button";
//             fullScreen.value = "fullscreen";
//             fullScreen.className = "fullScreen-btn";
//             fullScreen.onclick = function() {
//                 this.fullScreen.request();
//             };
//
//             fullScreen.fullScreen = new FullScreen(video);
//             controls.appendChild(fullScreen);
//         }
//     }
//
//     return controls;
// }
//
// export function createMediaView(stream) {
//     let mediaView = document.createElement("div");
//     mediaView.className = "media-view";
//     mediaView.id = stream.id; // Makes it easy to find later
//
//     let videoView = document.createElement("div");
//     let videoOverlay = document.createElement("div");
//     videoOverlay.classname = "media-overlay";
//
//     if (stream.local == false) {
//         let audioTracks = stream.getAudioTracks();
//         let videoTracks = stream.getVideoTracks();
//         let videoText = document.createTextNode("No Media Available");
//         if (audioTracks.length > 0) {
//             videoText = document.createTextNode("Audio Only");
//         } else if (videoTracks.length > 0) {
//             videoText = document.createTextNode("Waiting For Video");
//         }
//         videoOverlay.appendChild(videoText);
//
//         function checkForVideo() {
//             if (video.videoWidth < 10 || video.videoHeight < 10) {
//                 videoView.style.display = 'none';
//                 return;
//             }
//
//             videoOverlay.removeChild(videoText);
//             videoText = document.createTextNode("Remote Video");
//             videoOverlay.appendChild(videoText);
//
//             videoView.style.display = 'inline';
//         }
//
//         setInterval(checkForVideo, 1000);
//     } else {
//         let videoText = document.createTextNode("Local Video");
//         videoOverlay.appendChild(videoText);
//     }
//
//     mediaView.appendChild(videoOverlay);
//
//     let video = document.createElement("video");
//     video.autoplay = true;
//     video.srcObject = stream;
//     video.onloadedmetadata = function() {
//         let tracks = stream.getVideoTracks();
//
//         for (let i = 0; i < tracks.length; ++i) {
//             tracks[i].enabled = true;
//         }
//     };
//
//     // Video elements connected to local streams will by default
//     // echo both the video and the audio back to ourselves. Since
//     // we don't want to hear ourselves we mute it, which mutes only
//     // the audio portion.
//     if (stream.local == true) {
//         video.muted = true;
//     } else {
//         // We hide the video view until we receive video
//         videoView.style.display = 'none';
//     }
//
//     videoView.appendChild(video);
//     mediaView.appendChild(videoView);
//     mediaView.appendChild(createMediaControls(video));
//
//     return mediaView;
// }
//
// export function removeMediaView(parent, stream) {
//     let node = findMediaView(parent, stream);
//     if (node) {
//         parent.removeChild(node);
//     }
// }
