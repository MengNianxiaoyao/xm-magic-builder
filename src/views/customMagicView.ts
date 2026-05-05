import * as vscode from 'vscode';
import { BaseView } from './baseView';

export class CustomMagicView extends BaseView {
	getContent(): string {
		return `
	<div class="container">
		<div class="checkbox-group">
			<label class="checkbox-label">
				<input type="checkbox" id="pass-current" />
				<span>传入当前魔法变量</span>
			</label>
			<label class="checkbox-label">
				<input type="checkbox" id="return-var" />
				<span>返回调用魔法变量</span>
			</label>
		</div>
		<div class="input-group">
			<span class="label">魔法密码</span>
			<input type="text" id="password" />
		</div>
		<div class="input-group">
			<span class="label">自定义魔法</span>
			<input type="text" id="file-name" readonly />
		</div>
		<div class="btn-row">
			<button id="import-btn">导入魔法</button>
			<button id="add-btn">添加</button>
		</div>
		<input type="file" id="file-input" accept=".xmgic" style="display: none;" />
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
			const passCurrent = document.getElementById('pass-current').checked ? '1' : '0';
			const returnVar = document.getElementById('return-var').checked ? '1' : '0';
			const password = document.getElementById('password').value;
			const fileName = document.getElementById('file-name').value;
			
			if (!fileName) {
				vscode.postMessage({ command: 'show-warning', message: '自定义魔法不得为空!' });
				return;
			}
			
			vscode.postMessage({ 
				command: 'custom-magic-add', 
				passCurrent, 
				returnVar, 
				password, 
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
		
		if (message.command === 'custom-magic-add') {
			const passwordPart = message.password ? `|${message.password}` : '';
			const output = `自定义魔法=${message.passCurrent}|${message.returnVar}|${passwordPart}|${message.fileName}|${message.fileHex}`;
			editor.edit((builder) => {
				builder.insert(editor.selection.active, output + '\n');
			});
		}
	}
}