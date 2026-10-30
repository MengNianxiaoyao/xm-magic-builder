import * as vscode from 'vscode';
import { buildWebviewHtml } from './panel-host';

export function showWelcomePanel(context: vscode.ExtensionContext): void {
    const key = 'xm-magic-builder.welcomed';
    if (context.globalState.get(key, false)) {
        return;
    }
    context.globalState.update(key, true);

    const panel = vscode.window.createWebviewPanel(
        'xm-magic-builder-welcome',
        '欢迎使用 XMSeer 魔法编辑器',
        vscode.ViewColumn.One,
        {
            enableScripts: true,
            retainContextWhenHidden: true,
            localResourceRoots: [
                vscode.Uri.joinPath(context.extensionUri, 'dist'),
                vscode.Uri.joinPath(context.extensionUri, 'resources'),
            ],
        }
    );

    panel.webview.html = buildWebviewHtml(panel.webview, context.extensionUri, 'welcome');
}
