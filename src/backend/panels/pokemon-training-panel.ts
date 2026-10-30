import type { PanelDescriptor } from '../panel-types';
import { keyValueHandler } from '../command-template';

export const pokemonTrainingPanel: PanelDescriptor = {
    id: 'xm-magic-builder.pokemon-training',
    title: '精灵培养',
    actions: [],
    vue: { component: 'pokemon-training' },
    handleMessage: keyValueHandler('精灵培养'),
};
