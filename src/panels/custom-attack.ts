import * as vscode from 'vscode';
import type { PanelDescriptor } from '../shared/types';
import { checkXmFile, insertText, showWarning } from '../services/editor';

export const customAttackPanel: PanelDescriptor = {
    id: 'xm-magic-builder.custom-attack',
    title: '自定义出招',
    fields: [],
    actions: [],
    scripts: ['src/js/fileImport.js', 'src/js/customAttack.js'],
    getHtml() {
        return `<div class="container">
            <div class="input-group">
                <span class="label">对战包</span>
                <input type="text" id="battle-packet" />
            </div>
            <div class="input-group">
                <span class="label">自定义出招</span>
                <input type="text" id="file-name" readonly />
            </div>
            <div class="button-row" style="display: flex; flex-wrap: wrap; gap: 8px 16px;">
                <button id="import-btn" class="btn" data-accept=".xmcus">导入对战方案</button>
                <button id="add-btn" class="btn">添加</button>
            </div>
        </div>`;
    },
    async handleMessage(
        message: Record<string, unknown>,
        _context: vscode.ExtensionContext,
        _webview: vscode.WebviewView
    ) {
        const msg = message as Record<string, string>;
        if (msg.command === 'show-warning') {
            showWarning(msg.message);
            return;
        }

        if (!checkXmFile()) {
            return;
        }

        if (msg.command === 'custom-attack-add') {
            const output = `自定义出招=${msg.battlePacket}|${msg.fileName}|${msg.fileHex}`;
            await insertText(output);
        }
    },
};
