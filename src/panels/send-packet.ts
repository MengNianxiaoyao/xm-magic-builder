import type { PanelDescriptor } from '../shared/types';
import { renderActionButton } from '../core/renderer';

export const sendPacketPanel: PanelDescriptor = {
    id: 'xm-magic-builder.send-packet',
    title: '发包延时',
    fields: [],
    actions: [
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
    ],
    scripts: ['src/js/simpleAction.js'],
    getHtml() {
        const [pkt, delay, battleDelay] = this.actions;
        return `<div class="container">
            <div class="input-group">
                <span class="label">发包文本</span>
                <div class="input-row"><input type="text" id="packet-input" /> ${renderActionButton(pkt)}</div>
            </div>
            <div class="input-group">
                <span class="label">延时(毫秒)</span>
                <div class="input-row"><input type="number" id="delay-input" value="1000" /> ${renderActionButton(delay)}</div>
            </div>
            <div class="input-group">
                <span class="label">对战延时(毫秒)</span>
                <div class="input-row"><input type="number" id="battle-delay-input" value="1000" /> ${renderActionButton(battleDelay)}</div>
            </div>
        </div>`;
    },
};
