<script setup lang="ts">
import { ref } from 'vue';
import { post, warn } from '../vscode-api';
import {
    CHANGE_LABELS,
    DEFAULT_STATE,
    RESIST_OPTIONS,
    RESIST_ROWS,
    TEAM_LABELS,
    buildTrainingContent,
    type PokemonTrainingState,
} from '../logic/pokemon-training';

const TABS = [
    { id: 'settings', label: '设置页' },
    { id: 'page1', label: '页1' },
    { id: 'page2', label: '页2' },
    { id: 'page3', label: '页3' },
];

const activeTab = ref('settings');
const catchtime = ref(DEFAULT_STATE.catchtime);
const result = ref(DEFAULT_STATE.result);
const change = ref([...DEFAULT_STATE.change]);
const force = ref([...DEFAULT_STATE.force]);
const level = ref(DEFAULT_STATE.level);
const skills = ref([...DEFAULT_STATE.skills]);
const efforts = ref([...DEFAULT_STATE.efforts]);
const talent = ref(DEFAULT_STATE.talent);
const character = ref(DEFAULT_STATE.character);
const emblems = ref([...DEFAULT_STATE.emblems]);
const emblemOpen = ref(DEFAULT_STATE.emblemOpen);
const resist = ref([...DEFAULT_STATE.resist]);
const hp = ref(DEFAULT_STATE.hp);
const team = ref([...DEFAULT_STATE.team]);

function add(): void {
    const state: PokemonTrainingState = {
        catchtime: catchtime.value,
        result: result.value,
        change: change.value,
        force: force.value,
        level: level.value,
        skills: skills.value,
        efforts: efforts.value,
        talent: talent.value,
        character: character.value,
        emblems: emblems.value,
        emblemOpen: emblemOpen.value,
        resist: resist.value,
        hp: hp.value,
        team: team.value,
    };

    const outcome = buildTrainingContent(state);
    if (!outcome.ok) {
        warn(outcome.message);
        return;
    }

    post({ command: '精灵培养', content: outcome.content });
}
</script>

<template>
    <div class="container">
        <div class="hint">精灵培养（需先将精灵放到背包）</div>

        <div class="pt-header">
            <div class="pt-header-fields">
                <div class="pt-field-row">
                    <span class="label">精灵catchtime:</span>
                    <input v-model="catchtime" type="text" />
                </div>
                <div class="pt-field-row">
                    <span class="label">结果赋值变量:</span>
                    <input v-model="result" type="text" />
                </div>
            </div>
            <button @click="add">添加</button>
        </div>

        <div class="pt-tabs">
            <button
                v-for="tab in TABS"
                :key="tab.id"
                class="pt-tab"
                :class="{ active: activeTab === tab.id }"
                @click="activeTab = tab.id"
            >
                {{ tab.label }}
            </button>
        </div>

        <div v-if="activeTab === 'settings'" class="pt-tab-panel active">
            <div class="input-group">
                <span class="label">是否更换：</span>
                <div class="checkbox-group pt-grid-3">
                    <label v-for="(label, index) in CHANGE_LABELS" :key="label" class="checkbox-label">
                        <input v-model="change[index]" type="checkbox" />
                        <span>{{ label }}</span>
                    </label>
                </div>
            </div>
            <div class="input-group">
                <span class="label">是否强制（无道具培养失败时，不勾选则跳过）：</span>
                <div class="checkbox-group pt-grid-3">
                    <label v-for="(label, index) in CHANGE_LABELS" :key="label" class="checkbox-label">
                        <input v-model="force[index]" type="checkbox" />
                        <span>{{ label }}</span>
                    </label>
                </div>
            </div>
            <div class="hint">
                精灵培养之前，需要先使用设置背包语句将要培养的精灵放到背包内，同时用一个整数型变量“背包精灵catchtime”获取该精灵的catchtime后填入该变量。“结果赋值变量”可以填入一个整数型变量用于存储返回的结果，培养成功为1，失败为0。勾选“是否更换”区域的选项后，会根据勾选的选项对该精灵进行培养。<br />
                因为一些培养需要消耗道具，没有道具培养会导致培养失败直接返回失败，这时候可以取消勾选“是否强制”区域的选项，当该项培养失败时会跳过这项培养，而不是直接返回失败。
            </div>
        </div>

        <div v-if="activeTab === 'page1'" class="pt-tab-panel active">
            <div class="input-group">
                <span class="label">等级（消耗累计经验升级/精灵还原药剂Ω重置）</span>
                <div class="radio-group pt-inline">
                    <label class="radio-label">
                        <input v-model="level" type="radio" value="100" />
                        <span>1v100</span>
                    </label>
                    <label class="radio-label">
                        <input v-model="level" type="radio" value="1" />
                        <span>1v1</span>
                    </label>
                </div>
            </div>
            <div class="input-group">
                <span class="label">技能</span>
                <div class="pt-grid">
                    <div v-for="(label, index) in ['技能1:', '技能2:', '技能3:', '技能4:']" :key="label" class="pt-cell">
                        <span class="label">{{ label }}</span>
                        <input v-model.number="skills[index]" type="number" />
                    </div>
                </div>
                <div class="hint">
                    若要更换技能，则技能1~3必须填入该精灵拥有技能组中的指定技能ID。技能4作为技能石/职位槽位，若在技能4填入技能石ID会消耗对应技能石进行更换，若在技能4填入该精灵技能组中的技能ID当然也会更换技能，若在技能4填入999999则不更换，同时若在更换前该精灵已有技能石技能，会移至该位置。
                </div>
            </div>
            <div class="input-group">
                <span class="label">学习力（消耗累计学习力）</span>
                <div class="pt-grid-3">
                    <div v-for="(label, index) in ['体力:', '攻击:', '防御:', '特攻:', '特防:', '速度:']" :key="label" class="pt-cell">
                        <span class="label">{{ label }}</span>
                        <input v-model.number="efforts[index]" type="number" />
                    </div>
                </div>
                <div class="hint">若当前精灵学习力不为0，且与设置项不符，则会使用全能学习力遗忘药剂Ω/精灵还原药剂Ω进行重置。</div>
            </div>
        </div>

        <div v-if="activeTab === 'page2'" class="pt-tab-panel active">
            <div class="input-group">
                <span class="label">天赋</span>
                <input v-model.number="talent" type="number" />
                <div class="hint">天赋范围0~31，大于等于就视为达标。消耗天赋改造药剂Ω和天赋提升药剂Ω。</div>
            </div>
            <div class="input-group">
                <span class="label">性格</span>
                <input v-model="character" type="text" />
                <div class="hint">
                    性格ID范围0~24，可以按优先级填入多个性格ID，ID之间用逗号隔开。比如填入“1,8”，1是固执，8是保守，精灵拥有其中之一时则视为真。若精灵不是这两个性格，则会消耗全能性格转化剂Ω将其变更成优先级最高的第一个性格。消耗全能性格转化剂Ω和性格重塑胶囊Ω。
                </div>
            </div>
            <div class="input-group">
                <span class="label">刻印</span>
                <div class="pt-grid">
                    <div v-for="(label, index) in ['刻印1:', '刻印2:', '刻印3:']" :key="label" class="pt-cell">
                        <span class="label">{{ label }}</span>
                        <input v-model.number="emblems[index]" type="number" />
                    </div>
                    <label class="checkbox-label pt-cell">
                        <input v-model="emblemOpen" type="checkbox" />
                        <span>刻印是否允许开孔</span>
                    </label>
                </div>
                <div class="hint">
                    刻印1~3分别填入刻印ID。注意：在没勾选“刻印是否允许开孔”的情况下，若刻印3不为0且该精灵未开启刻印3会返回失败（可以取消勾选以跳过此项）。若勾选“开孔”则会消耗水晶进行开孔然后再更换刻印3。
                </div>
            </div>
        </div>

        <div v-if="activeTab === 'page3'" class="pt-tab-panel active">
            <div class="input-group">
                <span class="label">抗性（消耗泰坦神石、护佑神石、红宝石）:</span>
                <div v-for="(row, rowIndex) in RESIST_ROWS" :key="row" class="pt-res-row">
                    <span class="pt-res-label">{{ row }}:</span>
                    <div class="pt-res-opts">
                        <label v-for="option in RESIST_OPTIONS" :key="option.value" class="radio-label">
                            <input v-model="resist[rowIndex]" type="radio" :value="option.value" />
                            <span>{{ option.label }}</span>
                        </label>
                    </div>
                </div>
            </div>
            <div class="input-group">
                <span class="label">体力上限</span>
                <input v-model.number="hp" type="number" />
                <div class="hint">体力上限范围0~20，大于等于就视为达标。消耗基础体力上限药剂、初级/中级/高级体力上限药剂Ω。</div>
            </div>
            <div class="input-group">
                <span class="label">战队加成</span>
                <div class="checkbox-group pt-grid-3">
                    <label v-for="(label, index) in TEAM_LABELS" :key="label" class="checkbox-label">
                        <input v-model="team[index]" type="checkbox" />
                        <span>{{ label }}</span>
                    </label>
                </div>
                <div class="hint">需要当前账号加入的战队已开启科技中心，勾选项会升满，消耗战队贡献值。</div>
            </div>
        </div>
    </div>
</template>
