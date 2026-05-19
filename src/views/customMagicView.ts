import { BaseView } from './baseView';
import {
    createCheckboxGroup,
    createTextInput,
    checkXmFile,
    insertText,
    showWarning,
} from '../utils';
import { ViewMessage } from '../types/messages';

export class CustomMagicView extends BaseView {
    protected getScriptPaths(): string[] {
        return ['resources/js/fileImport.js', 'resources/js/customMagic.js'];
    }

    getContent(): string {
        const checkboxHtml = createCheckboxGroup([
            { id: 'pass-current', label: '传入当前魔法变量' },
            { id: 'return-var', label: '返回调用魔法变量' },
        ]);

        const passwordHtml = createTextInput({ id: 'password' });
        const fileNameHtml = createTextInput({
            id: 'file-name',
            readonly: true,
        });
        const buttonsHtml = `
        <div class="button-row" style="display: flex; flex-wrap: wrap; gap: 8px 16px;">
            <button id="import-btn" class="btn" data-accept=".xmgic">导入魔法</button>
            <button id="add-btn" class="btn">添加</button>
        </div>`;

        return `
        <div class="container">
            ${checkboxHtml}
            <div class="input-group">
                <span class="label">魔法密码</span>
                ${passwordHtml}
            </div>
            <div class="input-group">
                <span class="label">自定义魔法</span>
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

        if (message.command === 'custom-magic-add') {
            const passwordPart = message.password ? `${message.password}` : '';
            const output = `自定义魔法=${message.passCurrent}|${message.returnVar}|${passwordPart}|${message.fileName}|${message.fileHex}`;
            await insertText(output);
        }
    }
}
