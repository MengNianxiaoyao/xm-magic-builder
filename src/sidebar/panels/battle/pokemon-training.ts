import type { PanelDescriptor } from '../../../shared/types';
import { keyValueHandler } from '../../../webview/actions';

const CHANGE_LABELS = ['等级', '技能', '学习力', '天赋', '性格', '刻印', '抗性', '体力上限', '战队加成'];

function renderCheckboxes(prefix: string, checked: boolean): string {
    return CHANGE_LABELS.map(
        (label, index) =>
            `<label class="checkbox-label">
                <input type="checkbox" id="${prefix}-${index + 1}" ${checked ? 'checked' : ''} />
                <span>${label}</span>
            </label>`
    ).join('');
}

export const pokemonTrainingPanel: PanelDescriptor = {
    id: 'xm-magic-builder.pokemon-training',
    title: '精灵培养',
    fields: [],
    actions: [],
    scripts: ['resources/js/common/xm-view.js', 'resources/js/panels/pokemon-training.js'],
    getHtml() {
        return `<div class="container">
            <div class="hint">精灵培养（需先将精灵放到背包）</div>
            <div class="pt-header">
                <div class="pt-header-fields">
                    <div class="pt-field-row">
                        <span class="label">精灵catchtime:</span>
                        <input type="text" id="pt-catchtime" value="[培养精灵]" />
                    </div>
                    <div class="pt-field-row">
                        <span class="label">结果赋值变量:</span>
                        <input type="text" id="pt-result" value="[i]" />
                    </div>
                </div>
                <button id="add-btn">添加</button>
            </div>

            <div class="pt-tabs">
                <button class="pt-tab active" data-tab="settings">设置页</button>
                <button class="pt-tab" data-tab="page1">页1</button>
                <button class="pt-tab" data-tab="page2">页2</button>
                <button class="pt-tab" data-tab="page3">页3</button>
            </div>

            <div class="pt-tab-panel active" id="pt-tab-settings">
                <div class="input-group">
                    <span class="label">是否更换：</span>
                    <div class="checkbox-group pt-grid-3">${renderCheckboxes('pt-change', false)}</div>
                </div>
                <div class="input-group">
                    <span class="label">是否强制（无道具培养失败时，不勾选则跳过）：</span>
                    <div class="checkbox-group pt-grid-3">${renderCheckboxes('pt-force', true)}</div>
                </div>
                <div class="hint">精灵培养之前，需要先使用设置背包语句将要培养的精灵放到背包内，同时用一个整数型变量“背包精灵catchtime”获取该精灵的catchtime后填入该变量。“结果赋值变量”可以填入一个整数型变量用于存储返回的结果，培养成功为1，失败为0。勾选“是否更换”区域的选项后，会根据勾选的选项对该精灵进行培养。<br />因为一些培养需要消耗道具，没有道具培养会导致培养失败直接返回失败，这时候可以取消勾选“是否强制”区域的选项，当该项培养失败时会跳过这项培养，而不是直接返回失败。</div>
            </div>

            <div class="pt-tab-panel" id="pt-tab-page1">
                <div class="input-group">
                    <span class="label">等级（消耗累计经验升级/精灵还原药剂Ω重置）</span>
                    <div class="radio-group pt-inline">
                        <label class="radio-label">
                            <input type="radio" name="pt-level" value="100" checked />
                            <span>Lv100</span>
                        </label>
                        <label class="radio-label">
                            <input type="radio" name="pt-level" value="1" />
                            <span>Lv1</span>
                        </label>
                    </div>
                </div>
                <div class="input-group">
                    <span class="label">技能</span>
                    <div class="pt-grid">
                        <div class="pt-cell">
                            <span class="label">技能1:</span>
                            <input type="number" id="pt-skill-1" value="0" />
                        </div>
                        <div class="pt-cell">
                            <span class="label">技能2:</span>
                            <input type="number" id="pt-skill-2" value="0" />
                        </div>
                        <div class="pt-cell">
                            <span class="label">技能3:</span>
                            <input type="number" id="pt-skill-3" value="0" />
                        </div>
                        <div class="pt-cell">
                            <span class="label">技能4:</span>
                            <input type="number" id="pt-skill-4" value="999999" />
                        </div>
                    </div>
                    <div class="hint">若要更换技能，则技能1~3必须填入该精灵拥有技能组中的指定技能ID。技能4作为技能石/职位槽位，若在技能4填入技能石ID会消耗对应技能石进行更换，若在技能4填入该精灵技能组中的技能ID当然也会更换技能，若在技能4填入999999则不更换，同时若在更换前该精灵已有技能石技能，会移至该位置。</div>
                </div>
                <div class="input-group">
                    <span class="label">学习力（消耗累计学习力）</span>
                    <div class="pt-grid-3">
                        <div class="pt-cell">
                            <span class="label">体力:</span>
                            <input type="number" id="pt-effort-1" value="0" />
                        </div>
                        <div class="pt-cell">
                            <span class="label">攻击:</span>
                            <input type="number" id="pt-effort-2" value="0" />
                        </div>
                        <div class="pt-cell">
                            <span class="label">防御:</span>
                            <input type="number" id="pt-effort-3" value="0" />
                        </div>
                        <div class="pt-cell">
                            <span class="label">特攻:</span>
                            <input type="number" id="pt-effort-4" value="0" />
                        </div>
                        <div class="pt-cell">
                            <span class="label">特防:</span>
                            <input type="number" id="pt-effort-5" value="0" />
                        </div>
                        <div class="pt-cell">
                            <span class="label">速度:</span>
                            <input type="number" id="pt-effort-6" value="0" />
                        </div>
                    </div>
                    <div class="hint">若当前精灵学习力不为0，且与设置项不符，则会使用全能学习力遗忘药剂Ω/精灵还原药剂Ω进行重置。</div>
                </div>
            </div>

            <div class="pt-tab-panel" id="pt-tab-page2">
                <div class="input-group">
                    <span class="label">天赋</span>
                    <input type="number" id="pt-talent" value="0" />
                    <div class="hint">天赋范围0~31，大于等于就视为达标。消耗天赋改造药剂Ω和天赋提升药剂Ω。</div>
                </div>
                <div class="input-group">
                    <span class="label">性格</span>
                    <input type="text" id="pt-character" />
                    <div class="hint">性格ID范围0~24，可以按优先级填入多个性格ID，ID之间用逗号隔开。比如填入“1,8”，1是固执，8是保守，精灵拥有其中之一时则视为真。若精灵不是这两个性格，则会消耗全能性格转化剂Ω将其变更成优先级最高的第一个性格。消耗全能性格转化剂Ω和性格重塑胶囊Ω。</div>
                </div>
                <div class="input-group">
                    <span class="label">刻印</span>
                    <div class="pt-grid">
                        <div class="pt-cell">
                            <span class="label">刻印1:</span>
                            <input type="number" id="pt-emblem-1" value="0" />
                        </div>
                        <div class="pt-cell">
                            <span class="label">刻印2:</span>
                            <input type="number" id="pt-emblem-2" value="0" />
                        </div>
                        <div class="pt-cell">
                            <span class="label">刻印3:</span>
                            <input type="number" id="pt-emblem-3" value="0" />
                        </div>
                        <label class="checkbox-label pt-cell">
                            <input type="checkbox" id="pt-emblem-open" />
                            <span>允许开孔</span>
                        </label>
                    </div>
                    <div class="hint">刻印1~3分别填入刻印ID。注意：在没勾选“允许开孔”的情况下，若刻印3不为0且该精灵未开启刻印3会返回失败（可以取消勾选以跳过此项）。若勾选“开孔”则会消耗水晶进行开孔然后再更换刻印3。</div>
                </div>
            </div>

            <div class="pt-tab-panel" id="pt-tab-page3">
                <div class="input-group">
                    <span class="label">抗性（消耗泰坦神石、护佑神石、红宝石）:</span>
                    <div class="pt-res-row">
                        <span class="pt-res-label">致命伤害:</span>
                        <div class="pt-res-opts">
                            <label class="radio-label"><input type="radio" name="pt-res-1" value="0" checked /><span>0不处理</span></label>
                            <label class="radio-label"><input type="radio" name="pt-res-1" value="5" /><span>5%</span></label>
                            <label class="radio-label"><input type="radio" name="pt-res-1" value="35" /><span>35%</span></label>
                        </div>
                    </div>
                    <div class="pt-res-row">
                        <span class="pt-res-label">固定伤害:</span>
                        <div class="pt-res-opts">
                            <label class="radio-label"><input type="radio" name="pt-res-2" value="0" checked /><span>0不处理</span></label>
                            <label class="radio-label"><input type="radio" name="pt-res-2" value="5" /><span>5%</span></label>
                            <label class="radio-label"><input type="radio" name="pt-res-2" value="35" /><span>35%</span></label>
                        </div>
                    </div>
                    <div class="pt-res-row">
                        <span class="pt-res-label">百分比伤害:</span>
                        <div class="pt-res-opts">
                            <label class="radio-label"><input type="radio" name="pt-res-3" value="0" checked /><span>0不处理</span></label>
                            <label class="radio-label"><input type="radio" name="pt-res-3" value="5" /><span>5%</span></label>
                            <label class="radio-label"><input type="radio" name="pt-res-3" value="35" /><span>35%</span></label>
                        </div>
                    </div>
                </div>
                <div class="input-group">
                    <span class="label">体力上限</span>
                    <input type="number" id="pt-hp" value="0" />
                    <div class="hint">体力上限范围0~20，大于等于就视为达标。消耗基础体力上限药剂、初级/中级/高级体力上限药剂Ω。</div>
                </div>
                <div class="input-group">
                    <span class="label">战队加成</span>
                    <div class="checkbox-group pt-grid-3">
                        <label class="checkbox-label"><input type="checkbox" id="pt-team-1" /><span>体力</span></label>
                        <label class="checkbox-label"><input type="checkbox" id="pt-team-2" /><span>攻击</span></label>
                        <label class="checkbox-label"><input type="checkbox" id="pt-team-3" /><span>防御</span></label>
                        <label class="checkbox-label"><input type="checkbox" id="pt-team-4" /><span>特攻</span></label>
                        <label class="checkbox-label"><input type="checkbox" id="pt-team-5" /><span>特防</span></label>
                        <label class="checkbox-label"><input type="checkbox" id="pt-team-6" /><span>速度</span></label>
                    </div>
                    <div class="hint">需要当前账号加入的战队已开启科技中心，勾选项会升满，消耗战队贡献值。</div>
                </div>
            </div>
        </div>`;
    },
    handleMessage: keyValueHandler('精灵培养'),
};
