import * as vscode from 'vscode';
import { BaseView } from './baseView';

export class OutputView extends BaseView {
getContent(): string {
		return `
	<div class="container">
		<div class="input-group">
			<span class="label">在这里输入要输出的内容(换行可以用\\r\\n代替)</span>
			<textarea id="output-input" class="textarea-input" value="\\r\\n测试输出{1,十六进制,1,1}个,\\r\\n测试输出[变量1]，\\r\\n测试输出#<3*2+1>#个" ></textarea>
		</div>
		<button id="add-btn" class="btn-block">信息输出</button>
	</div>
		</div>
	</div>
	<script>
		const vscode = acquireVsCodeApi();
		document.getElementById('add-btn').addEventListener('click', () => {
			const input = document.getElementById('output-input');
			vscode.postMessage({ command: 'output', content: input.value });
		});
	</script>`;
	}

	protected handleMessage(message: { command: string; content: string }): void {
		if (!this.checkXmFile()) return;
		
		const editor = vscode.window.activeTextEditor;
		if (!editor) return;
		
		if (message.command === 'output') {
			editor.edit((builder) => {
				builder.insert(editor.selection.active, `信息输出=${message.content}\n`);
			});
		}
	}
}