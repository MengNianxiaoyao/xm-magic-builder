import { BaseView } from './baseView';
import {
    createTextInput,
    createButtonRow,
    createRadioGroup,
    checkXmFile,
    insertText,
} from '../utils';
import { XM_KEYWORDS } from '../constants/xmKeywords';

export class PokemonOperationView extends BaseView {
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
                {
                    value: 'first',
                    label: XM_KEYWORDS.POKEMON_FIRST,
                    checked: true,
                },
                { value: 'switch-id', label: XM_KEYWORDS.POKEMON_SWITCH_ID },
                { value: 'set-bag', label: XM_KEYWORDS.SET_BAG },
                { value: 'switch-pos', label: XM_KEYWORDS.POKEMON_SWITCH_POS },
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
      <span class="label">精灵 ID</span>
      ${idInputHtml}
      </div>
      <div id="pos-input-group" class="input-group" style="display: none;">
      <span class="label">精灵位置</span>
      ${posInputHtml}
      </div>
      <div id="bag-input-group" class="input-group" style="display: none;">
      <span class="label">精灵 ID(用 | 分隔)</span>
      ${bagInputHtml}
      </div>
      ${buttonsHtml}
      </div>
      <script>
      const vscode = acquireVsCodeApi();

      function toggleInput() {
      const op = document.querySelector('input[name="pokemon-op"]:checked').value;
      const idGroup = document.getElementById('id-input-group');
      const posGroup = document.getElementById('pos-input-group');
      const bagGroup = document.getElementById('bag-input-group');

      idGroup.style.display = 'none';
      posGroup.style.display = 'none';
      bagGroup.style.display = 'none';

      if (op === 'first' || op === 'switch-id') {
      idGroup.style.display = 'flex';
      } else if (op === 'switch-pos') {
      posGroup.style.display = 'flex';
      } else if (op === 'set-bag') {
      bagGroup.style.display = 'flex';
      }
      }

      document.querySelectorAll('input[name="pokemon-op"]').forEach(radio => {
      radio.addEventListener('change', toggleInput);
      });

      document.getElementById('add-btn').addEventListener('click', () => {
      const op = document.querySelector('input[name="pokemon-op"]:checked').value;
      const idValue = document.getElementById('pokemon-id').value;
      const posValue = document.getElementById('pokemon-pos').value;
      const bagValue = document.getElementById('bag-ids').value;

      let command = '';
      let content = '';

      switch (op) {
      case 'first':
      command = XM_KEYWORDS.POKEMON_FIRST;
      content = idValue;
      break;
      case 'switch-id':
      command = XM_KEYWORDS.POKEMON_SWITCH_ID;
      content = idValue;
      break;
      case 'switch-pos':
      command = XM_KEYWORDS.POKEMON_SWITCH_POS;
      content = posValue;
      break;
      case 'set-bag':
      command = XM_KEYWORDS.SET_BAG;
      content = bagValue;
      break;
      }

      vscode.postMessage({ command, content });
      });

      document.getElementById('restore-btn').addEventListener('click', () => {
      vscode.postMessage({ command: XM_KEYWORDS.SET_BAG, content: XM_KEYWORDS.RESTORE_BAG });
      });
      </script>`;
    }

    protected handleMessage(message: {
        command: string;
        content: string;
    }): void {
        if (!checkXmFile()) {
            return;
        }

        if (message.command === XM_KEYWORDS.POKEMON_FIRST) {
            insertText(`${XM_KEYWORDS.POKEMON_FIRST}=${message.content}`);
        } else if (message.command === XM_KEYWORDS.POKEMON_SWITCH_ID) {
            insertText(`${XM_KEYWORDS.POKEMON_SWITCH_ID}=${message.content}`);
        } else if (message.command === XM_KEYWORDS.POKEMON_SWITCH_POS) {
            insertText(`${XM_KEYWORDS.POKEMON_SWITCH_POS}=${message.content}`);
        } else if (message.command === XM_KEYWORDS.SET_BAG) {
            insertText(`${XM_KEYWORDS.SET_BAG}=${message.content}`);
        }
    }
}
