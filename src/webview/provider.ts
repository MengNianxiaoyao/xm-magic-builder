import * as vscode from 'vscode';
import type { PanelDescriptor, ActionDescriptor } from '../shared/types';
import { renderFieldsWrap } from './renderer';
import { handleError } from '../services/error-handler';
import { checkXmFile, insertText } from '../services/editor';

export class GenericPanelProvider implements vscode.WebviewViewProvider {
    private _view: vscode.WebviewView | undefined;

    constructor(
        private context: vscode.ExtensionContext,
        private panel: PanelDescriptor
    ) {}

    get webviewView(): vscode.WebviewView | undefined {
        return this._view;
    }

    resolveWebviewView(webviewView: vscode.WebviewView): void {
        this._view = webviewView;
        webviewView.webview.options = { enableScripts: true };
        webviewView.webview.html = this.buildHtml(webviewView);

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
                if (action.template) {
                    this.handleTemplateAction(action, message);
                }
                return;
            }
        }
    }

    private handleTemplateAction(action: ActionDescriptor, message: Record<string, unknown>): void {
        let tmpl = action.template!;
        if (action.condition && action.elseTemplate && !message[action.condition]) {
            tmpl = action.elseTemplate;
        }
        const output = tmpl.replace(/\$\{(\w+)\}/g, (_: string, key: string) => (message[key] as string) ?? '');
        void insertText(output);
    }

    private buildHtml(webviewView: vscode.WebviewView): string {
        const styleUri = webviewView.webview
            .asWebviewUri(vscode.Uri.joinPath(this.context.extensionUri, 'resources', 'styles.css'))
            .toString();

        const scriptTags = (this.panel.scripts || [])
            .map((path) => {
                const uri = webviewView.webview
                    .asWebviewUri(vscode.Uri.joinPath(this.context.extensionUri, path))
                    .toString();
                return `<script src="${uri}"></script>`;
            })
            .join('\n');

        const dataScript = this.panel.dataInject ? this.panel.dataInject() : '';

        const content = this.panel.getHtml
            ? this.panel.getHtml()
            : renderFieldsWrap(this.panel.fields, this.panel.actions, this.panel.buttonRowStyle);

        return `<!DOCTYPE html>
        <html>
            <head>
                <link rel="stylesheet" href="${styleUri}" />
            </head>
            <body>
                ${content}
                ${dataScript}
                ${scriptTags}
            </body>
        </html>`;
    }
}
