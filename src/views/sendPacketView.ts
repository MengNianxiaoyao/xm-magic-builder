import { BaseView } from './baseView';
import { createInputRow, checkXmFile, insertText } from '../utils';
import { COMMANDS } from '../constants/commands';
import { XM_KEYWORDS } from '../constants/xmKeywords';

export class SendPacketView extends BaseView {
    getContent(): string {
        const delayInput = createInputRow(
            [{ id: 'delay-input', type: 'number', value: '1000' }],
            [{ id: 'add-delay-btn', text: '添加' }]
        );

        const battleDelayInput = createInputRow(
            [{ id: 'battle-delay-input', type: 'number', value: '1000' }],
            [{ id: 'add-battle-delay-btn', text: '添加' }]
        );

        const packetInput = createInputRow(
            [{ id: 'packet-input', type: 'text' }],
            [{ id: 'add-packet-btn', text: '添加' }]
        );

        return `
        <div class="container">
        <div class="input-group">
        <span class="label">发包文本</span>
        ${packetInput}
        </div>
        <div class="input-group">
        <span class="label">延时 (毫秒)</span>
        ${delayInput}
        </div>
        <div class="input-group">
        <span class="label">对战延时 (毫秒)</span>
        ${battleDelayInput}
        </div>
        </div>
        <script>
        const vscode = acquireVsCodeApi();
        document.getElementById('add-delay-btn').addEventListener('click', () => {
        const input = document.getElementById('delay-input');
        vscode.postMessage({ command: '${COMMANDS.ADD_DELAY}', content: input.value });
        });
        document.getElementById('add-battle-delay-btn').addEventListener('click', () => {
        const input = document.getElementById('battle-delay-input');
        vscode.postMessage({ command: '${COMMANDS.ADD_BATTLE_DELAY}', content: input.value });
        });
        document.getElementById('add-packet-btn').addEventListener('click', () => {
        const input = document.getElementById('packet-input');
        vscode.postMessage({ command: '${COMMANDS.ADD_PACKET}', content: input.value });
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

        if (message.command === COMMANDS.ADD_DELAY) {
            insertText(`${XM_KEYWORDS.DELAY}=${message.content}`);
        } else if (message.command === COMMANDS.ADD_BATTLE_DELAY) {
            insertText(`${XM_KEYWORDS.BATTLE_DELAY}=${message.content}`);
        } else if (message.command === COMMANDS.ADD_PACKET) {
            insertText(`${XM_KEYWORDS.SEND_PACKET}=${message.content}`);
        }
    }
}
