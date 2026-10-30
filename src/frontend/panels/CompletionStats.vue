<script setup lang="ts">
import { onMounted, ref } from 'vue';
import type { CompletionStat } from '../../shared/messages';
import { onMessage, post } from '../vscode-api';

const stats = ref<CompletionStat[]>([]);
const total = ref(0);

onMounted(() => post({ command: 'load' }));

onMessage((message) => {
    if (message.command !== 'refresh') {
        return;
    }
    stats.value = message.stats;
    total.value = message.total;
});
</script>

<template>
    <div class="completion-stats-view">
        <div class="stats-header">
            <span v-if="total > 0" class="title">补全已使用 <span class="count">{{ total }}</span> 次</span>
            <span v-else class="title">暂无使用记录</span>
            <button class="btn-reset-small" :disabled="stats.length === 0" @click="post({ command: 'reset' })">清空</button>
        </div>
        <div class="stats-list">
            <div v-for="stat in stats" :key="stat.key" class="stats-item">
                <span class="stats-key">{{ stat.key }}</span>
                <span class="stats-count">{{ stat.count }}</span>
            </div>
        </div>
    </div>
</template>
