declare module '@mux/spaces-web' {
  import { EventEmitter } from 'events';

  export enum TrackKind {
    Audio = 1,
    Video = 2,
  }

  export enum TrackSource {
    Camera = 'camera',
    Microphone = 'microphone',
    Screenshare = 'screenshare',
    ScreenshareAudio = 'screenshareaudio',
    Other = 'other',
  }

  export enum SpaceEvent {
    LocalParticipantReconnected = 'LocalParticipantReconnected',
    LocalParticipantReconnecting = 'LocalParticipantReconnecting',
    LocalParticipantReconnectFailed = 'LocalParticipantReconnectFailed',
    ParticipantJoined = 'ParticipantJoined',
    ParticipantLeft = 'ParticipantLeft',
    ParticipantTrackPublished = 'ParticipantTrackPublished',
    ParticipantTrackUnpublished = 'ParticipantTrackUnpublished',
    ParticipantTrackSubscribed = 'ParticipantTrackSubscribed',
    ParticipantTrackUnsubscribed = 'ParticipantTrackUnsubscribed',
    ParticipantTrackMuted = 'ParticipantTrackMuted',
    ParticipantTrackUnmuted = 'ParticipantTrackUnmuted',
    ActiveSpeakersChanged = 'ActiveSpeakersChanged',
    BroadcastStateChanged = 'BroadcastStateChanged',
    ParticipantCustomEventPublished = 'ParticipantCustomEventPublished',
    ParticipantDisplayNameChanged = 'ParticipantDisplayNameChanged',
  }

  export class Track extends EventEmitter {
    tid: string;
    track?: MediaStreamTrack;
    name: string;
    muted: boolean;
    source: TrackSource;
    height: number;
    width: number;
    kind: TrackKind;
    attachedElements: HTMLMediaElement[];
    isMuted(): boolean;
    getSource(): TrackSource;
    getKind(): TrackKind;
    hasMedia(): boolean;
    attach(element: HTMLMediaElement): HTMLMediaElement;
    attach(): HTMLMediaElement;
    detach(element: HTMLMediaElement): HTMLMediaElement[];
    detach(): HTMLMediaElement[];
  }

  export class LocalTrack extends Track {
    deviceId?: string;
    track: MediaStreamTrack;
    mute(): void;
    unMute(): void;
    stop(): void;
  }

  export class RemoteTrack extends Track {}

  export enum ParticipantRole {
    Publisher = 'publisher',
    Subscriber = 'subscriber',
  }

  export enum ParticipantStatus {
    Connected = 'connected',
    Disconnected = 'disconnected',
  }

  export class LocalParticipant extends EventEmitter {
    id: string;
    connectionId: string;
    audioTracks: Map<string, LocalTrack>;
    videoTracks: Map<string, LocalTrack>;
    role: ParticipantRole;
    displayName: string;
    publishTracks(tracks: LocalTrack[]): Promise<LocalTrack[]>;
    updateTracks(tracks: LocalTrack[]): LocalTrack[];
    unpublishAllTracks(options?: { stop: boolean }): void;
    unpublishTracks(tracks: LocalTrack[], options?: { stop: boolean }): void;
    getVideoTracks(): LocalTrack[];
    getAudioTracks(): LocalTrack[];
    getTracks(): LocalTrack[];
  }

  export class RemoteParticipant extends EventEmitter {
    id: string;
    connectionId: string;
    audioTracks: Map<string, RemoteTrack>;
    videoTracks: Map<string, RemoteTrack>;
    role: ParticipantRole;
    status: ParticipantStatus;
    displayName: string;
    getVideoTracks(): RemoteTrack[];
    getAudioTracks(): RemoteTrack[];
    getTracks(): RemoteTrack[];
    isSubscribed(): boolean;
    subscribe(): Promise<void>;
    unsubscribe(): Promise<void>;
  }

  export interface SpaceOptionsParams {
    [key: string]: any;
  }

  export class Space extends EventEmitter {
    localParticipant?: LocalParticipant;
    broadcasting: boolean;
    jwt: string;
    sessionId?: string;
    constructor(jwt: string, options?: SpaceOptionsParams);
    leave(): void;
    join(): Promise<LocalParticipant>;
    on(event: string, listener: (...args: any[]) => void): this;
    off(event: string, listener: (...args: any[]) => void): this;
    once(event: string, listener: (...args: any[]) => void): this;
    emit(event: string, ...args: any[]): boolean;
  }

  export interface CreateLocalMediaOptions {
    audio?: boolean | { deviceId?: { exact?: string }; name?: string };
    video?: boolean | { deviceId?: { exact?: string }; name?: string };
  }

  export function getUserMedia(options?: CreateLocalMediaOptions): Promise<LocalTrack[]>;
  export function getDisplayMedia(options?: CreateLocalMediaOptions): Promise<LocalTrack[]>;
  export function getLocalTracksFromMediaStream(streamName: string, stream: MediaStream): Promise<LocalTrack[]>;
}
