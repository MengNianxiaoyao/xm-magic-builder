<script setup lang="ts">
import { ref } from 'vue';
import { onMessage, post, usePersistedRefs, warn } from '../vscode-api';
import { useFileImport } from '../file-import';
import { TEXTS } from '../texts';
import FieldGroup from '../components/FieldGroup.vue';

const passCurrent = ref(false);
const returnVar = ref(false);
const password = ref('');
const varName = ref('');
const plainContent = ref('');
const { fileName, filePath, open } = useFileImport('custom-magic');

usePersistedRefs({ passCurrent, returnVar, password, varName, plainContent, fileName, filePath });

// 后端解密完成：原文直接回填到明文输入框，方便查看或再次修改。
onMessage((message) => {
    if (message.command === 'custom-magic-plain-decoded') {
        plainContent.value = message.text;
    }
});

function flags(): { passCurrent: string; returnVar: string } {
    return {
        passCurrent: passCurrent.value ? '1' : '0',
        returnVar: returnVar.value ? '1' : '0',
    };
}

function add(): void {
    if (!fileName.value) {
        warn('自定义魔法不得为空!');
        return;
    }
    post({ command: 'custom-magic-add', ...flags(), password: password.value, fileName: fileName.value, filePath: filePath.value });
}

function addPlain(): void {
    if (!varName.value) {
        warn('明文名称不得为空!');
        return;
    }
    if (!plainContent.value) {
        warn('明文内容不得为空!');
        return;
    }
    post({
        command: 'custom-magic-plain-add',
        ...flags(),
        varName: varName.value,
        plainContent: plainContent.value,
    });
}

function decodePlain(): void {
    if (!plainContent.value.trim()) {
        warn('明文数据不得为空!');
        return;
    }
    post({ command: 'custom-magic-plain-decode', plainContent: plainContent.value });
}

function addVar(): void {
    if (!varName.value) {
        warn('变量名称不得为空!');
        return;
    }
    if (!fileName.value) {
        warn('请先导入魔法!');
        return;
    }
    post({ command: 'custom-magic-var-add', varName: varName.value, filePath: filePath.value });
}

function useVar(): void {
    if (!varName.value) {
        warn('变量名称不得为空!');
        return;
    }
    post({ command: 'custom-magic-use-var', ...flags(), password: password.value, varName: varName.value });
}
</script>

<template>
    <div class="container">
        <FieldGroup label="调用选项">
            <div class="stack">
                <label class="choice"><input v-model="passCurrent" type="checkbox" /><span>传入当前魔法变量</span></label>
                <label class="choice"><input v-model="returnVar" type="checkbox" /><span>返回调用魔法变量</span></label>
            </div>
        </FieldGroup>
        <FieldGroup label="魔法密码">
            <input v-model="password" type="text" />
        </FieldGroup>
        <FieldGroup label="变量名称/明文名称">
            <input v-model="varName" type="text" />
            <div class="grid-2">
                <button @click="addVar">添加魔法变量</button>
                <button @click="useVar">使用魔法变量</button>
            </div>
        </FieldGroup>
        <FieldGroup label="自定义魔法">
            <div class="file-pick">
                <input :value="fileName" type="text" readonly />
                <button @click="open">导入</button>
            </div>
            <button class="btn-block" @click="add">添加</button>
        </FieldGroup>
        <FieldGroup label="明文内容">
            <textarea v-model="plainContent" rows="3"></textarea>
            <div class="grid-2">
                <button @click="addPlain">添加明文</button>
                <button @click="decodePlain">解密明文</button>
            </div>
        </FieldGroup>
        <FieldGroup label="说明">
            <div class="hint">{{ TEXTS.customMagic.plain }}</div>
        </FieldGroup>
    </div>
</template>
