import { SimpleActionView, ActionItem, renderActionButton } from './actions';
import { createRadioGroup, createTextInput } from '../utils';

export class WildPokemonView extends SimpleActionView {
    protected getActions(): ActionItem[] {
        return [
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
        ];
    }

    getContent(): string {
        const radioHtml = createRadioGroup(
            'wild-type',
            [
                { value: '对战', label: '对战', checked: true },
                { value: '捕捉', label: '捕捉' },
            ],
            true
        );

        return `
        <div class="container">
            ${radioHtml}
            <div class="input-group">
                <span class="label">地图ID</span>
                ${createTextInput({ id: 'map-id-input', value: '0', type: 'number' })}
            </div>
            <div class="input-group">
                <span class="label">精灵ID</span>
                ${createTextInput({ id: 'pokemon-id-input', value: '0', type: 'number' })}
            </div>
            ${renderActionButton(this.getActions()[0])}
        </div>`;
    }
}
