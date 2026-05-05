import { BaseView } from './baseView';
import { createSelect, createButtonRow, checkXmFile, insertText } from '../utils';

export class PreBattleView extends BaseView {
	getContent(): string {
		const selectHtml = createSelect({
			id: 'fire-select',
			options: [
				{ value: '绿火', label: '绿火' },
				{ value: '金火', label: '金火' },
				{ value: '紫火', label: '紫火' },
				{ value: '蓝火', label: '蓝火' },
			],
		});
		
		const buttonsHtml = createButtonRow([
			{ id: 'add-btn', text: '添加' },
			{ id: 'pressure-btn', text: '压血' },
			{ id: 'recover-btn', text: '全精灵恢复' },
		]);
		
		return `
	<div class="container">
		<div class="input-group">
			<span class="label">借火类型</span>
			${selectHtml}
		</div>
		${buttonsHtml}
	</div>
	<script>
		const vscode = acquireVsCodeApi();
		document.getElementById('add-btn').addEventListener('click', () => {
			const select = document.getElementById('fire-select');
			vscode.postMessage({ command: 'pre-battle-add', content: select.value });
		});
		document.getElementById('pressure-btn').addEventListener('click', () => {
			vscode.postMessage({ command: 'pre-battle-pressure', content: '' });
		});
		document.getElementById('recover-btn').addEventListener('click', () => {
			vscode.postMessage({ command: 'pre-battle-recover', content: '' });
		});
	</script>`;
	}

	protected handleMessage(message: { command: string; content: string }): void {
		if (!checkXmFile()) {return;}
		
		if (message.command === 'pre-battle-add') {
			insertText(`战前准备=领取${message.content}`);
		} else if (message.command === 'pre-battle-pressure') {
			insertText('战前准备=压血');
		} else if (message.command === 'pre-battle-recover') {
			insertText('战前准备=全精灵恢复');
		}
	}
}