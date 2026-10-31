<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { post, warn } from '../vscode-api';
import FieldGroup from '../components/FieldGroup.vue';
import {
    INTEGER_VAR_VALUES,
    NO_CUSTOM_VAR_TYPES,
    STRING_VAR_VALUES,
} from '../../shared/variable-values';

const varName = ref('');
const varType = ref('integer');
const varValue = ref('自定义值');
const customValue = ref('');
const attrType = ref('基础');
const attrValue = ref('体力');

const options = computed(() => (varType.value === 'integer' ? INTEGER_VAR_VALUES : STRING_VAR_VALUES));
const description = computed(() => options.value.find((item) => item.value === varValue.value)?.description ?? '');
const showCustom = computed(() => !NO_CUSTOM_VAR_TYPES.includes(varValue.value));
const showSpriteAttr = computed(() => varValue.value === '精灵属性查询返回');

watch(varType, () => {
    varValue.value = options.value[0]?.value ?? '';
});

function add(): void {
    if (!varName.value) {
        warn('变量名称不得为空！');
        return;
    }
    if (showCustom.value && !customValue.value) {
        warn('当前类型变量值不得为空！');
        return;
    }
    post({
        command: 'variable-add',
        varName: varName.value,
        varType: varType.value,
        varValue: varValue.value,
        customValue: customValue.value,
        attrType: attrType.value,
        attrValue: attrValue.value,
    });
}
</script>

<template>
    <div class="container">
        <FieldGroup label="变量名称">
            <input v-model="varName" type="text" />
        </FieldGroup>
        <FieldGroup label="变量类型">
            <select v-model="varType">
                <option value="integer">整数型(长整数)</option>
                <option value="string">文本型(字符串)</option>
            </select>
        </FieldGroup>
        <FieldGroup label="变量值">
            <select v-model="varValue">
                <option v-for="item in options" :key="item.value" :value="item.value">{{ item.label }}</option>
            </select>
        </FieldGroup>
        <FieldGroup v-if="showSpriteAttr" label="精灵属性">
            <div class="row">
                <div class="stack">
                    <span class="label">属性类型</span>
                    <select v-model="attrType">
                        <option value="基础">基础</option>
                        <option value="PVE">PVE</option>
                        <option value="PVP">PVP</option>
                    </select>
                </div>
                <div class="stack">
                    <span class="label">属性值</span>
                    <select v-model="attrValue">
                        <option value="体力">体力</option>
                        <option value="攻击">攻击</option>
                        <option value="防御">防御</option>
                        <option value="特攻">特攻</option>
                        <option value="特防">特防</option>
                        <option value="速度">速度</option>
                    </select>
                </div>
            </div>
        </FieldGroup>
        <FieldGroup v-if="showCustom" label="自定义值">
            <input v-model="customValue" type="text" />
        </FieldGroup>
        <div class="btn-row">
            <button @click="post({ command: 'variable-clear' })">清空变量</button>
            <button @click="add">添加变量</button>
        </div>
        <div class="hint value-description">{{ description }}</div>
    </div>
</template>
