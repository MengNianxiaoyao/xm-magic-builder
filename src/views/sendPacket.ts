import * as vscode from 'vscode';
import { BaseView } from './baseView';

export class SendPacketView extends BaseView {
	getContent(): string {
		return `
	<div class="container">
		<span class="label">发包文本</span>
		<div class="input-row">
			<input type="text" id="packet-input" />
			<button id="add-btn">添加</button>
		</div>
	</div>
	<script>
		const vscode = acquireVsCodeApi();
		document.getElementById('add-btn').addEventListener('click', () => {
			const input = document.getElementById('packet-input');
			vscode.postMessage({ command: 'add-packet', content: input.value });
		});
	</script>`;
	}

	protected handleMessage(message: { command: string; content: string }): void {
		if (message.command === 'add-packet') {
			if (!this.checkXmFile()) return;
			
			const editor = vscode.window.activeTextEditor;
			if (!editor) return;
			editor.edit((builder) => {
				builder.insert(editor.selection.active, `发包=${message.content}\n`);
			});
		}
	}
}