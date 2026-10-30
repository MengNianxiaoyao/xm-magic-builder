import * as vscode from 'vscode';
import type { ActionDescriptor, PanelDescriptor } from './panel-types';
import { handleError } from './services/error-reporter';
import { checkXmFile, insertText } from './services/text-editor';

export function buildWebviewHtml(webview: vscode.Webview, extensionUri: vscode.Uri, component: string): string {
    const nonce = getNonce();
    const styleUri = webview.asWebviewUri(vscode.Uri.joinPath(extensionUri, 'dist', 'webview', 'main.css')).toString();
    const scriptUri = webview.asWebviewUri(vscode.Uri.joinPath(extensionUri, 'dist', 'webview', 'main.js')).toString();

    return `<!DOCTYPE html>
    <html>
        <head>
            <meta charset="UTF-8" />
            <meta
                http-equiv="Content-Security-Policy"
                content="default-src 'none'; img-src ${webview.cspSource} data:; style-src ${webview.cspSource} 'unsafe-inline'; script-src 'nonce-${nonce}' ${webview.cspSource};"
            />
            <link rel="stylesheet" href="${styleUri}" />
        </head>
        <body>
            <div id="app" data-panel="${component}"></div>
            <script nonce="${nonce}" src="${scriptUri}"></script>
        </body>
    </html>`;
}

function getNonce(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let text = '';
    for (let i = 0; i < 32; i++) {
        text += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return text;
}

export class PanelHost implements vscode.WebviewViewProvider {
    private _view: vscode.WebviewView | undefined;

    constructor(
        private context: vscode.ExtensionContext,
        private panel: PanelDescriptor
    ) {}

    resolveWebviewView(webviewView: vscode.WebviewView): void {
        this._view = webviewView;
        webviewView.webview.options = { enableScripts: true };
        webviewView.webview.html = buildWebviewHtml(
            webviewView.webview,
            this.context.extensionUri,
            this.panel.vue.component
        );

        webviewView.webview.onDidReceiveMessage(async (message: Record<string, unknown>) => {
            try {
                if (this.panel.handleMessage) {
                    await this.panel.handleMessage(message, this.context, webviewView);
                } else {
                    this.handleGenericMessage(message);
                }
            } catch (error) {
                handleError(error, {
                    view: this.panel.title,
                    command: message?.command as string | undefined,
                });
            }
        });
    }

    refresh(): void {
        if (this.panel.onRefresh && this._view) {
            this._view.webview.postMessage(this.panel.onRefresh(this.context));
        }
    }

    private handleGenericMessage(message: Record<string, unknown>): void {
        if (!checkXmFile()) {
            return;
        }

        for (const action of this.panel.actions) {
            if (message.command === action.command) {
                this.handleTemplateAction(action, message);
                return;
            }
        }
    }

    private handleTemplateAction(action: ActionDescriptor, message: Record<string, unknown>): void {
        const tmpl =
            action.condition && action.elseTemplate && !message[action.condition]
                ? action.elseTemplate
                : action.template;
        const output = tmpl.replace(/\$\{(\w+)\}/g, (_: string, key: string) => (message[key] as string) ?? '');
        void insertText(output);
    }
}
