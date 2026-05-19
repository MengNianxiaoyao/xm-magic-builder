import { SimpleActionView, ActionItem } from './actions';
import { createSelect } from '../utils';

export class BattleLoopView extends SimpleActionView {
    protected getActions(): ActionItem[] {
        return [
            {
                id: 'head-btn',
                text: '对战循环体头',
                command: 'battle-loop-head',
                inputId: 'condition-select',
                template: '对战循环体=${content}头部',
            },
            {
                id: 'tail-btn',
                text: '对战循环体尾',
                command: 'battle-loop-tail',
                inputId: 'condition-select',
                template: '对战循环体=${content}尾部',
            },
        ];
    }

    protected getFormFields(): string {
        const selectHtml = createSelect({
            id: 'condition-select',
            options: [
                { value: '对战胜利', label: '对战胜利' },
                { value: '对战未触发', label: '对战未触发' },
            ],
        });
        return `
        <div class="input-group">
            <span class="label">条件类型</span>
            ${selectHtml}
        </div>`;
    }
}
