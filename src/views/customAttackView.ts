import * as vscode from 'vscode';
import { BaseView } from './baseView';
import { createTextInput, createButtonRow, checkXmFile, insertText, showWarning } from '../utils';

export class CustomAttackView extends BaseView {
	getContent(): string {
		const battlePacketHtml = createTextInput({ id: 'battle-packet' });
		const fileNameHtml = createTextInput({ id: 'file-name', readonly: true });
		const fileInputHtml = `<input type="file" id="file-input" accept=".xmcus" style="display: none;" />`;
		const buttonsHtml = createButtonRow([
			{ id: 'import-btn', text: '导入对战方案' },
			{ id: 'add-btn', text: '添加' },
		]);
		
		return `
	<div class="container">
		<div class="input-group">
			<span class="label">对战包</span>
			${battlePacketHtml}
		</div>
		<div class="input-group">
			<span class="label">自定义出招</span>
			${fileNameHtml}
		</div>
		${buttonsHtml}
		${fileInputHtml}
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
			showWarning(message.message);
			return;
		}
		
		if (!checkXmFile()) {return;}
		
		if (message.command === 'custom-attack-add') {
			const output = `自定义出招=${message.battlePacket}|${message.fileName}|${message.fileHex}`;
			insertText(output);
		}
	}
}