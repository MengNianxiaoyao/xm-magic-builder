import { BaseView } from './baseView';
import {
    createSelect,
    createButtonRow,
    checkXmFile,
    insertText,
} from '../utils';
import { COMMANDS } from '../constants/commands';
import { XM_KEYWORDS } from '../constants/xmKeywords';

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
        vscode.postMessage({ command: '${COMMANDS.BATTLE_LOOP_HEAD}', content: select.value });
        });
        document.getElementById('tail-btn').addEventListener('click', () => {
        const select = document.getElementById('condition-select');
        vscode.postMessage({ command: '${COMMANDS.BATTLE_LOOP_TAIL}', content: select.value });
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

        if (message.command === COMMANDS.BATTLE_LOOP_HEAD) {
            insertText(
                `${XM_KEYWORDS.BATTLE_LOOP}=${message.content}${XM_KEYWORDS.LOOP_HEAD}`
            );
        } else if (message.command === COMMANDS.BATTLE_LOOP_TAIL) {
            insertText(
                `${XM_KEYWORDS.BATTLE_LOOP}=${message.content}${XM_KEYWORDS.LOOP_TAIL}`
            );
        }
    }
}
