import { BaseView } from './baseView';
import { createTextarea, createButtonRow, checkXmFile, insertText } from '../utils';

export class IfLoopView extends BaseView {
	getContent(): string {
		const textareaHtml = createTextarea({ id: 'packet-param' });
		const buttonsHeadTail = createButtonRow([
			{ id: 'head-btn', text: '判断循环体头' },
			{ id: 'tail-btn', text: '判断循环体尾' },
		]);
		const buttonBreak = createButtonRow([
			{ id: 'break-btn', text: '跳出循环' },
		]);
		
		return `
	<div class="container">
		<div class="input-group">
			<span class="label">发包参数</span>
			${textareaHtml}
		</div>
		${buttonsHeadTail}
		${buttonBreak}
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
		if (!checkXmFile()) {return;}
		
		if (message.command === 'if-loop-head') {
			insertText(`判断循环体=头部|${message.packetParam}`);
		} else if (message.command === 'if-loop-tail') {
			insertText('判断循环体=尾部');
		} else if (message.command === 'if-loop-break') {
			insertText('判断循环体=跳出循环');
		}
	}
}