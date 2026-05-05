import * as vscode from 'vscode';
import { BaseView } from './baseView';

export class CustomAttackView extends BaseView {
	getContent(): string {
		return `
	<div class="container">
		<div class="input-group">
			<span class="label">对战包</span>
			<input type="text" id="battle-packet" />
		</div>
		<div class="input-group">
			<span class="label">自定义出招</span>
			<input type="text" id="file-name" readonly />
		</div>
		<div class="btn-row">
			<button id="import-btn">导入对战方案</button>
			<button id="add-btn">添加</button>
		</div>
		<input type="file" id="file-input" accept=".xmcus" style="display: none;" />
	</div>
	<script>
		const vscode = acquireVsCodeApi();
		let fileHex = '';
		
		document.getElementById('import-btn').addEventListener('click', () => {
			document.getElementById('file-input').click();
		});
		
		document.getElementById('file-input').addEventListener('change', (e) => {
			const file = e.target.files[0];
			if (file) {
				document.getElementById('file-name').value = file.name;
				const reader = new FileReader();
				reader.onload = function(event) {
					const bytes = new Uint8Array(event.target.result);
					fileHex = '';
					for (let i = 0; i < bytes.length; i++) {
						fileHex += bytes[i].toString(16).padStart(2, '0').toUpperCase();
					}
					fileHex = fileHex.replace(/0+$/, '');
				};
				reader.readAsArrayBuffer(file);
			}
		});
		
		document.getElementById('add-btn').addEventListener('click', () => {
			const battlePacket = document.getElementById('battle-packet').value;
			const fileName = document.getElementById('file-name').value;
			
			if (!battlePacket || !fileName) {
				vscode.postMessage({ command: 'show-warning', message: '对战包/对战方案不得为空!' });
				return;
			}
			
			vscode.postMessage({ 
				command: 'custom-attack-add', 
				battlePacket, 
				fileName, 
				fileHex 
			});
		});
	</script>`;
	}

	protected handleMessage(message: any): void {
		if (message.command === 'show-warning') {
			vscode.window.showWarningMessage(message.message);
			return;
		}
		
		if (!this.checkXmFile()) return;
		
		const editor = vscode.window.activeTextEditor;
		if (!editor) return;
		
		if (message.command === 'custom-attack-add') {
			const output = `自定义出招=${message.battlePacket}|${message.fileName}|${message.fileHex}`;
			editor.edit((builder) => {
				builder.insert(editor.selection.active, output + '\n');
			});
		}
	}
}