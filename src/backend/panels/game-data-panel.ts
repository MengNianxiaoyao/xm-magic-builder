import * as vscode from 'vscode';
import type { GameDataType } from '../../shared/messages';
import type { PanelDescriptor } from '../panel-types';
import { consumeWarning } from '../command-template';
import { handleError } from '../services/error-reporter';
import { getGameDataInfo, searchGameData } from '../services/game-data';
import { checkAndUpdateGameData, onGameDataUpdated } from '../services/game-data-update';

let activeWebview: vscode.WebviewView | undefined;

onGameDataUpdated((info) => {
    if (activeWebview) {
        void activeWebview.webview.postMessage({ command: 'game-data-updated', ...info });
    }
});

export const gameDataPanel: PanelDescriptor = {
    id: 'xm-magic-builder.game-data',
    title: '数据查询',
    actions: [],
    vue: { component: 'game-data' },
    async handleMessage(
        message: Record<string, unknown>,
        webview: vscode.WebviewView,
        context: vscode.ExtensionContext
    ) {
        activeWebview = webview;

        if (consumeWarning(message)) {
            return;
        }

        if (message.command === 'load-game-data-info') {
            try {
                const info = await getGameDataInfo(context);
                await webview.webview.postMessage({ command: 'game-data-info', ...info });
            } catch (error) {
                handleError(error, { view: '数据查询', command: 'load-game-data-info', showMessage: false });
                await webview.webview.postMessage({
                    command: 'game-data-status',
                    state: 'error',
                    message: error instanceof Error ? error.message : String(error),
                });
            }
            return;
        }

        if (message.command === 'check-game-data') {
            const force = message.force === true;
            let terminal = false;
            try {
                const result = await checkAndUpdateGameData(context, {
                    force,
                    onStatus: (state, text) => {
                        if (state === 'updated' || state === 'latest' || state === 'error') {
                            terminal = true;
                        }
                        void webview.webview.postMessage({ command: 'game-data-status', state, message: text });
                    },
                });
                if (result.updated) {
                    void vscode.window.showInformationMessage('游戏数据已更新');
                } else if (force) {
                    void vscode.window.showInformationMessage('游戏数据已是最新');
                }
                if (!terminal) {
                    await webview.webview.postMessage({
                        command: 'game-data-status',
                        state: result.updated ? 'updated' : 'latest',
                    });
                }
            } catch (error) {
                const text = error instanceof Error ? error.message : String(error);
                handleError(error, { view: '数据查询', command: 'check-game-data', showMessage: false });
                if (force) {
                    void vscode.window.showErrorMessage(`游戏数据更新失败：${text}`);
                } else {
                    void vscode.window.showWarningMessage('游戏数据更新失败，继续使用当前数据');
                }
                await webview.webview.postMessage({
                    command: 'game-data-status',
                    state: 'error',
                    message: text,
                });
            }
            return;
        }

        if (message.command !== 'search-game-data') {
            return;
        }

        const kind: GameDataType = message.kind === 'mintmark' ? 'mintmark' : 'monster';
        const query = typeof message.query === 'string' ? message.query : '';

        try {
            const payload = await searchGameData(context, kind, query);
            await webview.webview.postMessage({ command: 'game-data-result', kind, query, ...payload });
        } catch (error) {
            handleError(error, { view: '数据查询', command: 'search-game-data', showMessage: false });
            await webview.webview.postMessage({
                command: 'game-data-error',
                message: error instanceof Error ? error.message : String(error),
            });
        }
    },
};
