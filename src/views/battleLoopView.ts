import * as vscode from 'vscode';
import { BaseView } from './baseView';

export class BattleLoopView extends BaseView {
	getContent(): string {
		return `
	<div class="container">
		<div class="input-group">
			<span class="label">条件类型</span>
			<select id="condition-select">
				<option value="对战胜利">对战胜利</option>
				<option value="对战未触发">对战未触发</option>
			</select>
		</div>
		<div class="btn-row">
			<button id="head-btn">对战循环体头</button>
			<button id="tail-btn">对战循环体尾</button>
		</div>
	</div>
	<script>
		const vscode = acquireVsCodeApi();
		document.getElementById('head-btn').addEventListener('click', () => {
			const select = document.getElementById('condition-select');
			vscode.postMessage({ command: 'battle-loop-head', content: select.value });
		});
		document.getElementById('tail-btn').addEventListener('click', () => {
			const select = document.getElementById('condition-select');
			vscode.postMessage({ command: 'battle-loop-tail', content: select.value });
		});
	</script>`;
	}

	protected handleMessage(message: { command: string; content: string }): void {
		if (!this.checkXmFile()) return;
		
		const editor = vscode.window.activeTextEditor;
		if (!editor) return;
		
		if (message.command === 'battle-loop-head') {
			editor.edit((builder) => {
				builder.insert(editor.selection.active, `对战循环体=${message.content}头部\n`);
			});
		} else if (message.command === 'battle-loop-tail') {
			editor.edit((builder) => {
				builder.insert(editor.selection.active, `对战循环体=${message.content}尾部\n`);
			});
		}
	}
}