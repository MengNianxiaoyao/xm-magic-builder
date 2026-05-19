import * as vscode from 'vscode';
import { handleError } from '../utils/errorHandler';

export abstract class BaseView implements vscode.WebviewViewProvider {
    constructor(protected context: vscode.ExtensionContext) {}

    public webviewView: vscode.WebviewView | undefined;

    resolveWebviewView(webviewView: vscode.WebviewView): void {
        this.webviewView = webviewView;
        webviewView.webview.options = { enableScripts: true };
        webviewView.webview.html = this.getHtml(webviewView);

        webviewView.webview.onDidReceiveMessage(async (message) => {
            try {
                await this.handleMessage(message);
            } catch (error) {
                handleError(error, {
                    view: this.getViewModelName(),
                    command: message?.command,
                });
            }
        });
    }

    protected getStyleUri(webviewView: vscode.WebviewView): string {
        return webviewView.webview
            .asWebviewUri(
                vscode.Uri.joinPath(
                    this.context.extensionUri,
                    'resources',
                    'styles.css'
                )
            )
            .toString();
    }

    private getScriptUri(
        webviewView: vscode.WebviewView,
        relativePath: string
    ): string {
        return webviewView.webview
            .asWebviewUri(
                vscode.Uri.joinPath(this.context.extensionUri, relativePath)
            )
            .toString();
    }

    protected getScriptPaths(): string[] {
        return [];
    }

    protected getDataScript(): string {
        return '';
    }

    protected abstract getContent(): string;

    protected getViewModelName(): string {
        return this.constructor.name;
    }

    protected handleMessage(_message: unknown): void | Promise<void> {}

    protected getHtml(webviewView: vscode.WebviewView): string {
        const styleUri = this.getStyleUri(webviewView);
        const dataScript = this.getDataScript();
        const scriptTags = this.getScriptPaths()
            .map((path) => {
                const uri = this.getScriptUri(webviewView, path);
                return `<script src="${uri}"></script>`;
            })
            .join('\n');

        return `<!DOCTYPE html>
        <html>
            <head>
                <link rel="stylesheet" href="${styleUri}" />
            </head>
            <body>
                ${this.getContent()}
                ${dataScript}
                ${scriptTags}
            </body>
        </html>`;
    }
}
