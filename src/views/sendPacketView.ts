import { SimpleActionView, ActionItem, renderActionRow } from './actions';

export class SendPacketView extends SimpleActionView {
    protected getActions(): ActionItem[] {
        return [
            {
                id: 'add-packet-btn',
                text: '添加',
                command: 'add-packet',
                inputId: 'packet-input',
                template: '发包=${content}',
            },
            {
                id: 'add-delay-btn',
                text: '添加',
                command: 'add-delay',
                inputId: 'delay-input',
                template: '延时=${content}',
            },
            {
                id: 'add-battle-delay-btn',
                text: '添加',
                command: 'add-battle-delay',
                inputId: 'battle-delay-input',
                template: '对战延时=${content}',
            },
        ];
    }

    getContent(): string {
        return `
        <div class="container">
            <div class="input-group">
                <span class="label">发包文本</span>
                ${renderActionRow('<input type="text" id="packet-input" />', this.getActions()[0])}
            </div>
            <div class="input-group">
                <span class="label">延时(毫秒)</span>
                ${renderActionRow('<input type="number" id="delay-input" value="1000" />', this.getActions()[1])}
            </div>
            <div class="input-group">
                <span class="label">对战延时(毫秒)</span>
                ${renderActionRow('<input type="number" id="battle-delay-input" value="1000" />', this.getActions()[2])}
            </div>
        </div>`;
    }
}
