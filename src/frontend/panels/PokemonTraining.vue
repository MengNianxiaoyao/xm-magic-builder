<script setup lang="ts">
import { ref } from 'vue';
import { post, warn } from '../vscode-api';
import { TEXTS } from '../texts';
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
        <div class="hint">{{ TEXTS.pokemonTraining.intro }}</div>

        <div class="header">
            <div class="stack">
                <div class="cell">
                    <span class="label">精灵catchtime:</span>
                    <input v-model="catchtime" type="text" />
                </div>
                <div class="cell">
                    <span class="label">结果赋值变量:</span>
                    <input v-model="result" type="text" />
                </div>
            </div>
            <button @click="add">添加</button>
        </div>

        <div class="tabs">
            <button
                v-for="tab in TABS"
                :key="tab.id"
                class="tab"
                :class="{ active: activeTab === tab.id }"
                @click="activeTab = tab.id"
            >
                {{ tab.label }}
            </button>
        </div>

        <div v-if="activeTab === 'settings'" class="tab-panel active">
            <div class="input-group">
                <span class="label">是否更换</span>
                <div class="grid-3">
                    <label v-for="(label, index) in CHANGE_LABELS" :key="label" class="choice">
                        <input v-model="change[index]" type="checkbox" />
                        <span>{{ label }}</span>
                    </label>
                </div>
            </div>
            <div class="input-group">
                <span class="label">是否强制(无道具培养失败时，不勾选则跳过)</span>
                <div class="grid-3">
                    <label v-for="(label, index) in CHANGE_LABELS" :key="label" class="choice">
                        <input v-model="force[index]" type="checkbox" />
                        <span>{{ label }}</span>
                    </label>
                </div>
            </div>
            <div class="hint">{{ TEXTS.pokemonTraining.settings }}</div>
        </div>

        <div v-if="activeTab === 'page1'" class="tab-panel active">
            <div class="input-group">
                <span class="label">等级(消耗累计经验升级/精灵还原药剂Ω重置)</span>
                <div class="inline">
                    <label class="choice">
                        <input v-model="level" type="radio" value="100" />
                        <span>Lv100</span>
                    </label>
                    <label class="choice">
                        <input v-model="level" type="radio" value="1" />
                        <span>Lv1</span>
                    </label>
                </div>
            </div>
            <div class="input-group">
                <span class="label">技能</span>
                <div class="grid-2">
                    <div v-for="(label, index) in ['技能1:', '技能2:', '技能3:', '技能4:']" :key="label" class="cell">
                        <span class="label">{{ label }}</span>
                        <input v-model.number="skills[index]" type="number" />
                    </div>
                </div>
                <div class="hint">{{ TEXTS.pokemonTraining.skills }}</div>
            </div>
            <div class="input-group">
                <span class="label">学习力(消耗累计学习力)</span>
                <div class="grid-3">
                    <div v-for="(label, index) in ['体力:', '攻击:', '防御:', '特攻:', '特防:', '速度:']" :key="label" class="cell">
                        <span class="label">{{ label }}</span>
                        <input v-model.number="efforts[index]" type="number" />
                    </div>
                </div>
                <div class="hint">{{ TEXTS.pokemonTraining.efforts }}</div>
            </div>
        </div>

        <div v-if="activeTab === 'page2'" class="tab-panel active">
            <div class="input-group">
                <span class="label">天赋</span>
                <input v-model.number="talent" type="number" />
                <div class="hint">{{ TEXTS.pokemonTraining.talent }}</div>
            </div>
            <div class="input-group">
                <span class="label">性格</span>
                <input v-model="character" type="text" />
                <div class="hint">{{ TEXTS.pokemonTraining.character }}</div>
            </div>
            <div class="input-group">
                <span class="label">刻印</span>
                <div class="grid-2">
                    <div v-for="(label, index) in ['刻印1:', '刻印2:', '刻印3:']" :key="label" class="cell">
                        <span class="label">{{ label }}</span>
                        <input v-model.number="emblems[index]" type="number" />
                    </div>
                    <label class="choice">
                        <input v-model="emblemOpen" type="checkbox" />
                        <span>刻印是否允许开孔</span>
                    </label>
                </div>
                <div class="hint">{{ TEXTS.pokemonTraining.emblems }}</div>
            </div>
        </div>

        <div v-if="activeTab === 'page3'" class="tab-panel active">
            <div class="input-group">
                <span class="label">抗性(消耗泰坦神石、护佑神石、红宝石)</span>
                <div v-for="(row, rowIndex) in RESIST_ROWS" :key="row" class="cell">
                    <span class="label res-label">{{ row }}:</span>
                    <div class="inline">
                        <label v-for="option in RESIST_OPTIONS" :key="option.value" class="choice">
                            <input v-model="resist[rowIndex]" type="radio" :value="option.value" />
                            <span>{{ option.label }}</span>
                        </label>
                    </div>
                </div>
            </div>
            <div class="input-group">
                <span class="label">体力上限</span>
                <input v-model.number="hp" type="number" />
                <div class="hint">{{ TEXTS.pokemonTraining.hp }}</div>
            </div>
            <div class="input-group">
                <span class="label">战队加成</span>
                <div class="grid-3">
                    <label v-for="(label, index) in TEAM_LABELS" :key="label" class="choice">
                        <input v-model="team[index]" type="checkbox" />
                        <span>{{ label }}</span>
                    </label>
                </div>
                <div class="hint">{{ TEXTS.pokemonTraining.team }}</div>
            </div>
        </div>
    </div>
</template>
