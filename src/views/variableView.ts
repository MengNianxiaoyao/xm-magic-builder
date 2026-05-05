import * as vscode from 'vscode';
import { BaseView } from './baseView';

const INTEGER_VALUES = [
	{ value: '自定义值', label: '自定义值' },
	{ value: '道具数量返回', label: '道具数量返回' },
	{ value: '精灵数量返回1', label: '精灵数量返回1' },
	{ value: '精灵数量返回2', label: '精灵数量返回2' },
	{ value: '背包精灵catchtime返回', label: '背包精灵catchtime返回' },
	{ value: '背包精灵catchtime返回2', label: '背包精灵catchtime返回2' },
	{ value: '用户当前超NO状态返回', label: '用户当前超NO状态返回' },
	{ value: '用户当前年费状态返回', label: '用户当前年费状态返回' },
	{ value: '用户当前火焰状态返回', label: '用户当前火焰状态返回' },
	{ value: '现行10位时间戳', label: '现行10位时间戳' },
	{ value: '当前星期几', label: '当前星期几' },
	{ value: '当前年份', label: '当前年份' },
	{ value: '当前月份', label: '当前月份' },
	{ value: '当前日', label: '当前日' },
	{ value: '当前小时', label: '当前小时' },
	{ value: '当前分钟', label: '当前分钟' },
	{ value: '当前秒数', label: '当前秒数' },
	{ value: '时间戳取年份', label: '时间戳取年份' },
	{ value: '时间戳取月份', label: '时间戳取月份' },
	{ value: '时间戳取日', label: '时间戳取日' },
	{ value: '时间戳取小时', label: '时间戳取小时' },
	{ value: '时间戳取分钟', label: '时间戳取分钟' },
	{ value: '时间戳取秒数', label: '时间戳取秒数' },
];

const STRING_VALUES = [
	{ value: '自定义文本', label: '自定义文本' },
	{ value: '游戏收包主体文本返回', label: '游戏收包主体文本返回' },
	{ value: '现行时间', label: '现行时间' },
	{ value: '时间戳转文本', label: '时间戳转文本' },
];

const NO_CUSTOM_VALUE_TYPES = [
	'用户当前超NO状态返回',
	'用户当前年费状态返回',
	'用户当前火焰状态返回',
	'现行10位时间戳',
	'当前星期几',
	'当前年份',
	'当前月份',
	'当前日',
	'当前小时',
	'当前分钟',
	'当前秒数',
	'现行时间',
];

export class VariableView extends BaseView {
	private varType = 'integer';
	private varValue = 'custom';

	getContent(): string {
		const values = this.varType === 'integer' ? INTEGER_VALUES : STRING_VALUES;
		const showCustom = !NO_CUSTOM_VALUE_TYPES.includes(this.varValue);
		const customValueLabel = this.varType === 'integer' ? '自定义值' : '自定义文本';
		
		return `
	<div class="container">
		<div class="input-group">
			<span class="label">变量名称</span>
			<input type="text" id="var-name" />
		</div>
		<div class="input-group">
			<span class="label">变量类型</span>
			<select id="var-type">
				<option value="integer" ${this.varType === 'integer' ? 'selected' : ''}>整数型(长整数)</option>
				<option value="string" ${this.varType === 'string' ? 'selected' : ''}>文本型(字符串)</option>
			</select>
		</div>
		<div class="input-group">
			<span class="label">变量值</span>
			<select id="var-value">
				${values.map(v => `<option value="${v.value}" ${this.varValue === v.value ? 'selected' : ''}>${v.label}</option>`).join('')}
			</select>
		</div>
		${showCustom ? `
		<div class="input-group" id="custom-value-group">
			<input type="text" id="custom-value" />
		</div>
		` : ''}
		<div class="btn-row">
			<button id="clear-btn">清空变量</button>
			<button id="add-btn">添加变量</button>
		</div>
	</div>
	<script>
		const vscode = acquireVsCodeApi();
		
		const integerValues = ${JSON.stringify(INTEGER_VALUES)};
		const stringValues = ${JSON.stringify(STRING_VALUES)};
		const noCustomTypes = ${JSON.stringify(NO_CUSTOM_VALUE_TYPES)};
		
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
			vscode.window.showWarningMessage(message.message);
			return;
		}
		
		if (!this.checkXmFile()) return;
		
		const editor = vscode.window.activeTextEditor;
		if (!editor) return;
		
		if (message.command === 'variable-clear') {
			editor.edit((builder) => {
				builder.insert(editor.selection.active, '变量=清空变量\n');
			});
		} else if (message.command === 'variable-add') {
			const typeLabel = message.varType === 'integer' ? '整数型' : '文本型';
			const actualValue = NO_CUSTOM_VALUE_TYPES.includes(message.varValue) ? '0' : message.customValue;
			const output = `变量=${typeLabel}|${message.varName}|${message.varValue}|${actualValue}`;
			editor.edit((builder) => {
				builder.insert(editor.selection.active, output + '\n');
			});
		}
	}
}