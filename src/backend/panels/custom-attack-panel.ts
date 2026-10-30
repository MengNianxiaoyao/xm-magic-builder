import * as vscode from 'vscode';
import type { PanelDescriptor } from '../panel-types';
import type { ImportFileKind } from '../../shared/messages';
import { checkXmFile, insertText } from '../services/text-editor';
import { pickImportFile } from '../services/file-picker';
import { buildVariableAdd, consumeWarning } from '../command-template';

export const customAttackPanel: PanelDescriptor = {
    id: 'xm-magic-builder.custom-attack',
    title: '自定义出招',
    actions: [],
    vue: { component: 'custom-attack' },
    async handleMessage(
        message: Record<string, unknown>,
        context: vscode.ExtensionContext,
        webview: vscode.WebviewView
    ) {
        const msg = message as Record<string, string>;
        if (consumeWarning(message)) {
            return;
        }

        if (msg.command === 'pick-file') {
            const picked = await pickImportFile(context, msg.kind as ImportFileKind);
            if (picked) {
                void webview.webview.postMessage({ command: 'file-picked', kind: msg.kind, ...picked });
            }
            return;
        }

        if (!checkXmFile()) {
            return;
        }

        if (msg.command === 'custom-attack-add') {
            const output = `自定义出招=${msg.battlePacket}|${msg.fileName}|${msg.fileHex}`;
            await insertText(output);
        } else if (msg.command === 'custom-attack-var-add') {
            await insertText(buildVariableAdd(msg.varName, msg.fileHex));
        } else if (msg.command === 'custom-attack-use-var') {
            const output = `自定义出招=${msg.battlePacket}|${msg.varName}.xmcus|[${msg.varName}]`;
            await insertText(output);
        }
    },
};
