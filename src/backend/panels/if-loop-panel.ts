import type { PanelDescriptor } from '../panel-types';

export const ifLoopPanel: PanelDescriptor = {
    id: 'xm-magic-builder.if-loop',
    title: '判断循环体',
    actions: [
        {
            command: 'if-loop-head',
            condition: 'content',
            elseTemplate: '判断循环体=头部',
            template: '判断循环体=头部|${content}',
        },
        { command: 'if-loop-tail', template: '判断循环体=尾部' },
        { command: 'if-loop-break', template: '判断循环体=跳出循环' },
    ],
    vue: { component: 'if-loop' },
};
