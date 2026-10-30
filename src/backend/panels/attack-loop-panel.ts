import type { PanelDescriptor } from '../panel-types';

export const attackLoopPanel: PanelDescriptor = {
    id: 'xm-magic-builder.attack-loop',
    title: '出招循环体',
    actions: [
        { command: 'attack-loop-head', template: '出招循环体=头部' },
        { command: 'attack-loop-tail', template: '出招循环体=尾部' },
    ],
    vue: { component: 'attack-loop' },
};
