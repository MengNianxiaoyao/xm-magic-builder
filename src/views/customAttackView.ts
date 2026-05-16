import { BaseView } from './baseView';
import {
    createTextInput,
    createButtonRow,
    createFileImportHtml,
    createFileImportScript,
    checkXmFile,
    insertText,
    showWarning,
} from '../utils';
import { COMMANDS } from '../constants/commands';
import { XM_KEYWORDS } from '../constants/xmKeywords';

export class CustomAttackView extends BaseView {
    getContent(): string {
        const battlePacketHtml = createTextInput({ id: 'battle-packet' });
        const fileNameHtml = createTextInput({
            id: 'file-name',
            readonly: true,
        });
        const fileInputHtml = createFileImportHtml({
            fileInputId: 'file-input',
            fileNameInputId: 'file-name',
            importButtonId: 'import-btn',
            accept: '.xmcus',
        });
        const buttonsHtml = createButtonRow([
            { id: 'import-btn', text: '导入对战方案' },
            { id: 'add-btn', text: '添加' },
        ]);
        const fileImportScript = createFileImportScript({
            fileInputId: 'file-input',
            fileNameInputId: 'file-name',
            importButtonId: 'import-btn',
            variableName: 'fileHex',
        });

        return `
        <div class="container">
        <div class="input-group">
        <span class="label">对战包</span>
        ${battlePacketHtml}
        </div>
        <div class="input-group">
        <span class="label">自定义出招</span>
        ${fileNameHtml}
        </div>
        ${buttonsHtml}
        ${fileInputHtml}
        </div>
        <script>
        const vscode = acquireVsCodeApi();
        ${fileImportScript}

        document.getElementById('add-btn').addEventListener('click', () => {
        const battlePacket = document.getElementById('battle-packet').value;
        const fileName = document.getElementById('file-name').value;

        if (!battlePacket || !fileName) {
        vscode.postMessage({ command: '${COMMANDS.SHOW_WARNING}', message: '对战包/对战方案不得为空!' });
        return;
        }

        vscode.postMessage({
        command: '${COMMANDS.CUSTOM_ATTACK_ADD}',
        battlePacket,
        fileName,
        fileHex
        });
        });
        </script>`;
    }

    protected handleMessage(message: any): void {
        if (message.command === COMMANDS.SHOW_WARNING) {
            showWarning(message.message);
            return;
        }

        if (!checkXmFile()) {
            return;
        }

        if (message.command === COMMANDS.CUSTOM_ATTACK_ADD) {
            const output = `${XM_KEYWORDS.CUSTOM_ATTACK}=${message.battlePacket}|${message.fileName}|${message.fileHex}`;
            insertText(output);
        }
    }
}
