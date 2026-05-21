import * as vscode from 'vscode';

export function checkXmFile(): boolean {
    const editor = vscode.window.activeTextEditor;
    if (!editor || !editor.document.fileName.endsWith('.xm')) {
        vscode.window.showWarningMessage('请先打开 .xm 文件');
        return false;
    }
    return true;
}

export async function insertText(text: string): Promise<boolean> {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
        return false;
    }
    const success = await editor.edit((builder) => {
        builder.insert(editor.selection.active, text + '\n');
    });
    if (!success) {
        vscode.window.showWarningMessage('文本插入失败');
    }
    return success;
}

export async function insertTextAtLine(
    text: string,
    lineIndex: number = 0
): Promise<boolean> {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
        return false;
    }

    if (editor.document.lineCount === 0) {
        vscode.window.showWarningMessage('文本插入失败：文档为空');
        return false;
    }

    const firstLine = editor.document.lineAt(0);
    const isFirstLineMagic = firstLine.text.trim().startsWith('魔法管理=');

    const success = await editor.edit((builder) => {
        if (lineIndex === 0 && isFirstLineMagic) {
            const range = new vscode.Range(0, 0, 0, firstLine.text.length);
            builder.replace(range, text);
        } else {
            const pos = new vscode.Position(lineIndex, 0);
            builder.insert(pos, text + '\n');
        }
    });

    if (!success) {
        vscode.window.showWarningMessage('文本插入失败');
    }
    return success;
}

export function showWarning(message: string): void {
    vscode.window.showWarningMessage(message);
}
