<script setup lang="ts">
import { ref } from 'vue';
import { post } from '../vscode-api';
import FieldGroup from '../components/FieldGroup.vue';

const condition = ref('对战胜利');
</script>

<template>
    <div class="container">
        <FieldGroup label="条件类型">
            <select v-model="condition">
                <option value="对战胜利">对战胜利</option>
                <option value="对战未触发">对战未触发</option>
            </select>
        </FieldGroup>
        <div class="button-row" style="display: flex; flex-wrap: wrap; gap: 8px 16px">
            <button @click="post({ command: 'battle-loop-head', content: condition })">对战循环体头</button>
            <button @click="post({ command: 'battle-loop-tail', content: condition })">对战循环体尾</button>
        </div>
    </div>
</template>
