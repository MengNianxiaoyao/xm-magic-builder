import * as vscode from 'vscode';
import { BaseView } from './baseView';

export class IfLoopView extends BaseView {
getContent(): string {
return `
	<div class="container">
		<div class="input-group">
			<span class="label">发包参数</span>
			<textarea id="packet-param" class="textarea-input"></textarea>
		</div>
		<div class="btn-row">
			<button id="head-btn">判断循环体头</button>
			<button id="tail-btn">判断循环体尾</button>
		</div>
		<div class="btn-row">
			<button id="break-btn">跳出循环</button>
		</div>
	</div>
	<script>
		const vscode = acquireVsCodeApi();
		document.getElementById('head-btn').addEventListener('click', () => {
			const packetParam = document.getElementById('packet-param').value;
			vscode.postMessage({ command: 'if-loop-head', packetParam });
		});
		document.getElementById('tail-btn').addEventListener('click', () => {
			vscode.postMessage({ command: 'if-loop-tail' });
		});
		document.getElementById('break-btn').addEventListener('click', () => {
			vscode.postMessage({ command: 'if-loop-break' });
		});
	</script>`;
	}

	protected handleMessage(message: { command: string; packetParam?: string }): void {
		if (!this.checkXmFile()) return;
		
		const editor = vscode.window.activeTextEditor;
		if (!editor) return;
		
		if (message.command === 'if-loop-head') {
			editor.edit((builder) => {
				builder.insert(editor.selection.active, `判断循环体=头部|${message.packetParam}\n`);
			});
		} else if (message.command === 'if-loop-tail') {
			editor.edit((builder) => {
				builder.insert(editor.selection.active, '判断循环体=尾部\n');
			});
		} else if (message.command === 'if-loop-break') {
			editor.edit((builder) => {
				builder.insert(editor.selection.active, '判断循环体=跳出循环\n');
			});
		}
	}
}