import type { PanelDescriptor } from '../shared/types';

export const attackLoopPanel: PanelDescriptor = {
    id: 'xm-magic-builder.attack-loop',
    title: '出招循环体',
    fields: [],
    actions: [
        {
            id: 'head-btn',
            text: '出招循环体头',
            command: 'attack-loop-head',
            template: '出招循环体=头部',
        },
        {
            id: 'tail-btn',
            text: '出招循环体尾',
            command: 'attack-loop-tail',
            template: '出招循环体=尾部',
        },
    ],
    scripts: ['resources/js/simpleAction.js'],
};
