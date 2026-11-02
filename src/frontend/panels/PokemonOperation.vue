<script setup lang="ts">
import { ref } from 'vue';
import { post, warn } from '../vscode-api';
import { TEXTS } from '../texts';
import FieldGroup from '../components/FieldGroup.vue';

const op = ref('first');
const pokemonId = ref('');
const pokemonPos = ref('1');
const bagIds = ref('');

function add(): void {
    if (op.value === 'set-bag') {
        if (!bagIds.value) {
            warn('设置背包不得为空！');
            return;
        }
        post({ command: '设置背包', content: bagIds.value });
        return;
    }
    if (op.value === 'first') {
        if (!pokemonId.value) {
            warn('精灵ID不得为空！');
            return;
        }
        post({ command: '精灵首发', content: pokemonId.value });
    } else if (op.value === 'switch-id') {
        if (!pokemonId.value) {
            warn('精灵ID不得为空！');
            return;
        }
        post({ command: '精灵切换-ID', content: pokemonId.value });
    } else {
        post({ command: '精灵切换-位置', content: pokemonPos.value });
    }
}
</script>

<template>
    <div class="container">
        <FieldGroup label="操作类型">
            <div class="inline">
                <label class="choice"><input v-model="op" type="radio" value="first" /><span>精灵首发</span></label>
                <label class="choice"><input v-model="op" type="radio" value="set-bag" /><span>设置背包</span></label>
                <label class="choice"><input v-model="op" type="radio" value="switch-id" /><span>精灵切换-ID</span></label>
                <label class="choice"><input v-model="op" type="radio" value="switch-pos" /><span>精灵切换-位置</span></label>
            </div>
        </FieldGroup>

        <FieldGroup v-if="op === 'first' || op === 'switch-id'" label="精灵ID">
            <input v-model="pokemonId" type="number" placeholder="请输入精灵ID" />
        </FieldGroup>
        <FieldGroup v-if="op === 'switch-pos'" label="精灵位置">
            <input v-model="pokemonPos" type="number" />
        </FieldGroup>
        <FieldGroup v-if="op === 'set-bag'" label="精灵ID">
            <input v-model="bagIds" type="text" placeholder="请输入精灵ID" />
        </FieldGroup>

        <div class="btn-row">
            <button @click="add">添加</button>
            <button @click="post({ command: '设置背包', content: '还原背包' })">还原背包</button>
        </div>

        <FieldGroup v-if="op === 'set-bag'" label="说明">
            <div class="hint">{{ TEXTS.pokemonOperation.setBag }}</div>
        </FieldGroup>
    </div>
</template>
