import { BaseView } from './baseView';
import {
    createTextInput,
    checkXmFile,
    insertText,
    showWarning,
} from '../utils';
import { ViewMessage } from '../types/messages';

export class CustomAttackView extends BaseView {
    protected getScriptPaths(): string[] {
        return ['resources/js/fileImport.js', 'resources/js/customAttack.js'];
    }

    getContent(): string {
        const battlePacketHtml = createTextInput({ id: 'battle-packet' });
        const fileNameHtml = createTextInput({
            id: 'file-name',
            readonly: true,
        });
        const buttonsHtml = `
        <div class="button-row" style="display: flex; flex-wrap: wrap; gap: 8px 16px;">
            <button id="import-btn" class="btn" data-accept=".xmcus">导入对战方案</button>
            <button id="add-btn" class="btn">添加</button>
        </div>`;

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
        </div>`;
    }

    protected async handleMessage(message: ViewMessage): Promise<void> {
        if (message.command === 'show-warning') {
            showWarning(message.message);
            return;
        }

        if (!checkXmFile()) {
            return;
        }

        if (message.command === 'custom-attack-add') {
            const output = `自定义出招=${message.battlePacket}|${message.fileName}|${message.fileHex}`;
            await insertText(output);
        }
    }
}
