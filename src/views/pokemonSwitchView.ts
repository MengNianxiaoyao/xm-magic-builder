import * as vscode from 'vscode';
import { BaseView } from './baseView';

export class PokemonSwitchView extends BaseView {
	getContent(): string {
		return `
	<div class="container">
		<div class="radio-group inline">
			<label class="radio-label">
				<input type="radio" name="switch-type" value="id" checked />
				<span>根据ID切换</span>
			</label>
			<label class="radio-label">
				<input type="radio" name="switch-type" value="position" />
				<span>根据背包位置切换</span>
			</label>
		</div>
		<div class="input-group">
			<span class="label">精灵ID/背包位置</span>
			<div class="input-row">
				<input type="number" id="pokemon-switch-input" value="5000" />
				<button id="add-btn">添加</button>
			</div>
		</div>
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
		if (message.command === 'add-pokemon-switch') {
			if (!this.checkXmFile()) return;
			
			const editor = vscode.window.activeTextEditor;
			if (!editor) return;
			
			const prefix = message.type === 'id' ? '精灵切换-ID' : '精灵切换-位置';
			editor.edit((builder) => {
				builder.insert(editor.selection.active, `${prefix}=${message.content}\n`);
			});
		}
	}
}