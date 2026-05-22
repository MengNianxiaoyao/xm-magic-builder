import type { PanelDescriptor } from '../shared/types';

export const battleLoopPanel: PanelDescriptor = {
    id: 'xm-magic-builder.battle-loop',
    title: '对战循环体',
    fields: [
        {
            type: 'select',
            id: 'condition-select',
            label: '条件类型',
            options: [
                { value: '对战胜利', label: '对战胜利' },
                { value: '对战未触发', label: '对战未触发' },
            ],
        },
    ],
    actions: [
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
    ],
    scripts: ['src/js/simpleAction.js'],
};
