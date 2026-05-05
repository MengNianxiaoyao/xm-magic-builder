import { BaseView } from './baseView';
import { createInputRow, checkXmFile, insertText } from '../utils';

export class PokemonFirstView extends BaseView {
	getContent(): string {
		const inputHtml = createInputRow(
			[{ id: 'pokemon-id-input', type: 'number', value: '5000' }],
			[{ id: 'add-btn', text: '添加' }]
		);
		
		return `
	<div class="container">
		<div class="input-group">
			<span class="label">精灵ID</span>
			${inputHtml}
		</div>
	</div>
	<script>
		const vscode = acquireVsCodeApi();
		document.getElementById('add-btn').addEventListener('click', () => {
			const input = document.getElementById('pokemon-id-input');
			vscode.postMessage({ command: 'add-pokemon-first', content: input.value });
		});
	</script>`;
	}

	protected handleMessage(message: { command: string; content: string }): void {
		if (message.command === 'add-pokemon-first') {
			if (!checkXmFile()) {return;}
			insertText(`精灵首发=${message.content}`);
		}
	}
}