import type { PanelDescriptor } from '../panel-types';
import { keyValueHandler } from '../command-template';

export const pokemonOperationPanel: PanelDescriptor = {
    id: 'xm-magic-builder.pokemon-operation',
    title: '精灵操作',
    actions: [],
    vue: { component: 'pokemon-operation' },
    handleMessage: keyValueHandler('精灵首发', '精灵切换-ID', '精灵切换-位置', '设置背包'),
};
