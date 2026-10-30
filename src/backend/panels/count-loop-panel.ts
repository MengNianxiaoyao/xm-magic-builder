import type { PanelDescriptor } from '../panel-types';

export const countLoopPanel: PanelDescriptor = {
    id: 'xm-magic-builder.count-loop',
    title: '计次循环体',
    actions: [
        { command: 'count-loop-head', template: '计次循环体=头部|${loopId}|${value}|${init}' },
        { command: 'count-loop-tail', template: '计次循环体=尾部|${loopId}' },
    ],
    vue: { component: 'count-loop' },
};
