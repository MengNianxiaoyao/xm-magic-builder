<script setup lang="ts">
import { ref } from 'vue';
import { post } from '../vscode-api';
import FieldGroup from '../components/FieldGroup.vue';

const packet = ref('');
const delay = ref(1000);
const battleDelay = ref(1000);
</script>

<template>
    <div class="container">
        <FieldGroup label="发包文本">
            <div class="input-row">
                <input v-model="packet" type="text" />
                <button @click="post({ command: 'add-packet', content: packet })">添加</button>
            </div>
        </FieldGroup>
        <FieldGroup label="延时(毫秒)">
            <div class="input-row">
                <input v-model.number="delay" type="number" />
                <button @click="post({ command: 'add-delay', content: String(delay) })">添加</button>
            </div>
        </FieldGroup>
        <FieldGroup label="对战延时(毫秒)">
            <div class="input-row">
                <input v-model.number="battleDelay" type="number" />
                <button @click="post({ command: 'add-battle-delay', content: String(battleDelay) })">添加</button>
            </div>
        </FieldGroup>
    </div>
</template>
