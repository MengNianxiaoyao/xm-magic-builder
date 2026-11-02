<script setup lang="ts">
import { ref } from 'vue';
import { post, usePersistedRefs } from '../vscode-api';
import { TEXTS } from '../texts';
import FieldGroup from '../components/FieldGroup.vue';

const loopId = ref('标识1');
const value = ref('[j]');
const init = ref('[i]');

usePersistedRefs({ loopId, value, init });
</script>

<template>
    <div class="container">
        <FieldGroup label="循环标识">
            <input v-model="loopId" type="text" />
        </FieldGroup>
        <FieldGroup label="指定值">
            <input v-model="value" type="text" />
        </FieldGroup>
        <FieldGroup label="初始值赋值变量">
            <input v-model="init" type="text" />
        </FieldGroup>
        <div class="btn-row">
            <button @click="post({ command: 'count-loop-head', loopId, value, init })">计次循环体头</button>
            <button @click="post({ command: 'count-loop-tail', loopId })">计次循环体尾</button>
        </div>
        <FieldGroup label="说明">
            <div class="hint">{{ TEXTS.countLoop.description }}</div>
            <pre class="code-block">{{ TEXTS.countLoop.example }}</pre>
            <div class="hint">{{ TEXTS.countLoop.result }}</div>
        </FieldGroup>
    </div>
</template>
