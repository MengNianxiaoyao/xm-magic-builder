import * as vscode from 'vscode';
import * as iconv from 'iconv-lite';
import type { PanelDescriptor } from '../panel-types';
import type { ImportFileKind } from '../../shared/messages';
import { checkXmFile, insertText, showWarning } from '../services/text-editor';
import { pickImportFile, readPickedHex } from '../services/file-picker';
import { buildVariableAdd, consumeWarning } from '../command-template';

/**
 * 明文数据的十六进制解码后，正文前固定带这段标识（"XMmagic明文" 的十六进制文本）。
 * 写回文件时还要再套一层十六进制，所以 PLAIN_PREFIX 是这段标识本身的十六进制。
 */
const PLAIN_SIGNATURE = '584D6D61676963C3F7CEC4';
const PLAIN_PREFIX = Buffer.from(PLAIN_SIGNATURE, 'latin1').toString('hex').toUpperCase();

export const customMagicPanel: PanelDescriptor = {
    id: 'xm-magic-builder.custom-magic',
    title: '自定义魔法',
    actions: [],
    vue: { component: 'custom-magic' },
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

        if (msg.command === 'custom-magic-plain-decode') {
            // 明文数据是十六进制，解码成 GBK 文本并去掉文件头，得到原文。
            const hex = (msg.plainContent ?? '').replace(/\s+/g, '');
            if (!hex || hex.length % 2 !== 0 || !/^[0-9a-fA-F]+$/.test(hex)) {
                showWarning('明文数据应为十六进制，请检查后重试。');
                return;
            }
            const text = iconv.decode(Buffer.from(hex, 'hex'), 'gbk');
            const plain = text.startsWith(PLAIN_SIGNATURE) ? text.slice(PLAIN_SIGNATURE.length) : text;
            void webview.webview.postMessage({ command: 'custom-magic-plain-decoded', text: plain });
            return;
        }

        if (!checkXmFile()) {
            return;
        }

        if (msg.command === 'custom-magic-add') {
            const hex = await readPickedHex(msg.filePath, '魔法');
            if (hex === undefined) {
                return;
            }
            const passwordPart = msg.password ? `${msg.password}` : '';
            const output = `自定义魔法=${msg.passCurrent}|${msg.returnVar}|${passwordPart}|${msg.fileName}|${hex}`;
            await insertText(output);
        } else if (msg.command === 'custom-magic-plain-add') {
            const plainHex = iconv.encode(msg.plainContent, 'gbk').toString('hex').toUpperCase();
            const output = `自定义魔法=${msg.passCurrent}|${msg.returnVar}|明文|${msg.varName}.xmgic|${PLAIN_PREFIX}${plainHex}`;
            await insertText(output);
        } else if (msg.command === 'custom-magic-var-add') {
            const hex = await readPickedHex(msg.filePath, '魔法');
            if (hex === undefined) {
                return;
            }
            await insertText(buildVariableAdd(msg.varName, hex));
        } else if (msg.command === 'custom-magic-use-var') {
            const passwordPart = msg.password ? `${msg.password}` : '';
            const output = `自定义魔法=${msg.passCurrent}|${msg.returnVar}|${passwordPart}|${msg.varName}.xmgic|[${msg.varName}]`;
            await insertText(output);
        }
    },
};
