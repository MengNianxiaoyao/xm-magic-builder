<script setup lang="ts">
import { ref } from 'vue';
import { post, usePersistedRefs } from '../vscode-api';
import FieldGroup from '../components/FieldGroup.vue';

const op = ref('takeover');
const battleId = ref('');
const skillId = ref('');
const itemId = ref('');
const fire = ref('绿火');

usePersistedRefs({ op, battleId, skillId, itemId, fire });

const battleItems = [
    { name: '初级体力药剂', id: '300011' },
    { name: '中级体力药剂', id: '300012' },
    { name: '高级体力药剂', id: '300013' },
    { name: '超级体力药剂', id: '300014' },
    { name: '永寒体力药剂', id: '300079' },
    { name: '上等体力药剂', id: '300157' },
    { name: '初级活力药剂', id: '300016' },
    { name: '中级活力药剂', id: '300017' },
    { name: '高级活力药剂', id: '300018' },
    { name: '超级活力药剂', id: '300019' },
    { name: '全能恢复药剂', id: '300701' },
];

function add(): void {
    if (op.value === 'takeover') {
        post({ command: '接管对战', content: battleId.value });
    } else if (op.value === 'skill') {
        post({ command: '使用技能', content: skillId.value });
    } else if (op.value === 'item') {
        post({ command: '使用道具', content: itemId.value });
    } else {
        post({ command: '战前准备', content: `领取${fire.value}` });
    }
}
</script>

<template>
    <div class="container">
        <FieldGroup label="操作类型">
            <div class="inline">
                <label class="choice"><input v-model="op" type="radio" value="takeover" /><span>接管对战</span></label>
                <label class="choice"><input v-model="op" type="radio" value="skill" /><span>使用技能</span></label>
                <label class="choice"><input v-model="op" type="radio" value="item" /><span>使用道具</span></label>
                <label class="choice"><input v-model="op" type="radio" value="pre-battle" /><span>战前准备</span></label>
            </div>
        </FieldGroup>

        <FieldGroup v-if="op === 'takeover'" label="对战包">
            <input v-model="battleId" type="text" />
        </FieldGroup>
        <FieldGroup v-if="op === 'skill'" label="技能ID">
            <input v-model="skillId" type="text" />
        </FieldGroup>
        <FieldGroup v-if="op === 'item'" label="道具ID">
            <input v-model="itemId" type="text" />
        </FieldGroup>
        <FieldGroup v-if="op === 'pre-battle'" label="借火类型">
            <select v-model="fire">
                <option value="绿火">绿火</option>
                <option value="金火">金火</option>
                <option value="紫火">紫火</option>
                <option value="蓝火">蓝火</option>
            </select>
        </FieldGroup>

        <div class="btn-row">
            <button @click="add">添加</button>
            <button @click="post({ command: '使用技能', content: '撤退' })">对战撤退</button>
            <button @click="post({ command: '战前准备', content: '压血' })">压血</button>
            <button @click="post({ command: '战前准备', content: '全精灵恢复' })">全精灵恢复</button>
        </div>

        <FieldGroup v-if="op === 'item'" label="常用对战道具ID">
            <div class="hint">点击道具可直接填入上方道具ID。</div>
            <div class="item-list">
                <button
                    v-for="item in battleItems"
                    :key="item.id"
                    class="item-row"
                    :class="{ active: itemId === item.id }"
                    @click="itemId = item.id"
                >
                    <span class="item-name">{{ item.name }}</span>
                    <span class="item-id">{{ item.id }}</span>
                </button>
            </div>
        </FieldGroup>
    </div>
</template>
