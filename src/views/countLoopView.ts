import { BaseView } from './baseView';
import { createTextInput, createButtonRow, checkXmFile, insertText } from '../utils';

export class CountLoopView extends BaseView {
	getContent(): string {
		const loopIdHtml = createTextInput({ id: 'loop-id', value: '标识1' });
		const valueHtml = createTextInput({ id: 'value', value: '[j]' });
		const initValueHtml = createTextInput({ id: 'init-value', value: '[i]' });
		const buttonsHtml = createButtonRow([
			{ id: 'head-btn', text: '计次循环体头' },
			{ id: 'tail-btn', text: '计次循环体尾' },
		]);
		
		return `
	<div class="container">
		<div class="input-group">
			<span class="label">循环标识</span>
			${loopIdHtml}
		</div>
		<div class="input-group">
			<span class="label">指定值</span>
			${valueHtml}
		</div>
		<div class="input-group">
			<span class="label">初始值赋值变量</span>
			${initValueHtml}
		</div>
		${buttonsHtml}
	</div>
	<script>
		const vscode = acquireVsCodeApi();
		document.getElementById('head-btn').addEventListener('click', () => {
			const loopId = document.getElementById('loop-id').value;
			const value = document.getElementById('value').value;
			const init = document.getElementById('init-value').value;
			vscode.postMessage({ command: 'count-loop-head', loopId, value, init });
		});
		document.getElementById('tail-btn').addEventListener('click', () => {
			const loopId = document.getElementById('loop-id').value;
			vscode.postMessage({ command: 'count-loop-tail', loopId });
		});
	</script>`;
	}

	protected handleMessage(message: { command: string; loopId: string; value?: string; init?: string }): void {
		if (!checkXmFile()) {return;}
		
		if (message.command === 'count-loop-head') {
			insertText(`计次循环体=头部|${message.loopId}|${message.value}|${message.init}`);
		} else if (message.command === 'count-loop-tail') {
			insertText(`计次循环体=尾部|${message.loopId}`);
		}
	}
}