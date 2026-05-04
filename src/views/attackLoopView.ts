import * as vscode from 'vscode';
import { BaseView } from './baseView';

export class AttackLoopView extends BaseView {
	getContent(): string {
		return `
	<div class="container">
		<div class="btn-row">
			<button id="head-btn">出招循环体头</button>
			<button id="tail-btn">出招循环体尾</button>
		</div>
	</div>
	<script>
		const vscode = acquireVsCodeApi();
		document.getElementById('head-btn').addEventListener('click', () => {
			vscode.postMessage({ command: 'attack-loop-head', content: '' });
		});
		document.getElementById('tail-btn').addEventListener('click', () => {
			vscode.postMessage({ command: 'attack-loop-tail', content: '' });
		});
	</script>`;
	}

	protected handleMessage(message: { command: string; content: string }): void {
		if (!this.checkXmFile()) return;
		
		const editor = vscode.window.activeTextEditor;
		if (!editor) return;
		
		if (message.command === 'attack-loop-head') {
			editor.edit((builder) => {
				builder.insert(editor.selection.active, '出招循环体=头部\n');
			});
		} else if (message.command === 'attack-loop-tail') {
			editor.edit((builder) => {
				builder.insert(editor.selection.active, '出招循环体=尾部\n');
			});
		}
	}
}