<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import type { CompletionStat } from '../../shared/messages';
import { onMessage, post } from '../vscode-api';

const stats = ref<CompletionStat[]>([]);
const total = ref(0);

const rows = computed(() =>
    stats.value.map((stat) => {
        const index = stat.key.indexOf(':');
        return {
            ...stat,
            keyword: index === -1 ? '' : stat.key.slice(0, index),
            label: index === -1 ? stat.key : stat.key.slice(index + 1),
        };
    })
);

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
            <div v-for="row in rows" :key="row.key" class="stats-item" :title="row.key">
                <span class="stats-key">
                    <span v-if="row.keyword" class="stats-tag">{{ row.keyword }}</span>
                    <span class="stats-label">{{ row.label }}</span>
                </span>
                <span class="stats-count">{{ row.count }}</span>
            </div>
        </div>
    </div>
</template>
