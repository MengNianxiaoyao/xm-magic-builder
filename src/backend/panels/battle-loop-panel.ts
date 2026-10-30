import type { PanelDescriptor } from '../panel-types';

export const battleLoopPanel: PanelDescriptor = {
    id: 'xm-magic-builder.battle-loop',
    title: '对战循环体',
    actions: [
        { command: 'battle-loop-head', template: '对战循环体=${content}头部' },
        { command: 'battle-loop-tail', template: '对战循环体=${content}尾部' },
    ],
    vue: { component: 'battle-loop' },
};
