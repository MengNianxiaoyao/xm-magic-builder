import * as vscode from 'vscode';
import { BaseView } from './baseView';

export class WildPokemonView extends BaseView {
	getContent(): string {
		return `
	<div class="container">
		<div class="radio-group inline">
			<label class="radio-label">
				<input type="radio" name="wild-type" value="对战" checked />
				<span>对战</span>
			</label>
			<label class="radio-label">
				<input type="radio" name="wild-type" value="捕捉" />
				<span>捕捉</span>
			</label>
		</div>
		<div class="input-group">
			<span class="label">地图ID</span>
			<input type="number" id="map-id-input" value="0" />
		</div>
		<div class="input-group">
			<span class="label">精灵ID</span>
			<div class="input-row">
				<input type="number" id="pokemon-id-input" value="0" />
				<button id="add-btn">添加</button>
			</div>
		</div>
	</div>
	<script>
		const vscode = acquireVsCodeApi();
		document.getElementById('add-btn').addEventListener('click', () => {
			const mapInput = document.getElementById('map-id-input');
			const pokemonInput = document.getElementById('pokemon-id-input');
			const radio = document.querySelector('input[name="wild-type"]:checked');
			vscode.postMessage({ 
				command: 'wild-pokemon', 
				mapId: mapInput.value,
				pokemonId: pokemonInput.value,
				type: radio.value 
			});
		});
	</script>`;
	}

	protected handleMessage(message: { command: string; mapId: string; pokemonId: string; type: string }): void {
		if (!this.checkXmFile()) return;
		
		const editor = vscode.window.activeTextEditor;
		if (!editor) return;
		
		if (message.command === 'wild-pokemon') {
			editor.edit((builder) => {
				builder.insert(editor.selection.active, `野怪操作-${message.type}=${message.mapId}|${message.pokemonId}\n`);
			});
		}
	}
}