import * as vscode from 'vscode';

export interface ErrorOptions {
    view: string;
    command?: string;
    showMessage?: boolean;
}

export function handleError(error: unknown, options: ErrorOptions): void {
    const errorObj = error instanceof Error ? error : new Error(String(error));
    const errorStr = errorObj.message || String(error);
    const context = `[${options.view}${options.command ? `/${options.command}` : ''}]`;

    console.error(`${context} 错误：${errorStr}`);
    if (errorObj.stack) {
        console.error(errorObj.stack);
    }

    if (options.showMessage !== false) {
        vscode.window.showErrorMessage(`${options.view} 操作失败：${errorStr}`);
    }
}
