import * as vscode from 'vscode';
import * as iconv from 'iconv-lite';
import type { PanelDescriptor } from '../panel-types';
import type { ImportFileKind } from '../../shared/messages';
import { checkXmFile, insertText } from '../services/text-editor';
import { pickImportFile } from '../services/file-picker';
import { buildVariableAdd, consumeWarning } from '../command-template';

const MAGIC_PLAIN_PREFIX = '35383444364436313637363936334333463743454334';

export const customMagicPanel: PanelDescriptor = {
    id: 'xm-magic-builder.custom-magic',
    title: '自定义魔法',
    actions: [],
    vue: { component: 'custom-magic' },
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

        if (msg.command === 'custom-magic-add') {
            const passwordPart = msg.password ? `${msg.password}` : '';
            const output = `自定义魔法=${msg.passCurrent}|${msg.returnVar}|${passwordPart}|${msg.fileName}|${msg.fileHex}`;
            await insertText(output);
        } else if (msg.command === 'custom-magic-plain-add') {
            const plainHex = iconv.encode(msg.plainContent, 'gbk').toString('hex').toUpperCase();
            const output = `自定义魔法=${msg.passCurrent}|${msg.returnVar}|明文|${msg.varName}.xmagic|${MAGIC_PLAIN_PREFIX}${plainHex}`;
            await insertText(output);
        } else if (msg.command === 'custom-magic-var-add') {
            await insertText(buildVariableAdd(msg.varName, msg.fileHex));
        } else if (msg.command === 'custom-magic-use-var') {
            const passwordPart = msg.password ? `${msg.password}` : '';
            const output = `自定义魔法=${msg.passCurrent}|${msg.returnVar}|${passwordPart}|${msg.varName}.xmgic|[${msg.varName}]`;
            await insertText(output);
        }
    },
};
