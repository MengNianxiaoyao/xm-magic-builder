import { BaseView } from './baseView';
import { createSelect, createButtonRow, checkXmFile, insertText } from '../utils';

export class BattleLoopView extends BaseView {
    getContent(): string {
        const selectHtml = createSelect({
            id: 'condition-select',
            options: [
                { value: '对战胜利', label: '对战胜利' },
                { value: '对战未触发', label: '对战未触发' },
            ],
        });

        const buttonsHtml = createButtonRow([
            { id: 'head-btn', text: '对战循环体头' },
            { id: 'tail-btn', text: '对战循环体尾' },
        ]);

        return `
    <div class="container">
        <div class="input-group">
            <span class="label">条件类型</span>
            ${selectHtml}
        </div>
        ${buttonsHtml}
    </div>
    <script>
        const vscode = acquireVsCodeApi();
        document.getElementById('head-btn').addEventListener('click', () => {
            const select = document.getElementById('condition-select');
            vscode.postMessage({ command: 'battle-loop-head', content: select.value });
        });
        document.getElementById('tail-btn').addEventListener('click', () => {
            const select = document.getElementById('condition-select');
            vscode.postMessage({ command: 'battle-loop-tail', content: select.value });
        });
    </script>`;
    }

    protected handleMessage(message: { command: string; content: string }): void {
        if (!checkXmFile()) { return; }

        if (message.command === 'battle-loop-head') {
            insertText(`对战循环体=${message.content}头部`);
        } else if (message.command === 'battle-loop-tail') {
            insertText(`对战循环体=${message.content}尾部`);
        }
    }
}