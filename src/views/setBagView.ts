import * as vscode from 'vscode';
import { BaseView } from './baseView';

export class SetBagView extends BaseView {
	getContent(): string {
		return `
	<div class="container">
		<div class="input-group">
			<span class="label">精灵ID(每个ID之间用 | 分隔)</span>
			<input type="text" id="bag-input" value="3022|3437|3460" />
		</div>
		<div class="btn-row">
			<button id="set-btn">设置背包</button>
			<button id="restore-btn">还原背包</button>
		</div>
	</div>
	<script>
		const vscode = acquireVsCodeApi();
		document.getElementById('set-btn').addEventListener('click', () => {
			const input = document.getElementById('bag-input');
			vscode.postMessage({ command: 'set-bag', content: input.value });
		});
		document.getElementById('restore-btn').addEventListener('click', () => {
			vscode.postMessage({ command: 'restore-bag', content: '' });
		});
	</script>`;
	}

	protected handleMessage(message: { command: string; content: string }): void {
		if (!this.checkXmFile()) return;
		
		const editor = vscode.window.activeTextEditor;
		if (!editor) return;
		
		if (message.command === 'set-bag') {
			editor.edit((builder) => {
				builder.insert(editor.selection.active, `设置背包=${message.content}\n`);
			});
		} else if (message.command === 'restore-bag') {
			editor.edit((builder) => {
				builder.insert(editor.selection.active, '设置背包=还原背包\n');
			});
		}
	}
}