import type * as vscode from 'vscode';

export interface FieldDescriptor {
    type: 'text' | 'number' | 'textarea' | 'select' | 'radio' | 'checkbox' | 'html';
    id: string;
    label?: string;
    placeholder?: string;
    value?: string;
    readonly?: boolean;
    rows?: number;
    options?: { value: string; label: string; checked?: boolean }[];
    name?: string;
    columns?: number;
    html?: string;
    className?: string;
    visible?: boolean;
}

export interface ActionDescriptor {
    id: string;
    text: string;
    command: string;
    className?: string;
    inputId?: string;
    inputs?: Record<string, string>;
    radio?: string;
    template?: string;
    condition?: string;
    elseTemplate?: string;
}

export interface PanelDescriptor {
    id: string;
    title: string;
    fields: FieldDescriptor[];
    actions: ActionDescriptor[];
    scripts?: string[];
    dataInject?: () => string;
    getHtml?: () => string;
    buttonRowStyle?: string;
    handleMessage?: (
        message: Record<string, unknown>,
        context: vscode.ExtensionContext,
        webview: vscode.WebviewView
    ) => void | Promise<void>;
    onRefresh?: (context: vscode.ExtensionContext) => Record<string, unknown>;
}
