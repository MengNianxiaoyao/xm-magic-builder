import type * as vscode from 'vscode';

/** 命令模板：${字段} 由 webview 发来的消息字段替换。 */
export interface ActionDescriptor {
    command: string;
    template: string;
    condition?: string;
    elseTemplate?: string;
}

export interface VuePanelDescriptor {
    component: string;
}

export interface PanelDescriptor {
    id: string;
    title: string;
    actions: ActionDescriptor[];
    vue: VuePanelDescriptor;
    handleMessage?: (
        message: Record<string, unknown>,
        context: vscode.ExtensionContext,
        webview: vscode.WebviewView
    ) => void | Promise<void>;
    onRefresh?: (context: vscode.ExtensionContext) => Record<string, unknown>;
}
