import type { PanelDescriptor } from '../shared/types';

export const outputPanel: PanelDescriptor = {
    id: 'xm-magic-builder.output',
    title: '信息输出',
    fields: [
        {
            type: 'textarea',
            id: 'output-input',
            label: '在这里输入要输出的内容(换行可以用\\r\\n代替)',
            value: '\\r\\n测试输出{1,十六进制,1,1}个,\\r\\n测试输出[变量1],\\r\\n测试输出#<3*2+1>#个',
        },
    ],
    actions: [
        {
            id: 'add-btn',
            text: '信息输出',
            command: 'output',
            inputId: 'output-input',
            template: '信息输出=${content}',
            className: 'btn-block',
        },
    ],
    scripts: ['src/js/simpleAction.js'],
    buttonRowStyle: '',
};
