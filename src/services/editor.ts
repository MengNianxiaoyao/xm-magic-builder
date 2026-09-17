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
    const { active } = editor.selection;
    const line = editor.document.lineAt(active.line);
    const plan = buildInsertPlan(text, line.text, active.character, active.line, editor.document.lineCount);
    const success = await editor.edit((builder) => {
        builder.insert(new vscode.Position(plan.line, plan.character), plan.content);
    });
    if (!success) {
        vscode.window.showWarningMessage('文本插入失败');
    }
    return success;
}

export interface InsertPlan {
    line: number;
    character: number;
    content: string;
}

/**
 * 根据光标位置决定插入位置与内容（纯函数，便于测试）：
 * - 行首（含空行）：原地 `文本 + 换行`，将当前行下推；
 * - 行尾且有下一行：原地 `换行 + 文本`，利用原有行尾换行分隔；
 * - 行尾且无下一行（末行行尾）：原地 `换行 + 文本 + 换行`；
 * - 行中：跳至下一行行首 `文本 + 换行`；末行无下一行时按行尾处理。
 */
export function buildInsertPlan(
    text: string,
    lineText: string,
    charIndex: number,
    lineIndex: number,
    lineCount: number
): InsertPlan {
    const isLineStart = charIndex === 0;
    const isLineEnd = charIndex >= lineText.length;
    const hasNextLine = lineIndex < lineCount - 1;
    if (!isLineStart && !isLineEnd) {
        if (hasNextLine) {
            return { line: lineIndex + 1, character: 0, content: `${text}\n` };
        }
        return { line: lineIndex, character: lineText.length, content: `\n${text}\n` };
    }
    if (!isLineStart && isLineEnd) {
        return {
            line: lineIndex,
            character: charIndex,
            content: hasNextLine ? `\n${text}` : `\n${text}\n`,
        };
    }
    return { line: lineIndex, character: charIndex, content: `${text}\n` };
}

export async function insertTextAtLine(text: string, lineIndex: number = 0): Promise<boolean> {
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
