import { BaseView } from './baseView';
import { createTextarea, checkXmFile, insertText } from '../utils';

export class OutputView extends BaseView {
	getContent(): string {
		const textareaHtml = createTextarea({
			id: 'output-input',
			value: '\\r\\n测试输出{1,十六进制,1,1}个,\\r\\n测试输出[变量1],\\r\\n测试输出#<3*2+1>#个',
		});
		
		return `
	<div class="container">
		<div class="input-group">
			<span class="label">在这里输入要输出的内容(换行可以用\\r\\n代替)</span>
			${textareaHtml}
		</div>
		<button id="add-btn" class="btn-block">信息输出</button>
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
		if (!checkXmFile()) {return;}
		
		if (message.command === 'output') {
			insertText(`信息输出=${message.content}`);
		}
	}
}