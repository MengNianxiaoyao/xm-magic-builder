import * as vscode from 'vscode';
import { BaseView } from './baseView';

export class UseSkillView extends BaseView {
	getContent(): string {
		return `
	<div class="container">
		<div class="input-group">
			<span class="label">技能ID</span>
			<input type="text" id="skill-input" />
		</div>
		<div class="btn-row">
			<button id="add-btn">添加</button>
			<button id="retreat-btn">对战撤退</button>
		</div>
	</div>
	<script>
		const vscode = acquireVsCodeApi();
		document.getElementById('add-btn').addEventListener('click', () => {
			const input = document.getElementById('skill-input');
			vscode.postMessage({ command: 'use-skill', content: input.value });
		});
		document.getElementById('retreat-btn').addEventListener('click', () => {
			vscode.postMessage({ command: 'use-skill-retreat', content: '' });
		});
	</script>`;
	}

	protected handleMessage(message: { command: string; content: string }): void {
		if (!this.checkXmFile()) return;
		
		const editor = vscode.window.activeTextEditor;
		if (!editor) return;
		
		if (message.command === 'use-skill') {
			editor.edit((builder) => {
				builder.insert(editor.selection.active, `使用技能=${message.content}\n`);
			});
		} else if (message.command === 'use-skill-retreat') {
			editor.edit((builder) => {
				builder.insert(editor.selection.active, '使用技能=撤退\n');
			});
		}
	}
}