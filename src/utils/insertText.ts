import * as vscode from 'vscode';
import { XM_KEYWORDS } from '../constants/xmKeywords';

export function checkXmFile(): boolean {
    const editor = vscode.window.activeTextEditor;
    if (!editor || !editor.document.fileName.endsWith('.xm')) {
        vscode.window.showWarningMessage('请先打开 .xm 文件');
        return false;
    }
    return true;
}

export function insertText(text: string): void {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
        return;
    }
    editor.edit((builder) => {
        builder.insert(editor.selection.active, text + '\n');
    });
}

export function insertTextAtLine(text: string, lineIndex: number = 0): void {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
        return;
    }

    const firstLine = editor.document.lineAt(0);
    const isFirstLineMagic = firstLine.text
        .trim()
        .startsWith(`${XM_KEYWORDS.MAGIC_MANAGE}=`);

    editor.edit((builder) => {
        if (lineIndex === 0 && isFirstLineMagic) {
            const range = new vscode.Range(0, 0, 0, firstLine.text.length);
            builder.replace(range, text);
        } else {
            const pos = new vscode.Position(lineIndex, 0);
            builder.insert(pos, text + '\n');
        }
    });
}

export function showWarning(message: string): void {
    vscode.window.showWarningMessage(message);
}
