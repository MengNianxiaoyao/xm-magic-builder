<script setup lang="ts">
import { ref } from 'vue';
import { post } from '../vscode-api';
import FieldGroup from '../components/FieldGroup.vue';

const packetParam = ref('');
</script>

<template>
    <div class="container">
        <FieldGroup label="发包参数">
            <textarea v-model="packetParam" rows="3"></textarea>
        </FieldGroup>
        <div class="btn-row">
            <button @click="post({ command: 'if-loop-head', content: packetParam })">判断循环体头</button>
            <button @click="post({ command: 'if-loop-tail' })">判断循环体尾</button>
            <button @click="post({ command: 'if-loop-break' })">跳出循环</button>
        </div>
    </div>
</template>
