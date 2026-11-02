import { watch } from 'vue';
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

type Persistable = { value: unknown };

function clone<T>(value: T): T {
    return value === undefined ? value : (JSON.parse(JSON.stringify(value)) as T);
}

let resetHandler: (() => void) | null = null;

/** 侧边栏收起/展开会重建 webview，用 setState 保留表单状态。 */
export function usePersistedRefs(refs: Record<string, Persistable>): void {
    const defaults: Record<string, unknown> = {};
    for (const [key, ref] of Object.entries(refs)) {
        defaults[key] = clone(ref.value);
    }

    const saved = api.getState<Record<string, unknown>>();
    if (saved) {
        for (const [key, ref] of Object.entries(refs)) {
            if (Object.prototype.hasOwnProperty.call(saved, key)) {
                ref.value = saved[key];
            }
        }
    }

    resetHandler = () => {
        api.setState({});
        for (const [key, ref] of Object.entries(refs)) {
            ref.value = clone(defaults[key]);
        }
    };

    watch(
        () => Object.fromEntries(Object.entries(refs).map(([key, ref]) => [key, ref.value])),
        (value) => api.setState(value),
        { deep: true }
    );
}

export function resetCurrentPanel(): void {
    if (resetHandler) {
        resetHandler();
        return;
    }
    api.setState({});
    window.location.reload();
}
