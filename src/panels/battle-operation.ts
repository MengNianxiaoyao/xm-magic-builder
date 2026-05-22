import * as vscode from 'vscode';
import type { PanelDescriptor } from '../shared/types';
import { checkXmFile, insertText } from '../services/editor';

export const battleOperationPanel: PanelDescriptor = {
    id: 'xm-magic-builder.battle-operation',
    title: '对战操作',
    fields: [],
    actions: [],
    scripts: ['src/js/battleOperation.js'],
    getHtml() {
        return `<div class="container">
            <div class="radio-group" style="display: flex; flex-wrap: wrap; gap: 8px 16px;">
                <label class="radio-label">
                    <input type="radio" name="battle-op" value="takeover" checked />
                    <span>接管对战</span>
                </label>
                <label class="radio-label">
                    <input type="radio" name="battle-op" value="skill" />
                    <span>使用技能</span>
                </label>
                <label class="radio-label">
                    <input type="radio" name="battle-op" value="item" />
                    <span>使用道具</span>
                </label>
                <label class="radio-label">
                    <input type="radio" name="battle-op" value="pre-battle" />
                    <span>战前准备</span>
                </label>
            </div>
            <div id="takeover-group" class="input-group">
                <span class="label">对战包</span>
                <input type="text" id="battle-id" />
            </div>
            <div id="skill-group" class="input-group" style="display: none;">
                <span class="label">技能ID</span>
                <input type="text" id="skill-id" />
            </div>
            <div id="item-group" class="input-group" style="display: none;">
                <span class="label">道具ID</span>
                <input type="text" id="item-id" />
            </div>
            <div id="pre-battle-group" class="input-group" style="display: none;">
                <span class="label">借火类型</span>
                <select id="fire-select">
                    <option value="绿火">绿火</option>
                    <option value="金火">金火</option>
                    <option value="紫火">紫火</option>
                    <option value="蓝火">蓝火</option>
                </select>
            </div>
            <div class="btn-row" style="display: flex; flex-wrap: wrap; gap: 8px 16px;">
                <button id="add-btn">添加</button>
                <button id="retreat-btn">对战撤退</button>
                <button id="pressure-btn">压血</button>
                <button id="recover-btn">全精灵恢复</button>
            </div>
        </div>`;
    },
    handleMessage(message: Record<string, unknown>, _context: vscode.ExtensionContext, _webview: vscode.WebviewView) {
        if (!checkXmFile()) {
            return;
        }
        const cmd = message.command as string;
        const content = message.content as string;
        if (cmd === '接管对战') {
            void insertText(`接管对战=${content}`);
        } else if (cmd === '使用技能') {
            void insertText(`使用技能=${content}`);
        } else if (cmd === '使用道具') {
            void insertText(`使用道具=${content}`);
        } else if (cmd === '战前准备') {
            void insertText(`战前准备=${content}`);
        }
    },
};
