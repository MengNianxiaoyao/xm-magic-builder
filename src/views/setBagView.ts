import { BaseView } from './baseView';
import { createTextInput, createButtonRow, checkXmFile, insertText } from '../utils';

export class SetBagView extends BaseView {
	getContent(): string {
		const inputHtml = createTextInput({ id: 'bag-input', value: '3022|3437|3460' });
		const buttonsHtml = createButtonRow([
			{ id: 'set-btn', text: '设置背包' },
			{ id: 'restore-btn', text: '还原背包' },
		]);
		
		return `
	<div class="container">
		<div class="input-group">
			<span class="label">精灵ID(每个ID之间用 | 分隔)</span>
			${inputHtml}
		</div>
		${buttonsHtml}
	</div>
	<script>
		const vscode = acquireVsCodeApi();
		document.getElementById('set-btn').addEventListener('click', () => {
			const input = document.getElementById('bag-input');
			vscode.postMessage({ command: 'set-bag', content: input.value });
		});
		document.getElementById('restore-btn').addEventListener('click', () => {
			vscode.postMessage({ command: 'restore-bag', content: '' });
		});
	</script>`;
	}

	protected handleMessage(message: { command: string; content: string }): void {
		if (!checkXmFile()) {return;}
		
		if (message.command === 'set-bag') {
			insertText(`设置背包=${message.content}`);
		} else if (message.command === 'restore-bag') {
			insertText('设置背包=还原背包');
		}
	}
}