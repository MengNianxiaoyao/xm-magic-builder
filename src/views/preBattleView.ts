import * as vscode from 'vscode';
import { BaseView } from './baseView';

export class PreBattleView extends BaseView {
getContent(): string {
		return `
	<div class="container">
		<div class="input-group">
			<span class="label">借火类型</span>
			<select id="fire-select">
				<option value="绿火">绿火</option>
				<option value="金火">金火</option>
				<option value="紫火">紫火</option>
				<option value="蓝火">蓝火</option>
			</select>
		</div>
		<div class="btn-row">
			<button id="add-btn">添加</button>
			<button id="pressure-btn">压血</button>
			<button id="recover-btn">全精灵恢复</button>
		</div>
	</div>
	<script>
		const vscode = acquireVsCodeApi();
		document.getElementById('add-btn').addEventListener('click', () => {
			const select = document.getElementById('fire-select');
			vscode.postMessage({ command: 'pre-battle-add', content: select.value });
		});
		document.getElementById('pressure-btn').addEventListener('click', () => {
			vscode.postMessage({ command: 'pre-battle-pressure', content: '' });
		});
		document.getElementById('recover-btn').addEventListener('click', () => {
			vscode.postMessage({ command: 'pre-battle-recover', content: '' });
		});
	</script>`;
	}

	protected handleMessage(message: { command: string; content: string }): void {
		if (!this.checkXmFile()) return;
		
		const editor = vscode.window.activeTextEditor;
		if (!editor) return;
		
		if (message.command === 'pre-battle-add') {
			editor.edit((builder) => {
				builder.insert(editor.selection.active, `战前准备=领取${message.content}\n`);
			});
		} else if (message.command === 'pre-battle-pressure') {
			editor.edit((builder) => {
				builder.insert(editor.selection.active, '战前准备=压血\n');
			});
		} else if (message.command === 'pre-battle-recover') {
			editor.edit((builder) => {
				builder.insert(editor.selection.active, '战前准备=全精灵恢复\n');
			});
		}
	}
}