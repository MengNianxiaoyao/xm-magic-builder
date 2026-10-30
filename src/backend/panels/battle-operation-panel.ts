import type { PanelDescriptor } from '../panel-types';
import { keyValueHandler } from '../command-template';

export const battleOperationPanel: PanelDescriptor = {
    id: 'xm-magic-builder.battle-operation',
    title: '对战操作',
    actions: [],
    vue: { component: 'battle-operation' },
    handleMessage: keyValueHandler('接管对战', '使用技能', '使用道具', '战前准备'),
};
