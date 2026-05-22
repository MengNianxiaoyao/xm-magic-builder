import * as vscode from 'vscode';
import type { PanelDescriptor } from '../shared/types';
import { checkXmFile, insertText, showWarning } from '../services/editor';

export const customMagicPanel: PanelDescriptor = {
    id: 'xm-magic-builder.custom-magic',
    title: '自定义魔法',
    fields: [],
    actions: [],
    scripts: ['resources/js/fileImport.js', 'resources/js/customMagic.js'],
    getHtml() {
        return `<div class="container">
            <div class="checkbox-group">
                <label class="checkbox-label">
                    <input type="checkbox" id="pass-current" />
                    <span>传入当前魔法变量</span>
                </label>
                <label class="checkbox-label">
                    <input type="checkbox" id="return-var" />
                    <span>返回调用魔法变量</span>
                </label>
            </div>
            <div class="input-group">
                <span class="label">魔法密码</span>
                <input type="text" id="password" />
            </div>
            <div class="input-group">
                <span class="label">自定义魔法</span>
                <input type="text" id="file-name" readonly />
            </div>
            <div class="button-row" style="display: flex; flex-wrap: wrap; gap: 8px 16px;">
                <button id="import-btn" class="btn" data-accept=".xmgic">导入魔法</button>
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

        if (msg.command === 'custom-magic-add') {
            const passwordPart = msg.password ? `${msg.password}` : '';
            const output = `自定义魔法=${msg.passCurrent}|${msg.returnVar}|${passwordPart}|${msg.fileName}|${msg.fileHex}`;
            await insertText(output);
        }
    },
};
