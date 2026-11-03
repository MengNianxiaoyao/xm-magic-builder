<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue';
import type { GameDataInfo, GameDataType, GameMintmarkSummary, GameMonsterSummary } from '../../shared/messages';
import { onMessage, post, usePersistedRefs, warn } from '../vscode-api';
import FieldGroup from '../components/FieldGroup.vue';

const KINDS: { value: GameDataType; label: string; placeholder: string }[] = [
    { value: 'monster', label: '精灵', placeholder: '输入精灵名称或精灵ID' },
    { value: 'mintmark', label: '刻印', placeholder: '输入刻印名称或刻印ID' },
];

const kind = ref<GameDataType>('monster');
const monsterQuery = ref('');
const mintmarkQuery = ref('');
const total = ref(0);
const monsters = ref<GameMonsterSummary[]>([]);
const mintmarks = ref<GameMintmarkSummary[]>([]);
const loading = ref(false);
const error = ref('');
const searched = ref(false);
const info = ref<GameDataInfo | null>(null);
const updateState = ref<'idle' | 'checking' | 'downloading'>('idle');

usePersistedRefs({ kind, monsterQuery, mintmarkQuery });

/** 两种查询各自保留输入内容，切换时只切换到该查询自己的数据。 */
const query = computed({
    get: () => (kind.value === 'monster' ? monsterQuery.value : mintmarkQuery.value),
    set: (value: string) => {
        if (kind.value === 'monster') {
            monsterQuery.value = value;
        } else {
            mintmarkQuery.value = value;
        }
    },
});

const placeholder = computed(
    () => KINDS.find((item) => item.value === kind.value)?.placeholder ?? KINDS[0].placeholder
);
const visibleMonsters = computed(() => (kind.value === 'monster' ? monsters.value : []));
const visibleMintmarks = computed(() => (kind.value === 'mintmark' ? mintmarks.value : []));
const shown = computed(() => visibleMonsters.value.length + visibleMintmarks.value.length);
const busy = computed(() => updateState.value === 'checking' || updateState.value === 'downloading');

const STATUS_TIMEOUT = 150_000;
let statusTimer: ReturnType<typeof setTimeout> | undefined;

const statusText = computed(() => {
    if (updateState.value === 'checking') {
        return '检查更新中…';
    }
    if (updateState.value === 'downloading') {
        return '更新数据中…';
    }
    if (!info.value) {
        return '数据加载中…';
    }
    if (info.value.source === 'snapshot' && info.value.updatedAt) {
        return `更新于 ${formatDate(info.value.updatedAt)}`;
    }
    return '内置数据';
});

function clearStatusTimer(): void {
    window.clearTimeout(statusTimer);
    statusTimer = undefined;
}

function armStatusTimer(): void {
    clearStatusTimer();
    statusTimer = setTimeout(() => {
        if (updateState.value === 'checking' || updateState.value === 'downloading') {
            updateState.value = 'idle';
            warn('更新超时，继续使用当前数据');
        }
    }, STATUS_TIMEOUT);
}

function formatDate(value?: string): string {
    if (!value) {
        return '';
    }
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
        return '';
    }
    const pad = (number: number) => String(number).padStart(2, '0');
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

function updateData(): void {
    if (busy.value) {
        return;
    }
    updateState.value = 'checking';
    armStatusTimer();
    post({ command: 'check-game-data', force: true });
}

let timer: ReturnType<typeof setTimeout> | undefined;

function clearResults(): void {
    total.value = 0;
    monsters.value = [];
    mintmarks.value = [];
    error.value = '';
    loading.value = false;
    searched.value = false;
}

function search(): void {
    window.clearTimeout(timer);
    error.value = '';
    const text = query.value.trim();
    if (!text) {
        clearResults();
        return;
    }
    loading.value = true;
    post({ command: 'search-game-data', kind: kind.value, query: text });
}

function scheduleSearch(): void {
    window.clearTimeout(timer);
    timer = setTimeout(search, 200);
}

watch(kind, () => {
    window.clearTimeout(timer);
    clearResults();
    if (query.value.trim()) {
        search();
    }
});

watch(monsterQuery, () => {
    if (kind.value === 'monster') {
        scheduleSearch();
    }
});

watch(mintmarkQuery, () => {
    if (kind.value === 'mintmark') {
        scheduleSearch();
    }
});

onMounted(() => {
    post({ command: 'load-game-data-info' });
    post({ command: 'check-game-data', force: false });
    if (query.value.trim()) {
        search();
    }
});

onMessage((message) => {
    if (message.command === 'game-data-info') {
        info.value = {
            source: message.source,
            updatedAt: message.updatedAt,
            monsters: message.monsters,
            mintmarks: message.mintmarks,
        };
        return;
    }

    if (message.command === 'game-data-updated') {
        info.value = {
            source: message.source,
            updatedAt: message.updatedAt,
            monsters: message.monsters,
            mintmarks: message.mintmarks,
        };
        updateState.value = 'idle';
        clearStatusTimer();
        if (query.value.trim()) {
            search();
        }
        return;
    }

    if (message.command === 'game-data-status') {
        if (message.state === 'checking' || message.state === 'downloading') {
            updateState.value = message.state;
            armStatusTimer();
        } else {
            updateState.value = 'idle';
            clearStatusTimer();
        }
        return;
    }

    if (message.command === 'game-data-error') {
        error.value = message.message;
        loading.value = false;
        searched.value = true;
        return;
    }

    if (message.command !== 'game-data-result') {
        return;
    }

    if (message.kind !== kind.value || message.query !== query.value.trim()) {
        return;
    }

    total.value = message.total;
    monsters.value = message.monsters;
    mintmarks.value = message.mintmarks;
    loading.value = false;
    searched.value = true;
});
</script>

<template>
    <div class="container game-data-view">
        <FieldGroup label="数据类型">
            <div class="inline">
                <label v-for="item in KINDS" :key="item.value" class="choice">
                    <input v-model="kind" type="radio" :value="item.value" />
                    <span>{{ item.label }}</span>
                </label>
            </div>
        </FieldGroup>
        <FieldGroup :label="kind === 'monster' ? '精灵搜索' : '刻印搜索'">
            <div class="input-row">
                <input v-model="query" type="text" :placeholder="placeholder" @keyup.enter="search" />
                <button @click="search">搜索</button>
            </div>
        </FieldGroup>
        <div class="game-data-status">
            <span class="game-data-status-text">{{ statusText }}</span>
            <button class="btn-small" :disabled="busy" @click="updateData">检查更新</button>
        </div>
        <div v-if="error" class="game-data-tip error">加载失败：{{ error }}</div>
        <div v-else-if="loading" class="game-data-tip">搜索中…</div>
        <div v-else-if="searched && total === 0" class="game-data-tip">无匹配结果</div>
        <template v-else-if="searched">
            <div v-if="total > shown" class="game-data-tip">
                共 {{ total }} 条，仅显示前 {{ shown }} 条，请输入更精确的名称或ID
            </div>
            <div class="game-data-list">
                <div v-for="monster in visibleMonsters" :key="`monster-${monster.id}`" class="game-data-card">
                    <div class="game-data-head">
                        <span class="game-data-name">{{ monster.name }}</span>
                        <span class="item-id">ID {{ monster.id }}</span>
                    </div>
                    <div class="game-data-sub">可用技能 {{ monster.moves.length }} 个</div>
                    <div v-if="monster.moves.length" class="game-data-moves">
                        <span
                            v-for="move in monster.moves"
                            :key="move.id"
                            class="game-data-move"
                            :title="`技能ID ${move.id}`"
                        >
                            {{ move.name }}<span class="item-id">{{ move.id }}</span>
                        </span>
                    </div>
                    <div v-else class="game-data-sub">无技能数据</div>
                </div>
                <div v-for="mintmark in visibleMintmarks" :key="`mintmark-${mintmark.id}`" class="game-data-card">
                    <div class="game-data-head">
                        <span class="game-data-name">{{ mintmark.name }}</span>
                        <span class="item-id">ID {{ mintmark.id }}</span>
                    </div>
                    <div class="game-data-sub">
                        <template v-if="mintmark.series">
                            所属系列：{{ mintmark.series.name }}（ID {{ mintmark.series.id }}）
                        </template>
                        <template v-else>所属系列：无</template>
                    </div>
                    <div v-if="mintmark.effect" class="game-data-sub">效果：{{ mintmark.effect }}</div>
                </div>
            </div>
        </template>
    </div>
</template>
