import { BaseView } from './baseView';
import {
    createRadioGroup,
    createTextInput,
    createInputRow,
    checkXmFile,
    insertText,
} from '../utils';
import { COMMANDS } from '../constants/commands';
import { XM_KEYWORDS } from '../constants/xmKeywords';

export class WildPokemonView extends BaseView {
    getContent(): string {
        const radioHtml = createRadioGroup(
            'wild-type',
            [
                { value: '对战', label: '对战', checked: true },
                { value: '捕捉', label: '捕捉' },
            ],
            true
        );

        const mapIdHtml = createTextInput({
            id: 'map-id-input',
            value: '0',
            type: 'number',
        });
        const pokemonInputHtml = createInputRow(
            [{ id: 'pokemon-id-input', type: 'number', value: '0' }],
            [{ id: 'add-btn', text: '添加' }]
        );

        return `
        <div class="container">
        ${radioHtml}
        <div class="input-group">
        <span class="label">地图 ID</span>
        ${mapIdHtml}
        </div>
        <div class="input-group">
        <span class="label">精灵 ID</span>
        ${pokemonInputHtml}
        </div>
        </div>
        <script>
        const vscode = acquireVsCodeApi();
        document.getElementById('add-btn').addEventListener('click', () => {
        const mapInput = document.getElementById('map-id-input');
        const pokemonInput = document.getElementById('pokemon-id-input');
        const radio = document.querySelector('input[name="wild-type"]:checked');
        vscode.postMessage({
        command: '${COMMANDS.WILD_POKEMON}',
        mapId: mapInput.value,
        pokemonId: pokemonInput.value,
        type: radio.value
        });
        });
        </script>`;
    }

    protected handleMessage(message: {
        command: string;
        mapId: string;
        pokemonId: string;
        type: string;
    }): void {
        if (!checkXmFile()) {
            return;
        }

        if (message.command === COMMANDS.WILD_POKEMON) {
            insertText(
                `${XM_KEYWORDS.WILD_POKEMON}-${message.type}=${message.mapId}|${message.pokemonId}`
            );
        }
    }
}
