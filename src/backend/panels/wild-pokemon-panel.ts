import type { PanelDescriptor } from '../panel-types';

export const wildPokemonPanel: PanelDescriptor = {
    id: 'xm-magic-builder.wild-pokemon',
    title: '野怪操作',
    actions: [{ command: 'wild-pokemon', template: '野怪操作-${type}=${mapId}|${pokemonId}' }],
    vue: { component: 'wild-pokemon' },
};
