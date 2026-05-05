import * as vscode from 'vscode';
import { BaseView } from './baseView';
import { createTextInput, createButtonRow, createRadioGroup, createSelect, checkXmFile, insertText } from '../utils';

export class BattleOperationView extends BaseView {
	getContent(): string {
		const selectHtml = createSelect({
			id: 'fire-select',
			options: [
				{ value: '绿火', label: '绿火' },
				{ value: '金火', label: '金火' },
				{ value: '紫火', label: '紫火' },
				{ value: '蓝火', label: '蓝火' },
			],
		});
		
		const battleIdHtml = createTextInput({ id: 'battle-id' });
		const skillIdHtml = createTextInput({ id: 'skill-id' });
		const itemIdHtml = createTextInput({ id: 'item-id' });
		const radioHtml = createRadioGroup('battle-op', [
			{ value: 'takeover', label: '接管对战', checked: true },
			{ value: 'skill', label: '使用技能' },
			{ value: 'item', label: '使用道具' },
			{ value: 'pre-battle', label: '战前准备' },
		], true, 2);
		const buttonsHtml = createButtonRow([
			{ id: 'add-btn', text: '添加' },
			{ id: 'retreat-btn', text: '对战撤退' },
			{ id: 'pressure-btn', text: '压血' },
			{ id: 'recover-btn', text: '全精灵恢复' },
		], 2);
		
		return `
	<div class="container">
		${radioHtml}
		
		<div id="takeover-group" class="input-group">
			<span class="label">对战包</span>
			${battleIdHtml}
		</div>
		
		<div id="skill-group" class="input-group" style="display: none;">
			<span class="label">技能ID</span>
			${skillIdHtml}
		</div>
		
		<div id="item-group" class="input-group" style="display: none;">
			<span class="label">道具ID</span>
			${itemIdHtml}
		</div>
		
		<div id="pre-battle-group" class="input-group" style="display: none;">
			<span class="label">借火类型</span>
			${selectHtml}
		</div>
		
		${buttonsHtml}
	</div>
	<script>
		const vscode = acquireVsCodeApi();
		
		function toggleInput() {
			const op = document.querySelector('input[name="battle-op"]:checked').value;
			
			document.getElementById('takeover-group').style.display = 'none';
			document.getElementById('skill-group').style.display = 'none';
			document.getElementById('item-group').style.display = 'none';
			document.getElementById('pre-battle-group').style.display = 'none';
			
			if (op === 'takeover') {
				document.getElementById('takeover-group').style.display = 'flex';
			} else if (op === 'skill') {
				document.getElementById('skill-group').style.display = 'flex';
			} else if (op === 'item') {
				document.getElementById('item-group').style.display = 'flex';
			} else if (op === 'pre-battle') {
				document.getElementById('pre-battle-group').style.display = 'flex';
			}
		}
		
		document.querySelectorAll('input[name="battle-op"]').forEach(radio => {
			radio.addEventListener('change', toggleInput);
		});
		
		document.getElementById('add-btn').addEventListener('click', () => {
			const op = document.querySelector('input[name="battle-op"]:checked').value;
			let command = '';
			let content = '';
			
			switch (op) {
				case 'takeover':
					command = '接管对战';
					content = document.getElementById('battle-id').value;
					break;
				case 'skill':
					command = '使用技能';
					content = document.getElementById('skill-id').value;
					break;
				case 'item':
					command = '使用道具';
					content = document.getElementById('item-id').value;
					break;
				case 'pre-battle':
					command = '战前准备';
					content = '领取' + document.getElementById('fire-select').value;
					break;
			}
			
			vscode.postMessage({ command, content });
		});
		
		document.getElementById('retreat-btn').addEventListener('click', () => {
			vscode.postMessage({ command: '使用技能', content: '撤退' });
		});
		
		document.getElementById('pressure-btn').addEventListener('click', () => {
			vscode.postMessage({ command: '战前准备', content: '压血' });
		});
		
		document.getElementById('recover-btn').addEventListener('click', () => {
			vscode.postMessage({ command: '战前准备', content: '全精灵恢复' });
		});
	</script>`;
	}

	protected handleMessage(message: { command: string; content: string }): void {
		if (!checkXmFile()) {return;}
		
		if (message.command === '接管对战') {
			insertText(`接管对战=${message.content}`);
		} else if (message.command === '使用技能') {
			insertText(`使用技能=${message.content}`);
		} else if (message.command === '使用道具') {
			insertText(`使用道具=${message.content}`);
		} else if (message.command === '战前准备') {
			insertText(`战前准备=${message.content}`);
		}
	}
}