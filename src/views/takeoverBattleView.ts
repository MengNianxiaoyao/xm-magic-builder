import * as vscode from 'vscode';
import { BaseView } from './baseView';

export class TakeoverBattleView extends BaseView {
	getContent(): string {
		return `
	<div class="container">
		<div class="input-group">
			<span class="label">对战包</span>
			<div class="input-row">
				<input type="text" id="battle-id-input" />
				<button id="add-btn">添加</button>
			</div>
		</div>
	</div>
	<script>
		const vscode = acquireVsCodeApi();
		document.getElementById('add-btn').addEventListener('click', () => {
			const input = document.getElementById('battle-id-input');
			vscode.postMessage({ command: 'add-takeover-battle', content: input.value });
		});
	</script>`;
	}

	protected handleMessage(message: { command: string; content: string }): void {
		if (message.command === 'add-takeover-battle') {
			if (!this.checkXmFile()) return;
			
			const editor = vscode.window.activeTextEditor;
			if (!editor) return;
			editor.edit((builder) => {
				builder.insert(editor.selection.active, `接管对战=${message.content}\n`);
			});
		}
	}
}