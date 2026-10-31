<script setup lang="ts">
import { ref } from 'vue';
import { post, warn } from '../vscode-api';
import { useFileImport } from '../file-import';
import FieldGroup from '../components/FieldGroup.vue';

const battlePacket = ref('');
const varName = ref('');
const { fileName, fileHex, open } = useFileImport('custom-attack');

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
</script>

<template>
    <div class="container">
        <FieldGroup label="对战包">
            <input v-model="battlePacket" type="text" />
        </FieldGroup>
        <FieldGroup label="变量名称">
            <input v-model="varName" type="text" />
        </FieldGroup>
        <FieldGroup label="自定义出招">
            <input :value="fileName" type="text" readonly />
        </FieldGroup>
        <div class="btn-row">
            <button @click="open">导入对战方案</button>
            <button @click="add">添加出招</button>
            <button @click="addVar">添加出招变量</button>
            <button @click="useVar">使用出招变量</button>
        </div>
    </div>
</template>
