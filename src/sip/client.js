import {
    Invitation,
    Inviter,
    Registerer,
    RegistererState,
    Session,
    SessionState,
    SIPExtension,
    UserAgent,
    UserAgentOptions,
} from 'sip.js';

export class SIPClient {
    constructor(sipServer) {
        this.sipServer = sipServer;

        this.remoteAudioElement = null;
        this.userAgent = null;
        this.registerer = null;
        this.currentCall = null;
        this.remoteStream = null;
        this.lastState = null;
        this.callStateChangeListener = null;
        this.registrationStateChangeListener = null;
        this.invitationListener = null;
    }

    async connect(sipUri, sipUsername, sipPassword) {
        const userAgentOptions = {
            authorizationPassword: sipPassword,
            authorizationUsername: sipUsername,
            transportOptions: {
                server: this.sipServer,
            },
            uri: UserAgent.makeURI(sipUri),
            sipExtension100rel: SIPExtension.Supported,
            delegate: {
                onInvite: (invitation) => {
                    this.invitationListener && this.invitationListener(invitation);

                    invitation.stateChange.addListener((state) => {
                        this.callStateChangeListener && this.callStateChangeListener(state);
                    });

                    this.currentCall = invitation;
                },
            },
        };

        this.userAgent = new UserAgent(userAgentOptions);
        this.registerer = new Registerer(this.userAgent);

        this.registerer.stateChange.addListener(async (state) => {
            console.log(`Registration state changed to ${state}`);

            this.registrationStateChangeListener && this.registrationStateChangeListener(state);
        });

        await this.userAgent.start();
        await this.registerer?.register();
    }

    async call(calleeSip, remoteAudioElement) {
        if (!this.userAgent) {
            throw new Error('User agent must be initialized.');
        }

        const target = UserAgent.makeURI(calleeSip);
        this.currentCall = new Inviter(this.userAgent, target, {
            earlyMedia: true,
            inviteWithoutSdp: false,
        });

        this.reportCallStateChange(SessionState.Initial);

        this.currentCall.stateChange.addListener((state) =>
            this.handleMedia(remoteAudioElement, state, this.currentCall),
    );

        await this.currentCall.invite();
    }

    async handleMedia(remoteAudioElement, state, session) {
        console.log(`Session state changed to ${state}`);

        const targetState = session instanceof Invitation ? SessionState.Established : SessionState.Establishing;

        switch (state) {
            case targetState:
                await this.setupRemoteMedia(remoteAudioElement, session);
                break;
            case SessionState.Terminating:
            case SessionState.Terminated:
                this.cleanupMedia();
                break;
            default:
            // Do nothing. This case has no default handler.
        }

        this.reportCallStateChange(state);
    }

    reportCallStateChange(state) {
        this.lastState = state;
        this.callStateChangeListener && this.callStateChangeListener(state);
    }

    async setupRemoteMedia(remoteAudioElement, session) {
        this.remoteStream = new MediaStream();

        if (session.sessionDescriptionHandler) {
            // @ts-ignore
            session.sessionDescriptionHandler.peerConnection.getReceivers().forEach((receiver) => {
                if (receiver.track) {
                    this.remoteStream.addTrack(receiver.track);
                }
            });
        }

        this.remoteAudioElement = remoteAudioElement;
        this.remoteAudioElement.srcObject = this.remoteStream;
        await this.remoteAudioElement.play();
    }

    async terminate() {
        if (this.currentCall instanceof Invitation) {
            await this.currentCall.bye();
        } else if (this.currentCall instanceof Inviter) {
            if (this.currentCall?.state === SessionState.Establishing || this.currentCall?.state === SessionState.Initial) {
                await this.currentCall?.cancel();
            } else if (this.currentCall?.state === SessionState.Established) {
                await this.currentCall?.bye();
            }
        }

        this.cleanupMedia();
    }

    set microphone(value) {
        const connection = this.currentCall?.sessionDescriptionHandler?.peerConnection;

        if (connection) {
            connection.getLocalStreams().forEach((stream) => {
                stream.getAudioTracks().forEach((track) => {
                    track.enabled = value;
                });
            });
        }
    }

    cleanupMedia() {
        if (this.remoteAudioElement) {
            this.remoteAudioElement.srcObject = null;
            this.remoteAudioElement.pause();
        }
    }

    get initialized() {
        return this.userAgent?.isConnected() ?? false;
    }
}
