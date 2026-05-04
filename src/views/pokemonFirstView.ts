import * as vscode from 'vscode';
import { BaseView } from './baseView';

export class PokemonFirstView extends BaseView {
	getContent(): string {
		return `
	<div class="container">
		<div class="input-group">
			<span class="label">精灵ID</span>
			<div class="input-row">
				<input type="number" id="pokemon-id-input" value="5000" />
				<button id="add-btn">添加</button>
			</div>
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
			if (!this.checkXmFile()) return;
			
			const editor = vscode.window.activeTextEditor;
			if (!editor) return;
			editor.edit((builder) => {
				builder.insert(editor.selection.active, `精灵首发=${message.content}\n`);
			});
		}
	}
}