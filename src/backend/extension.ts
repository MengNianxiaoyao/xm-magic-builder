import * as vscode from 'vscode';
import { registerPanels } from './panel-registry';
import { registerCompletionProvider, disposeCompletion } from './language/completion';
import { registerFormatter } from './language/formatter';
import { showWelcomePanel } from './welcome-panel';
import { handleError } from './services/error-reporter';
import { checkAndUpdateGameData } from './services/game-data-update';

export function activate(context: vscode.ExtensionContext) {
    registerPanels(context);
    registerCompletionProvider(context);
    registerFormatter(context);
    showWelcomePanel(context);

    context.subscriptions.push(
        vscode.commands.registerCommand('xm-magic-builder.update-game-data', () => updateGameData(context))
    );
}

async function updateGameData(context: vscode.ExtensionContext): Promise<void> {
    try {
        const result = await checkAndUpdateGameData(context, { force: true });

        if (result.updated) {
            void vscode.window.showInformationMessage('游戏数据已更新');
        } else {
            void vscode.window.showInformationMessage('游戏数据已是最新');
        }
    } catch (error) {
        handleError(error, { view: '游戏数据', command: 'update-game-data' });
    }
}

export function deactivate() {
    disposeCompletion();
}
