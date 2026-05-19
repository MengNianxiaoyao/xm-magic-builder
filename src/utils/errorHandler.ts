import * as vscode from 'vscode';

export interface ErrorOptions {
    view: string;
    command?: string;
    showMessage?: boolean;
}

export function handleError(
    error: Error | unknown,
    options: ErrorOptions
): void {
    const errorStr = error instanceof Error ? error.message : String(error);
    const context = `[${options.view}${options.command ? `/${options.command}` : ''}]`;

    console.error(`${context} 错误：${errorStr}`);

    if (options.showMessage !== false) {
        vscode.window.showErrorMessage(`${options.view} 操作失败：${errorStr}`);
    }
}
