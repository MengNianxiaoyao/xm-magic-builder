<script setup lang="ts">
import { post } from '../vscode-api';
import { TEXTS } from '../texts';
import FieldGroup from '../components/FieldGroup.vue';
</script>

<template>
    <div class="container">
        <div class="btn-row">
            <button @click="post({ command: 'attack-loop-head' })">出招循环体头</button>
            <button @click="post({ command: 'attack-loop-tail' })">出招循环体尾</button>
        </div>
        <FieldGroup label="说明">
            <div class="hint">{{ TEXTS.attackLoop }}</div>
        </FieldGroup>
    </div>
</template>
