import * as vscode from 'vscode';
import type { PanelDescriptor } from '../shared/types';
import { checkXmFile, insertText, showWarning } from '../services/editor';
import { INTEGER_VAR_VALUES, STRING_VAR_VALUES, NO_CUSTOM_VAR_TYPES } from '../shared/constants';

export const variablePanel: PanelDescriptor = {
    id: 'xm-magic-builder.variable',
    title: '变量',
    fields: [],
    actions: [],
    scripts: ['src/js/variable.js'],
    dataInject() {
        return `<script>window.__variableViewData = { integerValues: ${JSON.stringify(INTEGER_VAR_VALUES)}, stringValues: ${JSON.stringify(STRING_VAR_VALUES)}, noCustomTypes: ${JSON.stringify(NO_CUSTOM_VAR_TYPES)} };</script>`;
    },
    getHtml() {
        const values = INTEGER_VAR_VALUES;
        const valueOptionsHtml = values.map((v) => `<option value="${v.value}">${v.label}</option>`).join('');

        return `<div class="container">
            <div class="input-group">
                <span class="label">变量名称</span>
                <input type="text" id="var-name" />
            </div>
            <div class="input-group">
                <span class="label">变量类型</span>
                <select id="var-type">
                    <option value="integer">整数型(长整数)</option>
                    <option value="string">文本型(字符串)</option>
                </select>
            </div>
            <div class="input-group">
                <span class="label">变量值</span>
                <select id="var-value">${valueOptionsHtml}</select>
            </div>
            <div class="input-group" id="custom-value-group">
                <input type="text" id="custom-value" />
            </div>
            <div class="btn-row" style="display: flex; flex-wrap: wrap; gap: 8px 16px;">
                <button id="clear-btn">清空变量</button>
                <button id="add-btn">添加变量</button>
            </div>
        </div>`;
    },
    handleMessage(message: Record<string, unknown>, _context: vscode.ExtensionContext, _webview: vscode.WebviewView) {
        if (message.command === 'show-warning') {
            showWarning(message.message as string);
            return;
        }

        if (!checkXmFile()) {
            return;
        }

        if (message.command === 'variable-clear') {
            void insertText('变量=清空变量');
        } else if (message.command === 'variable-add') {
            const varType = message.varType as string;
            const varValue = message.varValue as string;
            const typeLabel = varType === 'integer' ? '整数型' : '文本型';
            const actualValue = NO_CUSTOM_VAR_TYPES.includes(varValue) ? '0' : (message.customValue as string);
            const output = `变量=${typeLabel}|${message.varName as string}|${varValue}|${actualValue}`;
            void insertText(output);
        }
    },
};
