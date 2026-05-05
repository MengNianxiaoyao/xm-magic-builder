import * as vscode from 'vscode';
import { BaseView } from './baseView';

export class CountLoopView extends BaseView {
	getContent(): string {
		return `
	<div class="container">
		<div class="input-group">
			<span class="label">循环标识</span>
			<input type="text" id="loop-id" value="标识1" />
		</div>
		<div class="input-group">
			<span class="label">指定值</span>
			<input type="text" id="value" value="[j]" />
		</div>
		<div class="input-group">
			<span class="label">初始值赋值变量</span>
			<input type="text" id="init-value" value="[i]" />
		</div>
		<div class="btn-row">
			<button id="head-btn">计次循环体头</button>
			<button id="tail-btn">计次循环体尾</button>
		</div>
	</div>
	<script>
		const vscode = acquireVsCodeApi();
		document.getElementById('head-btn').addEventListener('click', () => {
			const loopId = document.getElementById('loop-id').value;
			const value = document.getElementById('value').value;
			const init = document.getElementById('init-value').value;
			vscode.postMessage({ command: 'count-loop-head', loopId, value, init });
		});
		document.getElementById('tail-btn').addEventListener('click', () => {
			const loopId = document.getElementById('loop-id').value;
			vscode.postMessage({ command: 'count-loop-tail', loopId });
		});
	</script>`;
	}

	protected handleMessage(message: { command: string; loopId: string; value?: string; init?: string }): void {
		if (!this.checkXmFile()) return;
		
		const editor = vscode.window.activeTextEditor;
		if (!editor) return;
		
		if (message.command === 'count-loop-head') {
			editor.edit((builder) => {
				builder.insert(editor.selection.active, `计次循环体=头部|${message.loopId}|[${message.value}]|[${message.init}]\n`);
			});
		} else if (message.command === 'count-loop-tail') {
			editor.edit((builder) => {
				builder.insert(editor.selection.active, `计次循环体=尾部|${message.loopId}\n`);
			});
		}
	}
}