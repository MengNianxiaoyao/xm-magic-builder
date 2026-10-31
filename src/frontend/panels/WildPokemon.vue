<script setup lang="ts">
import { ref } from 'vue';
import { post } from '../vscode-api';
import FieldGroup from '../components/FieldGroup.vue';

const wildType = ref('对战');
const mapId = ref('0');
const pokemonId = ref('0');
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
            <input v-model="mapId" type="number" />
        </FieldGroup>
        <FieldGroup label="精灵ID">
            <input v-model="pokemonId" type="number" />
        </FieldGroup>
        <button @click="post({ command: 'wild-pokemon', type: wildType, mapId, pokemonId })">添加</button>
    </div>
</template>
