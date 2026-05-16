import { BaseView } from './baseView';
import { createButtonRow, checkXmFile, insertText } from '../utils';
import { COMMANDS } from '../constants/commands';
import { XM_KEYWORDS } from '../constants/xmKeywords';

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
        vscode.postMessage({ command: '${COMMANDS.ATTACK_LOOP_HEAD}', content: '' });
        });
        document.getElementById('tail-btn').addEventListener('click', () => {
        vscode.postMessage({ command: '${COMMANDS.ATTACK_LOOP_TAIL}', content: '' });
        });
        </script>`;
    }

    protected handleMessage(message: {
        command: string;
        content: string;
    }): void {
        if (!checkXmFile()) {
            return;
        }

        if (message.command === COMMANDS.ATTACK_LOOP_HEAD) {
            insertText(`${XM_KEYWORDS.ATTACK_LOOP}=${XM_KEYWORDS.LOOP_HEAD}`);
        } else if (message.command === COMMANDS.ATTACK_LOOP_TAIL) {
            insertText(`${XM_KEYWORDS.ATTACK_LOOP}=${XM_KEYWORDS.LOOP_TAIL}`);
        }
    }
}
