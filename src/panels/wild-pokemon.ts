import type { PanelDescriptor } from '../shared/types';
import { renderActionButton } from '../core/renderer';

export const wildPokemonPanel: PanelDescriptor = {
    id: 'xm-magic-builder.wild-pokemon',
    title: '野怪操作',
    fields: [],
    actions: [
        {
            id: 'add-btn',
            text: '添加',
            command: 'wild-pokemon',
            inputs: {
                'map-id-input': 'mapId',
                'pokemon-id-input': 'pokemonId',
            },
            radio: 'wild-type:type',
            template: '野怪操作-${type}=${mapId}|${pokemonId}',
        },
    ],
    scripts: ['resources/js/simpleAction.js'],
    getHtml() {
        const [add] = this.actions;
        return `<div class="container">
            <div class="radio-group" style="display: flex; flex-wrap: wrap; gap: 8px 16px;">
                <label class="radio-label">
                    <input type="radio" name="wild-type" value="对战" checked />
                    <span>对战</span>
                </label>
                <label class="radio-label">
                    <input type="radio" name="wild-type" value="捕捉" />
                    <span>捕捉</span>
                </label>
            </div>
            <div class="input-group">
                <span class="label">地图ID</span>
                <input type="number" id="map-id-input" value="0" />
            </div>
            <div class="input-group">
                <span class="label">精灵ID</span>
                <input type="number" id="pokemon-id-input" value="0" />
            </div>
            ${renderActionButton(add)}
        </div>`;
    },
};
