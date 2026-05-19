import { BaseView } from './baseView';
import {
    createTextInput,
    createButtonRow,
    createSelect,
    checkXmFile,
    insertText,
    showWarning,
} from '../utils';
import { ViewMessage } from '../types/messages';
import {
    INTEGER_VAR_VALUES,
    STRING_VAR_VALUES,
    NO_CUSTOM_VAR_TYPES,
} from '../constants';

export class VariableView extends BaseView {
    protected getScriptPaths(): string[] {
        return ['resources/js/variable.js'];
    }

    protected getDataScript(): string {
        return `<script>window.__variableViewData = { integerValues: ${JSON.stringify(INTEGER_VAR_VALUES)}, stringValues: ${JSON.stringify(STRING_VAR_VALUES)}, noCustomTypes: ${JSON.stringify(NO_CUSTOM_VAR_TYPES)} };</script>`;
    }

    getContent(): string {
        const values = INTEGER_VAR_VALUES;
        const showCustom = true;

        const varNameHtml = createTextInput({ id: 'var-name' });
        const varTypeHtml = createSelect({
            id: 'var-type',
            options: [
                { value: 'integer', label: '整数型(长整数)' },
                { value: 'string', label: '文本型(字符串)' },
            ],
        });
        const varValueHtml = createSelect({ id: 'var-value', options: values });
        const customValueHtml = createTextInput({ id: 'custom-value' });
        const buttonsHtml = createButtonRow([
            { id: 'clear-btn', text: '清空变量' },
            { id: 'add-btn', text: '添加变量' },
        ]);

        const customInputSection = showCustom
            ? `<div class="input-group" id="custom-value-group">${customValueHtml}</div>`
            : '';

        return `
        <div class="container">
            <div class="input-group">
                <span class="label">变量名称</span>
                ${varNameHtml}
            </div>
            <div class="input-group">
                <span class="label">变量类型</span>
                ${varTypeHtml}
            </div>
            <div class="input-group">
                <span class="label">变量值</span>
                ${varValueHtml}
            </div>
            ${customInputSection}
            ${buttonsHtml}
        </div>`;
    }

    protected handleMessage(message: ViewMessage): void {
        if (message.command === 'show-warning') {
            showWarning(message.message);
            return;
        }

        if (!checkXmFile()) {
            return;
        }

        if (message.command === 'variable-clear') {
            void insertText('变量=清空变量');
        } else if (message.command === 'variable-add') {
            const typeLabel =
                message.varType === 'integer' ? '整数型' : '文本型';
            const actualValue = NO_CUSTOM_VAR_TYPES.includes(message.varValue)
                ? '0'
                : message.customValue;
            const output = `变量=${typeLabel}|${message.varName}|${message.varValue}|${actualValue}`;
            void insertText(output);
        }
    }
}
