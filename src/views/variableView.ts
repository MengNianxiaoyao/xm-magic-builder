import { BaseView } from './baseView';
import { createTextInput, createButtonRow, createSelect, checkXmFile, insertText, showWarning } from '../utils';
import { INTEGER_VAR_VALUES, STRING_VAR_VALUES, NO_CUSTOM_VAR_TYPES } from '../constants';

export class VariableView extends BaseView {
    private varType = 'integer';
    private varValue = 'custom';

    getContent(): string {
        const values = this.varType === 'integer' ? INTEGER_VAR_VALUES : STRING_VAR_VALUES;
        const showCustom = !NO_CUSTOM_VAR_TYPES.includes(this.varValue);

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

        const customInputSection = showCustom ? `
        <div class="input-group" id="custom-value-group">
            ${customValueHtml}
        </div>` : '';

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
        </div>
        <script>
            const vscode = acquireVsCodeApi();
            
            const integerValues = ${JSON.stringify(INTEGER_VAR_VALUES)};
            const stringValues = ${JSON.stringify(STRING_VAR_VALUES)};
            const noCustomTypes = ${JSON.stringify(NO_CUSTOM_VAR_TYPES)};
            
            function updateValueOptions(type) {
                const valueSelect = document.getElementById('var-value');
                const options = type === 'integer' ? integerValues : stringValues;
                valueSelect.innerHTML = options.map(v => '<option value="' + v.value + '">' + v.label + '</option>').join('');
            }
            
            function updateCustomInput(value, type) {
                const customGroup = document.getElementById('custom-value-group');
                if (customGroup) {
                    if (noCustomTypes.includes(value)) {
                        customGroup.style.display = 'none';
                    } else {
                        customGroup.style.display = 'flex';
                    }
                }
            }
            
            document.getElementById('var-type').addEventListener('change', (e) => {
                const type = e.target.value;
                updateValueOptions(type);
                updateCustomInput(document.getElementById('var-value').value, type);
            });
            
            document.getElementById('var-value').addEventListener('change', (e) => {
                updateCustomInput(e.target.value, document.getElementById('var-type').value);
            });
            
            document.getElementById('clear-btn').addEventListener('click', () => {
                vscode.postMessage({ command: 'variable-clear' });
            });
            
            document.getElementById('add-btn').addEventListener('click', () => {
                const varName = document.getElementById('var-name').value;
                const varType = document.getElementById('var-type').value;
                const varValue = document.getElementById('var-value').value;
                const customValueInput = document.getElementById('custom-value');
                const customValue = customValueInput ? customValueInput.value : '';
                
                if (!varName) {
                    vscode.postMessage({ command: 'show-warning', message: '变量名称不得为空！' });
                    return;
                }
                
                if (!noCustomTypes.includes(varValue) && !customValue) {
                    vscode.postMessage({ command: 'show-warning', message: '当前类型变量值不得为空！' });
                    return;
                }
                
                vscode.postMessage({ 
                    command: 'variable-add', 
                    varName, 
                    varType, 
                    varValue, 
                    customValue 
                });
            });
        </script>`;
    }

    protected handleMessage(message: any): void {
        if (message.command === 'show-warning') {
            showWarning(message.message);
            return;
        }

        if (!checkXmFile()) { return; }

        if (message.command === 'variable-clear') {
            insertText('变量=清空变量');
        } else if (message.command === 'variable-add') {
            const typeLabel = message.varType === 'integer' ? '整数型' : '文本型';
            const actualValue = NO_CUSTOM_VAR_TYPES.includes(message.varValue) ? '0' : message.customValue;
            const output = `变量=${typeLabel}|${message.varName}|${message.varValue}|${actualValue}`;
            insertText(output);
        }
    }
}