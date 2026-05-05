import { BaseView } from './baseView';
import { createInputRow, checkXmFile, insertText } from '../utils';

export class TakeoverBattleView extends BaseView {
	getContent(): string {
		const inputHtml = createInputRow(
			[{ id: 'battle-id-input', type: 'text' }],
			[{ id: 'add-btn', text: '添加' }]
		);
		
		return `
	<div class="container">
		<div class="input-group">
			<span class="label">对战包</span>
			${inputHtml}
		</div>
	</div>
	<script>
		const vscode = acquireVsCodeApi();
		document.getElementById('add-btn').addEventListener('click', () => {
			const input = document.getElementById('battle-id-input');
			vscode.postMessage({ command: 'add-takeover-battle', content: input.value });
		});
	</script>`;
	}

	protected handleMessage(message: { command: string; content: string }): void {
		if (message.command === 'add-takeover-battle') {
			if (!checkXmFile()) {return;}
			insertText(`接管对战=${message.content}`);
		}
	}
}