import { BaseView } from './baseView';
import {
    createTextInput,
    createButtonRow,
    checkXmFile,
    insertText,
} from '../utils';
import { COMMANDS } from '../constants/commands';
import { XM_KEYWORDS } from '../constants/xmKeywords';

export class CountLoopView extends BaseView {
    getContent(): string {
        const loopIdHtml = createTextInput({ id: 'loop-id', value: '标识1' });
        const valueHtml = createTextInput({ id: 'value', value: '[j]' });
        const initValueHtml = createTextInput({
            id: 'init-value',
            value: '[i]',
        });
        const buttonsHtml = createButtonRow([
            { id: 'head-btn', text: '计次循环体头' },
            { id: 'tail-btn', text: '计次循环体尾' },
        ]);

        return `
        <div class="container">
        <div class="input-group">
        <span class="label">循环标识</span>
        ${loopIdHtml}
        </div>
        <div class="input-group">
        <span class="label">指定值</span>
        ${valueHtml}
        </div>
        <div class="input-group">
        <span class="label">初始值赋值变量</span>
        ${initValueHtml}
        </div>
        ${buttonsHtml}
        </div>
        <script>
        const vscode = acquireVsCodeApi();
        document.getElementById('head-btn').addEventListener('click', () => {
        const loopId = document.getElementById('loop-id').value;
        const value = document.getElementById('value').value;
        const init = document.getElementById('init-value').value;
        vscode.postMessage({ command: '${COMMANDS.COUNT_LOOP_HEAD}', loopId, value, init });
        });
        document.getElementById('tail-btn').addEventListener('click', () => {
        const loopId = document.getElementById('loop-id').value;
        vscode.postMessage({ command: '${COMMANDS.COUNT_LOOP_TAIL}', loopId });
        });
        </script>`;
    }

    protected handleMessage(message: {
        command: string;
        loopId: string;
        value?: string;
        init?: string;
    }): void {
        if (!checkXmFile()) {
            return;
        }

        if (message.command === COMMANDS.COUNT_LOOP_HEAD) {
            insertText(
                `${XM_KEYWORDS.COUNT_LOOP}=${XM_KEYWORDS.LOOP_HEAD}|${message.loopId}|${message.value || ''}|${message.init || ''}`
            );
        } else if (message.command === COMMANDS.COUNT_LOOP_TAIL) {
            insertText(
                `${XM_KEYWORDS.COUNT_LOOP}=${XM_KEYWORDS.LOOP_TAIL}|${message.loopId}`
            );
        }
    }
}
