import * as vscode from 'vscode';
import type { PanelDescriptor } from '../panel-types';
import type { ImportFileKind } from '../../shared/messages';
import { checkXmFile, insertText } from '../services/text-editor';
import { pickImportFile, readPickedHex } from '../services/file-picker';
import { buildCustomAttackSettings, buildVariableAdd, consumeWarning } from '../command-template';

export const customAttackPanel: PanelDescriptor = {
    id: 'xm-magic-builder.custom-attack',
    title: '自定义出招',
    actions: [],
    vue: { component: 'custom-attack' },
    async handleMessage(
        message: Record<string, unknown>,
        webview: vscode.WebviewView,
        context: vscode.ExtensionContext
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
            const hex = await readPickedHex(msg.filePath, '对战方案');
            if (hex === undefined) {
                return;
            }
            const output = `自定义出招=${msg.battlePacket}|${msg.fileName}|${hex}`;
            await insertText(output);
        } else if (msg.command === 'custom-attack-var-add') {
            const hex = await readPickedHex(msg.filePath, '对战方案');
            if (hex === undefined) {
                return;
            }
            await insertText(buildVariableAdd(msg.varName, hex));
        } else if (msg.command === 'custom-attack-use-var') {
            const output = `自定义出招=${msg.battlePacket}|${msg.varName}.xmcus|[${msg.varName}]`;
            await insertText(output);
        } else if (msg.command === 'custom-attack-settings') {
            await insertText(
                buildCustomAttackSettings(msg.disableTeam, msg.disablePreBattle, msg.disableAttack, msg.shieldCts)
            );
        }
    },
};
