import * as vscode from 'vscode';
import * as fs from 'node:fs/promises';
import * as path from 'node:path';
import type { ImportFileKind } from '../../shared/messages';

export interface PickedFile {
    fileName: string;
    fileHex: string;
}

const FILTERS: Record<ImportFileKind, Record<string, string[]>> = {
    'custom-attack': { 自定义出招: ['xmcus'] },
    'custom-magic': { 自定义魔法: ['xmgic'] },
};

/** 按导入类型分别记住上次选择的目录，避免两种文件共用同一个路径。 */
export async function pickImportFile(
    context: vscode.ExtensionContext,
    kind: ImportFileKind
): Promise<PickedFile | undefined> {
    const dirKey = `xm-magic-builder.importDir.${kind}`;
    const lastDir = context.globalState.get<string>(dirKey);

    let defaultUri: vscode.Uri | undefined;
    if (lastDir) {
        try {
            await fs.access(lastDir);
            defaultUri = vscode.Uri.file(lastDir);
        } catch {
            defaultUri = undefined;
        }
    }

    const selection = await vscode.window.showOpenDialog({
        canSelectFiles: true,
        canSelectMany: false,
        openLabel: '导入',
        filters: FILTERS[kind],
        defaultUri,
    });

    if (!selection || selection.length === 0) {
        return undefined;
    }

    const fileUri = selection[0];
    const buffer = await fs.readFile(fileUri.fsPath);
    await context.globalState.update(dirKey, path.dirname(fileUri.fsPath));

    return {
        fileName: path.basename(fileUri.fsPath),
        fileHex: buffer.toString('hex').toUpperCase(),
    };
}
