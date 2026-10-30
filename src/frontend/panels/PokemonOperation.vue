<script setup lang="ts">
import { ref } from 'vue';
import { post } from '../vscode-api';
import FieldGroup from '../components/FieldGroup.vue';

const op = ref('first');
const pokemonId = ref('5000');
const pokemonPos = ref('1');
const bagIds = ref('3022|3437|3460');

function add(): void {
    if (op.value === 'set-bag') {
        post({ command: '设置背包', content: bagIds.value });
        return;
    }
    if (op.value === 'first') {
        post({ command: '精灵首发', content: pokemonId.value });
    } else if (op.value === 'switch-id') {
        post({ command: '精灵切换-ID', content: pokemonId.value });
    } else {
        post({ command: '精灵切换-位置', content: pokemonPos.value });
    }
}
</script>

<template>
    <div class="container">
        <FieldGroup label="操作类型">
            <div class="radio-group pt-inline">
                <label class="radio-label"><input v-model="op" type="radio" value="first" /><span>精灵首发</span></label>
                <label class="radio-label"><input v-model="op" type="radio" value="set-bag" /><span>设置背包</span></label>
                <label class="radio-label"><input v-model="op" type="radio" value="switch-id" /><span>精灵切换-ID</span></label>
                <label class="radio-label"><input v-model="op" type="radio" value="switch-pos" /><span>精灵切换-位置</span></label>
            </div>
        </FieldGroup>

        <FieldGroup v-if="op === 'first' || op === 'switch-id'" label="精灵ID">
            <input v-model="pokemonId" type="number" />
        </FieldGroup>
        <FieldGroup v-if="op === 'switch-pos'" label="精灵位置">
            <input v-model="pokemonPos" type="number" />
        </FieldGroup>
        <FieldGroup v-if="op === 'set-bag'" label="精灵ID(用 | 分隔)">
            <input v-model="bagIds" type="text" />
        </FieldGroup>

        <div class="btn-row">
            <button @click="add">添加</button>
            <button @click="post({ command: '设置背包', content: '还原背包' })">还原背包</button>
        </div>
    </div>
</template>
