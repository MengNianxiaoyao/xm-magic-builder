import type { PanelDescriptor } from '../../../shared/types';

export const outputPanel: PanelDescriptor = {
    id: 'xm-magic-builder.output',
    title: '信息输出',
    fields: [
        {
            type: 'textarea',
            id: 'output-input',
            label: '输出内容(换行用\\r\\n代替)',
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
    scripts: ['resources/js/panels/simple-action.js'],
    buttonRowStyle: '',
};
