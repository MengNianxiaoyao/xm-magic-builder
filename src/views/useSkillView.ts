import { BaseView } from './baseView';
import { createTextInput, createButtonRow, checkXmFile, insertText } from '../utils';

export class UseSkillView extends BaseView {
	getContent(): string {
		const inputHtml = createTextInput({ id: 'skill-input' });
		const buttonsHtml = createButtonRow([
			{ id: 'add-btn', text: '添加' },
			{ id: 'retreat-btn', text: '对战撤退' },
		]);
		
		return `
	<div class="container">
		<div class="input-group">
			<span class="label">技能ID</span>
			${inputHtml}
		</div>
		${buttonsHtml}
	</div>
	<script>
		const vscode = acquireVsCodeApi();
		document.getElementById('add-btn').addEventListener('click', () => {
			const input = document.getElementById('skill-input');
			vscode.postMessage({ command: 'use-skill', content: input.value });
		});
		document.getElementById('retreat-btn').addEventListener('click', () => {
			vscode.postMessage({ command: 'use-skill-retreat', content: '' });
		});
	</script>`;
	}

	protected handleMessage(message: { command: string; content: string }): void {
		if (!checkXmFile()) {return;}
		
		if (message.command === 'use-skill') {
			insertText(`使用技能=${message.content}`);
		} else if (message.command === 'use-skill-retreat') {
			insertText('使用技能=撤退');
		}
	}
}