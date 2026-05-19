import { SimpleActionView, ActionItem } from './actions';
import { createTextarea } from '../utils';

export class OutputView extends SimpleActionView {
    protected getActions(): ActionItem[] {
        return [
            {
                id: 'add-btn',
                text: '信息输出',
                command: 'output',
                inputId: 'output-input',
                template: '信息输出=${content}',
                className: 'btn-block',
            },
        ];
    }

    protected getButtonRowStyle(): string {
        return '';
    }

    protected getFormFields(): string {
        const textareaHtml = createTextarea({
            id: 'output-input',
            value: '\\r\\n测试输出{1,十六进制,1,1}个,\\r\\n测试输出[变量1],\\r\\n测试输出#<3*2+1>#个',
        });
        return `
        <div class="input-group">
            <span class="label">在这里输入要输出的内容(换行可以用\\r\\n代替)</span>
            ${textareaHtml}
        </div>`;
    }
}
