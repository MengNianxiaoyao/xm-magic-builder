import * as vscode from 'vscode';
import { BaseView } from './baseView';

export class UseItemView extends BaseView {
	getContent(): string {
		return `
	<div class="container">
		<div class="input-group">
			<span class="label">道具ID</span>
			<div class="input-row">
				<input type="text" id="item-input" />
				<button id="add-btn">添加</button>
			</div>
		</div>
	</div>
	<script>
		const vscode = acquireVsCodeApi();
		document.getElementById('add-btn').addEventListener('click', () => {
			const input = document.getElementById('item-input');
			vscode.postMessage({ command: 'use-item', content: input.value });
		});
	</script>`;
	}

	protected handleMessage(message: { command: string; content: string }): void {
		if (!this.checkXmFile()) return;
		
		const editor = vscode.window.activeTextEditor;
		if (!editor) return;
		
		if (message.command === 'use-item') {
			editor.edit((builder) => {
				builder.insert(editor.selection.active, `使用道具=${message.content}\n`);
			});
		}
	}
}