import type { PanelDescriptor } from '../shared/types';

export const ifLoopPanel: PanelDescriptor = {
    id: 'xm-magic-builder.if-loop',
    title: '判断循环体',
    fields: [
        {
            type: 'textarea',
            id: 'packet-param',
            label: '发包参数',
        },
    ],
    actions: [
        {
            id: 'head-btn',
            text: '判断循环体头',
            command: 'if-loop-head',
            inputId: 'packet-param',
            condition: 'content',
            elseTemplate: '判断循环体=头部',
            template: '判断循环体=头部|${content}',
        },
        {
            id: 'tail-btn',
            text: '判断循环体尾',
            command: 'if-loop-tail',
            template: '判断循环体=尾部',
        },
        {
            id: 'break-btn',
            text: '跳出循环',
            command: 'if-loop-break',
            template: '判断循环体=跳出循环',
        },
    ],
    scripts: ['resources/js/simpleAction.js'],
};
