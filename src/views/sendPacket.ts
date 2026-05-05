import * as vscode from 'vscode';
import { BaseView } from './baseView';
import { createInputRow, checkXmFile, insertText } from '../utils';

export class SendPacketView extends BaseView {
	getContent(): string {
		const inputHtml = createInputRow(
			[{ id: 'packet-input', type: 'text' }],
			[{ id: 'add-btn', text: '添加' }]
		);
		
		return `
	<div class="container">
		<span class="label">发包文本</span>
		${inputHtml}
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
			if (!checkXmFile()) {return;}
			insertText(`发包=${message.content}`);
		}
	}
}