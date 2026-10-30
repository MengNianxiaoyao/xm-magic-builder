<script setup lang="ts">
import { ref } from 'vue';
import { post } from '../vscode-api';
import FieldGroup from '../components/FieldGroup.vue';

const op = ref('takeover');
const battleId = ref('');
const skillId = ref('');
const itemId = ref('');
const fire = ref('绿火');

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
            <div class="radio-group pt-inline">
                <label class="radio-label"><input v-model="op" type="radio" value="takeover" /><span>接管对战</span></label>
                <label class="radio-label"><input v-model="op" type="radio" value="skill" /><span>使用技能</span></label>
                <label class="radio-label"><input v-model="op" type="radio" value="item" /><span>使用道具</span></label>
                <label class="radio-label"><input v-model="op" type="radio" value="pre-battle" /><span>战前准备</span></label>
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
    </div>
</template>
