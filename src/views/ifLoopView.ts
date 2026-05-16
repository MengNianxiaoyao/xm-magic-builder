import { BaseView } from './baseView';
import {
    createTextarea,
    createButtonRow,
    checkXmFile,
    insertText,
} from '../utils';
import { COMMANDS } from '../constants/commands';
import { XM_KEYWORDS } from '../constants/xmKeywords';

export class IfLoopView extends BaseView {
    getContent(): string {
        const textareaHtml = createTextarea({ id: 'packet-param' });
        const buttonsHeadTail = createButtonRow([
            { id: 'head-btn', text: '判断循环体头' },
            { id: 'tail-btn', text: '判断循环体尾' },
        ]);
        const buttonBreak = createButtonRow([
            { id: 'break-btn', text: '跳出循环' },
        ]);

        return `
    <div class="container">
    <div class="input-group">
    <span class="label">发包参数</span>
    ${textareaHtml}
    </div>
    ${buttonsHeadTail}
    ${buttonBreak}
    </div>
    <script>
    const vscode = acquireVsCodeApi();
    document.getElementById('head-btn').addEventListener('click', () => {
    const packetParam = document.getElementById('packet-param').value;
    vscode.postMessage({ command: '${COMMANDS.IF_LOOP_HEAD}', packetParam });
    });
    document.getElementById('tail-btn').addEventListener('click', () => {
    vscode.postMessage({ command: '${COMMANDS.IF_LOOP_TAIL}' });
    });
    document.getElementById('break-btn').addEventListener('click', () => {
    vscode.postMessage({ command: '${COMMANDS.IF_LOOP_BREAK}' });
    });
    </script>`;
    }

    protected handleMessage(message: {
        command: string;
        packetParam?: string;
    }): void {
        if (!checkXmFile()) {
            return;
        }

        if (message.command === COMMANDS.IF_LOOP_HEAD) {
            insertText(
                `${XM_KEYWORDS.IF_LOOP}=${XM_KEYWORDS.LOOP_HEAD}|${message.packetParam || ''}`
            );
        } else if (message.command === COMMANDS.IF_LOOP_TAIL) {
            insertText(`${XM_KEYWORDS.IF_LOOP}=${XM_KEYWORDS.LOOP_TAIL}`);
        } else if (message.command === COMMANDS.IF_LOOP_BREAK) {
            insertText(`${XM_KEYWORDS.IF_LOOP}=${XM_KEYWORDS.LOOP_BREAK}`);
        }
    }
}
