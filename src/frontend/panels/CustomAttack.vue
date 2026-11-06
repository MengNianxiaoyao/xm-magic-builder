<script setup lang="ts">
import { ref } from 'vue';
import { post, usePersistedRefs, warn } from '../vscode-api';
import { useFileImport } from '../file-import';
import FieldGroup from '../components/FieldGroup.vue';
import { TEXTS } from '../texts';

const battlePacket = ref('');
const varName = ref('');
const disableTeam = ref(false);
const disablePreBattle = ref(false);
const disableAttack = ref(false);
const shieldCts = ref('');
const { fileName, fileHex, open } = useFileImport('custom-attack');

usePersistedRefs({
    battlePacket,
    varName,
    disableTeam,
    disablePreBattle,
    disableAttack,
    shieldCts,
    fileName,
    fileHex,
});

function add(): void {
    if (!battlePacket.value || !fileName.value) {
        warn('对战包/对战方案不得为空!');
        return;
    }
    post({
        command: 'custom-attack-add',
        battlePacket: battlePacket.value,
        fileName: fileName.value,
        fileHex: fileHex.value,
    });
}

function addVar(): void {
    if (!varName.value) {
        warn('变量名称不得为空!');
        return;
    }
    if (!fileName.value) {
        warn('请先导入对战方案!');
        return;
    }
    post({ command: 'custom-attack-var-add', varName: varName.value, fileHex: fileHex.value });
}

function useVar(): void {
    if (!battlePacket.value) {
        warn('对战包不得为空!');
        return;
    }
    if (!varName.value) {
        warn('变量名称不得为空!');
        return;
    }
    post({ command: 'custom-attack-use-var', battlePacket: battlePacket.value, varName: varName.value });
}

function addSettings(): void {
    const tokens: string[] = [];
    for (const item of shieldCts.value.split(/[,，]/).map((part) => part.trim())) {
        if (item === '') {
            continue;
        }
        if (/^\[[^[\]]+\]$/.test(item)) {
            tokens.push(item);
        } else if (/^[^[\]]+$/.test(item)) {
            tokens.push(`[${item}]`);
        } else {
            warn('屏蔽精灵ct数组格式不正确，请用 [catchtime] 的形式并用逗号隔开!');
            return;
        }
    }

    post({
        command: 'custom-attack-settings',
        disableTeam: disableTeam.value ? '1' : '0',
        disablePreBattle: disablePreBattle.value ? '1' : '0',
        disableAttack: disableAttack.value ? '1' : '0',
        shieldCts: tokens.join(','),
    });
}
</script>

<template>
    <div class="container">
        <FieldGroup label="对战方案添加">
            <span class="label">对战包</span>
            <input v-model="battlePacket" type="text" />
            <span class="label">对战方案</span>
            <div class="file-pick">
                <input :value="fileName" type="text" readonly placeholder="未选择对战方案" />
                <button @click="open">导入</button>
            </div>
            <button class="btn-block" @click="add">添加</button>
        </FieldGroup>
        <FieldGroup label="对战方案变量">
            <div class="cell">
                <span class="label">变量名称:</span>
                <input v-model="varName" type="text" />
            </div>
            <div class="btn-row">
                <button @click="addVar">添加出招变量</button>
                <button @click="useVar">使用出招变量</button>
            </div>
        </FieldGroup>
        <FieldGroup label="自定义出招设置（仅当前魔法有效，不包含子魔法）">
            <div class="grid-2">
                <label class="choice">
                    <input v-model="disableTeam" type="checkbox" />
                    <span>禁用阵容套装设置</span>
                </label>
                <label class="choice">
                    <input v-model="disablePreBattle" type="checkbox" />
                    <span>禁用战前设置</span>
                </label>
                <label class="choice">
                    <input v-model="disableAttack" type="checkbox" />
                    <span>禁用出招设置</span>
                </label>
            </div>
            <div class="field-head">
                <span class="label">阵容设置屏蔽精灵catchtime数组:</span>
                <button @click="addSettings">添加</button>
            </div>
            <textarea v-model="shieldCts" placeholder="[精灵_ct1],[精灵_ct2],[精灵_ct3]"></textarea>
            <div class="hint">{{ TEXTS.customAttack.settings }}</div>
        </FieldGroup>
    </div>
</template>
