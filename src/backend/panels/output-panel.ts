import type { PanelDescriptor } from '../panel-types';

export const outputPanel: PanelDescriptor = {
    id: 'xm-magic-builder.output',
    title: '信息输出',
    actions: [{ command: 'output', template: '信息输出=${content}' }],
    vue: { component: 'output' },
};
