import * as vscode from 'vscode';

export abstract class BaseView implements vscode.WebviewViewProvider {
    constructor(protected context: vscode.ExtensionContext) { }

    public webviewView: vscode.WebviewView | undefined;

    resolveWebviewView(webviewView: vscode.WebviewView): void {
        this.webviewView = webviewView;
        webviewView.webview.options = { enableScripts: true };
        webviewView.webview.html = this.getHtml(webviewView);

        webviewView.webview.onDidReceiveMessage((message) => {
            this.handleMessage(message);
        });
    }

    protected getStyleUri(webviewView: vscode.WebviewView): string {
        return webviewView.webview.asWebviewUri(
            vscode.Uri.joinPath(this.context.extensionUri, 'resources', 'styles.css')
        ).toString();
    }

    protected abstract getContent(): string;

    protected handleMessage(message: unknown): void { }

    protected getHtml(webviewView: vscode.WebviewView): string {
        const styleUri = this.getStyleUri(webviewView);
        return `<!DOCTYPE html>
        <html>
        <head>
            <link rel="stylesheet" href="${styleUri}" />
        </head>
        <body>
            ${this.getContent()}
        </body>
        </html>`;
    }
}