import type { PanelDescriptor } from '../panel-types';

export const sendPacketPanel: PanelDescriptor = {
    id: 'xm-magic-builder.send-packet',
    title: '发包延时',
    actions: [
        { command: 'add-packet', template: '发包=${content}' },
        { command: 'add-delay', template: '延时=${content}' },
        { command: 'add-battle-delay', template: '对战延时=${content}' },
    ],
    vue: { component: 'send-packet' },
};
