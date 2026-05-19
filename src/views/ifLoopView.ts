import { SimpleActionView, ActionItem } from './actions';
import { createTextarea } from '../utils';

export class IfLoopView extends SimpleActionView {
    protected getActions(): ActionItem[] {
        return [
            {
                id: 'head-btn',
                text: '判断循环体头',
                command: 'if-loop-head',
                inputId: 'packet-param',
                condition: 'content',
                elseTemplate: '判断循环体=头部',
                template: '判断循环体=头部|${content}',
            },
            {
                id: 'tail-btn',
                text: '判断循环体尾',
                command: 'if-loop-tail',
                template: '判断循环体=尾部',
            },
            {
                id: 'break-btn',
                text: '跳出循环',
                command: 'if-loop-break',
                template: '判断循环体=跳出循环',
            },
        ];
    }

    protected getFormFields(): string {
        const textareaHtml = createTextarea({ id: 'packet-param' });
        return `
        <div class="input-group">
            <span class="label">发包参数</span>
            ${textareaHtml}
        </div>`;
    }
}
