import * as vscode from 'vscode';
import { BaseView } from './baseView';

export class DelayView extends BaseView {
	getContent(): string {
		return `
	<div class="container">
		<div class="input-group">
			<span class="label">延时(毫秒)</span>
			<div class="input-row">
				<input type="number" id="delay-input" value="1000" />
				<button id="add-delay-btn">添加</button>
			</div>
		</div>
		<div class="input-group">
			<span class="label">对战延时(毫秒)</span>
			<div class="input-row">
				<input type="number" id="battle-delay-input" value="1000" />
				<button id="add-battle-delay-btn">添加</button>
			</div>
		</div>
	</div>
	<script>
		const vscode = acquireVsCodeApi();
		document.getElementById('add-delay-btn').addEventListener('click', () => {
			const input = document.getElementById('delay-input');
			vscode.postMessage({ command: 'add-delay', content: input.value });
		});
		document.getElementById('add-battle-delay-btn').addEventListener('click', () => {
			const input = document.getElementById('battle-delay-input');
			vscode.postMessage({ command: 'add-battle-delay', content: input.value });
		});
	</script>`;
	}

	protected handleMessage(message: { command: string; content: string }): void {
		if (!this.checkXmFile()) return;
		
		const editor = vscode.window.activeTextEditor;
		if (!editor) return;
		
		if (message.command === 'add-delay') {
			editor.edit((builder) => {
				builder.insert(editor.selection.active, `延时=${message.content}\n`);
			});
		} else if (message.command === 'add-battle-delay') {
			editor.edit((builder) => {
				builder.insert(editor.selection.active, `对战延时=${message.content}\n`);
			});
		}
	}
}