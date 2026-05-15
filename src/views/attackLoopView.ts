import { BaseView } from './baseView';
import { createButtonRow, checkXmFile, insertText } from '../utils';

export class AttackLoopView extends BaseView {
    getContent(): string {
        const buttonsHtml = createButtonRow([
            { id: 'head-btn', text: '出招循环体头' },
            { id: 'tail-btn', text: '出招循环体尾' },
        ]);

        return `
        <div class="container">
            ${buttonsHtml}
        </div>
        <script>
            const vscode = acquireVsCodeApi();
            document.getElementById('head-btn').addEventListener('click', () => {
                vscode.postMessage({ command: 'attack-loop-head', content: '' });
            });
            document.getElementById('tail-btn').addEventListener('click', () => {
                vscode.postMessage({ command: 'attack-loop-tail', content: '' });
            });
        </script>`;
    }

    protected handleMessage(message: { command: string; content: string }): void {
        if (!checkXmFile()) { return; }

        if (message.command === 'attack-loop-head') {
            insertText('出招循环体=头部');
        } else if (message.command === 'attack-loop-tail') {
            insertText('出招循环体=尾部');
        }
    }
}