import { BaseView } from './baseView';
import { createInputRow, checkXmFile, insertText } from '../utils';

export class UseItemView extends BaseView {
	getContent(): string {
		const inputHtml = createInputRow(
			[{ id: 'item-input', type: 'text' }],
			[{ id: 'add-btn', text: '添加' }]
		);
		
		return `
	<div class="container">
		<div class="input-group">
			<span class="label">道具ID</span>
			${inputHtml}
		</div>
	</div>
	<script>
		const vscode = acquireVsCodeApi();
		document.getElementById('add-btn').addEventListener('click', () => {
			const input = document.getElementById('item-input');
			vscode.postMessage({ command: 'use-item', content: input.value });
		});
	</script>`;
	}

	protected handleMessage(message: { command: string; content: string }): void {
		if (!checkXmFile()) {return;}
		
		if (message.command === 'use-item') {
			insertText(`使用道具=${message.content}`);
		}
	}
}