import * as vscode from 'vscode';
import { BaseView } from './baseView';
import { createTextInput, createButtonRow, createRadioGroup, checkXmFile, insertText } from '../utils';

export class PokemonOperationView extends BaseView {
	getContent(): string {
		const idInputHtml = createTextInput({ id: 'pokemon-id', type: 'number', value: '5000' });
		const posInputHtml = createTextInput({ id: 'pokemon-pos', type: 'number', value: '1' });
		const bagInputHtml = createTextInput({ id: 'bag-ids', value: '3022|3437|3460' });
		const radioHtml = createRadioGroup('pokemon-op', [
			{ value: 'first', label: '精灵首发', checked: true },
			{ value: 'switch-id', label: '精灵切换-ID' },
			{ value: 'switch-pos', label: '精灵切换-位置' },
			{ value: 'set-bag', label: '设置背包' },
		], false, 2);
		const buttonsHtml = createButtonRow([
			{ id: 'add-btn', text: '添加' },
			{ id: 'restore-btn', text: '还原背包' },
		], 2);
		
		return `
	<div class="container">
		${radioHtml}
		<div id="id-input-group" class="input-group">
			<span class="label">精灵ID</span>
			${idInputHtml}
		</div>
		<div id="pos-input-group" class="input-group" style="display: none;">
			<span class="label">精灵位置</span>
			${posInputHtml}
		</div>
		<div id="bag-input-group" class="input-group" style="display: none;">
			<span class="label">精灵ID(用 | 分隔)</span>
			${bagInputHtml}
		</div>
		${buttonsHtml}
	</div>
	<script>
		const vscode = acquireVsCodeApi();
		
		function toggleInput() {
			const op = document.querySelector('input[name="pokemon-op"]:checked').value;
			const idGroup = document.getElementById('id-input-group');
			const posGroup = document.getElementById('pos-input-group');
			const bagGroup = document.getElementById('bag-input-group');
			
			idGroup.style.display = 'none';
			posGroup.style.display = 'none';
			bagGroup.style.display = 'none';
			
			if (op === 'first' || op === 'switch-id') {
				idGroup.style.display = 'flex';
			} else if (op === 'switch-pos') {
				posGroup.style.display = 'flex';
			} else if (op === 'set-bag') {
				bagGroup.style.display = 'flex';
			}
		}
		
		document.querySelectorAll('input[name="pokemon-op"]').forEach(radio => {
			radio.addEventListener('change', toggleInput);
		});
		
		document.getElementById('add-btn').addEventListener('click', () => {
			const op = document.querySelector('input[name="pokemon-op"]:checked').value;
			const idValue = document.getElementById('pokemon-id').value;
			const posValue = document.getElementById('pokemon-pos').value;
			const bagValue = document.getElementById('bag-ids').value;
			
			let command = '';
			let content = '';
			
			switch (op) {
				case 'first':
					command = '精灵首发';
					content = idValue;
					break;
				case 'switch-id':
					command = '精灵切换-ID';
					content = idValue;
					break;
				case 'switch-pos':
					command = '精灵切换-位置';
					content = posValue;
					break;
				case 'set-bag':
					command = '设置背包';
					content = bagValue;
					break;
			}
			
			vscode.postMessage({ command, content });
		});
		
		document.getElementById('restore-btn').addEventListener('click', () => {
			vscode.postMessage({ command: '设置背包', content: '还原背包' });
		});
	</script>`;
	}

	protected handleMessage(message: { command: string; content: string }): void {
		if (!checkXmFile()) {return;}
		
		if (message.command === '精灵首发') {
			insertText(`精灵首发=${message.content}`);
		} else if (message.command === '精灵切换-ID') {
			insertText(`精灵切换-ID=${message.content}`);
		} else if (message.command === '精灵切换-位置') {
			insertText(`精灵切换-位置=${message.content}`);
		} else if (message.command === '设置背包') {
			insertText(`设置背包=${message.content}`);
		}
	}
}