import { BaseView } from './baseView';
import { ViewMessage } from '../types/messages';
import {
    createTextInput,
    createButtonRow,
    createRadioGroup,
    checkXmFile,
    insertText,
} from '../utils';

export class PokemonOperationView extends BaseView {
    protected getScriptPaths(): string[] {
        return ['resources/js/pokemonOperation.js'];
    }

    getContent(): string {
        const idInputHtml = createTextInput({
            id: 'pokemon-id',
            type: 'number',
            value: '5000',
        });
        const posInputHtml = createTextInput({
            id: 'pokemon-pos',
            type: 'number',
            value: '1',
        });
        const bagInputHtml = createTextInput({
            id: 'bag-ids',
            value: '3022|3437|3460',
        });
        const radioHtml = createRadioGroup(
            'pokemon-op',
            [
                { value: 'first', label: '精灵首发', checked: true },
                { value: 'switch-id', label: '精灵切换-ID' },
                { value: 'set-bag', label: '设置背包' },
                { value: 'switch-pos', label: '精灵切换-位置' },
            ],
            true,
            2
        );
        const buttonsHtml = createButtonRow(
            [
                { id: 'add-btn', text: '添加' },
                { id: 'restore-btn', text: '还原背包' },
            ],
            2
        );

        return `
        <div class="container">
            ${radioHtml}
            <div id="id-input-group" class="input-group">
                <span class="label">精灵ID</span>
                ${idInputHtml}
            </div>
            <div id="pos-input-group" class="input-group" style="display: none;">
                <span class="label">精灵位置</span>
                ${posInputHtml}
            </div>
            <div id="bag-input-group" class="input-group" style="display: none;">
                <span class="label">精灵ID(用 | 分隔)</span>
                ${bagInputHtml}
            </div>
            ${buttonsHtml}
        </div>`;
    }

    protected handleMessage(message: ViewMessage): void {
        if (!checkXmFile()) {
            return;
        }

        if (message.command === '精灵首发') {
            void insertText(`精灵首发=${message.content}`);
        } else if (message.command === '精灵切换-ID') {
            void insertText(`精灵切换-ID=${message.content}`);
        } else if (message.command === '精灵切换-位置') {
            void insertText(`精灵切换-位置=${message.content}`);
        } else if (message.command === '设置背包') {
            void insertText(`设置背包=${message.content}`);
        }
    }
}
