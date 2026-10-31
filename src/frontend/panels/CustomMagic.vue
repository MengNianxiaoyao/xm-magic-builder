<script setup lang="ts">
import { ref } from 'vue';
import { post, warn } from '../vscode-api';
import { useFileImport } from '../file-import';
import FieldGroup from '../components/FieldGroup.vue';

const passCurrent = ref(false);
const returnVar = ref(false);
const password = ref('');
const varName = ref('');
const plainContent = ref('');
const { fileName, fileHex, open } = useFileImport('custom-magic');

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
    post({ command: 'custom-magic-add', ...flags(), password: password.value, fileName: fileName.value, fileHex: fileHex.value });
}

function addPlain(): void {
    if (!varName.value) {
        warn('明文文件名不得为空!');
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

function addVar(): void {
    if (!varName.value) {
        warn('变量名称不得为空!');
        return;
    }
    if (!fileName.value) {
        warn('请先导入魔法!');
        return;
    }
    post({ command: 'custom-magic-var-add', varName: varName.value, fileHex: fileHex.value });
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
        <FieldGroup label="变量名称/明文文件名">
            <input v-model="varName" type="text" />
        </FieldGroup>
        <FieldGroup label="自定义魔法">
            <input :value="fileName" type="text" readonly />
        </FieldGroup>
        <FieldGroup label="明文内容">
            <textarea v-model="plainContent" rows="3"></textarea>
        </FieldGroup>
        <div class="btn-row">
            <button @click="open">导入魔法</button>
            <button @click="add">添加魔法</button>
            <button @click="addPlain">添加明文</button>
            <button @click="addVar">添加魔法变量</button>
            <button @click="useVar">使用魔法变量</button>
        </div>
    </div>
</template>
