import { BaseView } from './baseView';
import { createCheckboxGroup, createTextInput, createButtonRow, createFileImportHtml, createFileImportScript, checkXmFile, insertText, showWarning } from '../utils';

export class CustomMagicView extends BaseView {
	getContent(): string {
		const checkboxHtml = createCheckboxGroup([
			{ id: 'pass-current', label: '传入当前魔法变量' },
			{ id: 'return-var', label: '返回调用魔法变量' },
		]);

		const passwordHtml = createTextInput({ id: 'password' });
		const fileNameHtml = createTextInput({ id: 'file-name', readonly: true });
		const fileInputHtml = createFileImportHtml({
			fileInputId: 'file-input',
			fileNameInputId: 'file-name',
			importButtonId: 'import-btn',
			accept: '.xmgic',
		});
		const buttonsHtml = createButtonRow([
			{ id: 'import-btn', text: '导入魔法' },
			{ id: 'add-btn', text: '添加' },
		]);
		const fileImportScript = createFileImportScript({
			fileInputId: 'file-input',
			fileNameInputId: 'file-name',
			importButtonId: 'import-btn',
			variableName: 'fileHex',
		});

		return `
	<div class="container">
		${checkboxHtml}
		<div class="input-group">
			<span class="label">魔法密码</span>
			${passwordHtml}
		</div>
		<div class="input-group">
			<span class="label">自定义魔法</span>
			${fileNameHtml}
		</div>
		${buttonsHtml}
		${fileInputHtml}
	</div>
	<script>
		const vscode = acquireVsCodeApi();
		${fileImportScript}

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
			showWarning(message.message);
			return;
		}

		if (!checkXmFile()) {return;}

		if (message.command === 'custom-magic-add') {
			const passwordPart = message.password ? `|${message.password}` : '';
			const output = `自定义魔法=${message.passCurrent}|${message.returnVar}|${passwordPart}|${message.fileName}|${message.fileHex}`;
			insertText(output);
		}
	}
}