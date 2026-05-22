import type { PanelDescriptor } from '../shared/types';

export const countLoopPanel: PanelDescriptor = {
    id: 'xm-magic-builder.count-loop',
    title: '计次循环体',
    fields: [
        {
            type: 'text',
            id: 'loop-id',
            label: '循环标识',
            value: '标识1',
        },
        {
            type: 'text',
            id: 'value',
            label: '指定值',
            value: '[j]',
        },
        {
            type: 'text',
            id: 'init-value',
            label: '初始值赋值变量',
            value: '[i]',
        },
    ],
    actions: [
        {
            id: 'head-btn',
            text: '计次循环体头',
            command: 'count-loop-head',
            inputs: {
                'loop-id': 'loopId',
                value: 'value',
                'init-value': 'init',
            },
            template: '计次循环体=头部|${loopId}|${value}|${init}',
        },
        {
            id: 'tail-btn',
            text: '计次循环体尾',
            command: 'count-loop-tail',
            inputs: {
                'loop-id': 'loopId',
            },
            template: '计次循环体=尾部|${loopId}',
        },
    ],
    scripts: ['src/js/simpleAction.js'],
};
