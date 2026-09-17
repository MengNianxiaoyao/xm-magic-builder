import type { PanelDescriptor } from '../../../shared/types';
import { keyValueHandler } from '../../../webview/actions';

export const pokemonOperationPanel: PanelDescriptor = {
    id: 'xm-magic-builder.pokemon-operation',
    title: '精灵操作',
    fields: [],
    actions: [],
    scripts: ['resources/js/common/xm-view.js', 'resources/js/panels/pokemon-operation.js'],
    getHtml() {
        return `<div class="container">
            <div class="radio-group" style="display: flex; flex-wrap: wrap; gap: 8px 16px;">
                <label class="radio-label">
                    <input type="radio" name="pokemon-op" value="first" checked />
                    <span>精灵首发</span>
                </label>
                <label class="radio-label">
                    <input type="radio" name="pokemon-op" value="set-bag" />
                    <span>设置背包</span>
                </label>
                <label class="radio-label">
                    <input type="radio" name="pokemon-op" value="switch-id" />
                    <span>精灵切换-ID</span>
                </label>
                <label class="radio-label">
                    <input type="radio" name="pokemon-op" value="switch-pos" />
                    <span>精灵切换-位置</span>
                </label>
            </div>
            <div id="id-input-group" class="input-group">
                <span class="label">精灵ID</span>
                <input type="number" id="pokemon-id" value="5000" />
            </div>
            <div id="pos-input-group" class="input-group" style="display: none;">
                <span class="label">精灵位置</span>
                <input type="number" id="pokemon-pos" value="1" />
            </div>
            <div id="bag-input-group" class="input-group" style="display: none;">
                <span class="label">精灵ID(用 | 分隔)</span>
                <input type="text" id="bag-ids" value="3022|3437|3460" />
            </div>
            <div class="btn-row" style="display: flex; flex-wrap: wrap; gap: 8px 16px;">
                <button id="add-btn">添加</button>
                <button id="restore-btn">还原背包</button>
            </div>
        </div>`;
    },
    handleMessage: keyValueHandler('精灵首发', '精灵切换-ID', '精灵切换-位置', '设置背包'),
};
