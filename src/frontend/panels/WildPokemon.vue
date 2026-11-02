<script setup lang="ts">
import { ref } from 'vue';
import { post, usePersistedRefs, warn } from '../vscode-api';
import { TEXTS } from '../texts';
import FieldGroup from '../components/FieldGroup.vue';

const wildType = ref('对战');
const mapId = ref('');
const pokemonId = ref('');

usePersistedRefs({ wildType, mapId, pokemonId });

function add(): void {
    if (!mapId.value) {
        warn('地图ID不得为空！');
        return;
    }
    if (!pokemonId.value) {
        warn('精灵ID不得为空！');
        return;
    }
    post({ command: 'wild-pokemon', type: wildType.value, mapId: mapId.value, pokemonId: pokemonId.value });
}
</script>

<template>
    <div class="container">
        <FieldGroup label="操作类型">
            <div class="inline">
                <label class="choice"><input v-model="wildType" type="radio" value="对战" /><span>对战</span></label>
                <label class="choice"><input v-model="wildType" type="radio" value="捕捉" /><span>捕捉</span></label>
            </div>
        </FieldGroup>
        <FieldGroup label="地图ID">
            <input v-model="mapId" type="number" placeholder="请输入地图ID" />
        </FieldGroup>
        <FieldGroup label="精灵ID">
            <input v-model="pokemonId" type="number" placeholder="请输入精灵ID" />
        </FieldGroup>
        <button @click="add">添加</button>
        <FieldGroup label="说明">
            <div class="hint">{{ TEXTS.wildPokemon }}</div>
        </FieldGroup>
    </div>
</template>
