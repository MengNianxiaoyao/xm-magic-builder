import type { ExtensionMessage, WebviewMessage } from '../shared/messages';

interface VsCodeApi {
    postMessage(message: WebviewMessage): void;
    getState<T = unknown>(): T | undefined;
    setState<T>(state: T): T;
}

declare function acquireVsCodeApi(): VsCodeApi;

const api = acquireVsCodeApi();

export function post(message: WebviewMessage): void {
    api.postMessage(message);
}

export function warn(message: string): void {
    api.postMessage({ command: 'show-warning', message });
}

export function onMessage(handler: (message: ExtensionMessage) => void): void {
    window.addEventListener('message', (event: MessageEvent<ExtensionMessage>) => {
        handler(event.data);
    });
}
