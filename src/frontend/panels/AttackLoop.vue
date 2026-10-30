<script setup lang="ts">
import { post } from '../vscode-api';
</script>

<template>
    <div class="container">
        <div class="button-row" style="display: flex; flex-wrap: wrap; gap: 8px 16px">
            <button @click="post({ command: 'attack-loop-head' })">出招循环体头</button>
            <button @click="post({ command: 'attack-loop-tail' })">出招循环体尾</button>
        </div>
    </div>
</template>
