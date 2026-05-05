import * as vscode from 'vscode';
import { BaseView } from './baseView';
import { createRadioGroup, createInputRow, checkXmFile, insertText } from '../utils';

export class PokemonSwitchView extends BaseView {
	getContent(): string {
		const radioHtml = createRadioGroup('switch-type', [
			{ value: 'id', label: '根据ID切换', checked: true },
			{ value: 'position', label: '根据背包位置切换' },
		], true);
		
		const inputHtml = createInputRow(
			[{ id: 'pokemon-switch-input', type: 'number', value: '5000' }],
			[{ id: 'add-btn', text: '添加' }]
		);
		
		return `
	<div class="container">
		${radioHtml}
		${inputHtml}
	</div>
	<script>
		const vscode = acquireVsCodeApi();
		document.getElementById('add-btn').addEventListener('click', () => {
			const input = document.getElementById('pokemon-switch-input');
			const radio = document.querySelector('input[name="switch-type"]:checked');
			vscode.postMessage({ 
				command: 'add-pokemon-switch', 
				content: input.value,
				type: radio.value 
			});
		});
	</script>`;
	}

	protected handleMessage(message: { command: string; content: string; type: string }): void {
		if (!checkXmFile()) {return;}
		
		const prefix = message.type === 'id' ? '精灵切换-ID' : '精灵切换-位置';
		insertText(`${prefix}=${message.content}`);
	}
}