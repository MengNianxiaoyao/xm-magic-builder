<script setup lang="ts">
import { ref } from 'vue';
import { post } from '../vscode-api';
import FieldGroup from '../components/FieldGroup.vue';

const content = ref('\\r\\n测试输出{1,十六进制,1,1}个,\\r\\n测试输出[变量1],\\r\\n测试输出#<3*2+1>#个');
</script>

<template>
    <div class="container">
        <FieldGroup label="输出内容(换行用\r\n代替)">
            <textarea v-model="content" rows="3"></textarea>
        </FieldGroup>
        <button class="btn-block" @click="post({ command: 'output', content })">信息输出</button>
    </div>
</template>
