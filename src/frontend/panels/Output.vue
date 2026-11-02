<script setup lang="ts">
import { ref } from 'vue';
import { post, usePersistedRefs } from '../vscode-api';
import { TEXTS } from '../texts';
import FieldGroup from '../components/FieldGroup.vue';

const content = ref('');

usePersistedRefs({ content });
</script>

<template>
    <div class="container">
        <FieldGroup label="输出内容(换行用\r\n代替)">
            <textarea v-model="content" rows="3" :placeholder="TEXTS.output.example"></textarea>
        </FieldGroup>
        <button class="btn-block" @click="post({ command: 'output', content })">信息输出</button>
        <FieldGroup label="说明">
            <div class="hint">{{ TEXTS.output.description }}</div>
        </FieldGroup>
    </div>
</template>
