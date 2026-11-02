<script setup lang="ts">
import { computed, reactive, ref } from 'vue';
import { post, warn } from '../vscode-api';
import { TEXTS } from '../texts';
import FieldGroup from '../components/FieldGroup.vue';

type OperandKind = 'packet' | 'textVar' | 'intVar' | 'value';
type Relation = '判断真' | '且' | '或' | '判断假';

interface IfType {
    name: string;
    left: OperandKind;
    right: OperandKind;
}

interface Operand {
    index: number;
    varName: string;
    radix: string;
    start: number;
    end: number;
    value: string;
}

const TYPES: IfType[] = [
    { name: '参数比较数值', left: 'packet', right: 'value' },
    { name: '参数比较参数', left: 'packet', right: 'packet' },
    { name: '参数比较整数变量', left: 'packet', right: 'intVar' },
    { name: '参数比较文本变量参数', left: 'packet', right: 'textVar' },
    { name: '整数变量比较数值', left: 'intVar', right: 'value' },
    { name: '整数变量比较整数变量', left: 'intVar', right: 'intVar' },
    { name: '文本变量参数比较数值', left: 'textVar', right: 'value' },
    { name: '文本变量参数比较参数', left: 'textVar', right: 'packet' },
    { name: '文本变量参数比较整数变量', left: 'textVar', right: 'intVar' },
    { name: '文本变量参数比较文本变量参数', left: 'textVar', right: 'textVar' },
];

const RADIX = ['十六进制', '二进制'];
const OPERATORS = ['小于', '等于', '大于', '小于等于', '大于等于', '不等于'];
const LEVELS = [1, 2, 3, 4, 5];

const typeName = ref('参数比较数值');
const operator = ref('小于');
const level = ref(1);
const packetParam = ref('');

function newOperand(): Operand {
    return { index: 1, varName: '', radix: '十六进制', start: 1, end: 1, value: '' };
}

const left = reactive(newOperand());
const right = reactive(newOperand());

const current = computed(() => TYPES.find((item) => item.name === typeName.value) ?? TYPES[0]);
const leftKind = computed(() => current.value.left);
const rightKind = computed(() => current.value.right);

function ensureBrackets(name: string): string {
    const value = name.trim();
    return value.startsWith('[') && value.endsWith(']') ? value : `[${value}]`;
}

function validateOperand(kind: OperandKind, operand: Operand, label: string): boolean {
    if (kind === 'packet' || kind === 'textVar') {
        if (!Number.isInteger(operand.index) || operand.index < 0) {
            warn(`${label}序号不合法！`);
            return false;
        }
        if (!Number.isInteger(operand.start) || !Number.isInteger(operand.end)) {
            warn(`${label}参数位置不合法！`);
            return false;
        }
    } else if (kind === 'intVar' && operand.varName.trim() === '') {
        warn(`${label}变量不得为空！`);
        return false;
    } else if (kind === 'value' && operand.value.trim() === '') {
        warn(`${label}数值不得为空！`);
        return false;
    }
    return true;
}

function encode(kind: OperandKind, operand: Operand): string {
    if (kind === 'packet') {
        return `${operand.index},${operand.radix},${operand.start},${operand.end}`;
    }
    if (kind === 'textVar') {
        return `[${operand.index}],${operand.radix},${operand.start},${operand.end}`;
    }
    if (kind === 'intVar') {
        return ensureBrackets(operand.varName);
    }
    return operand.value.trim();
}

function addCondition(relation: Relation): void {
    if (relation !== '判断假') {
        if (!validateOperand(leftKind.value, left, '左侧')) {
            return;
        }
        if (!validateOperand(rightKind.value, right, '右侧')) {
            return;
        }
    }

    const condition =
        relation === '判断假'
            ? ''
            : `{${encode(leftKind.value, left)},${operator.value},${encode(rightKind.value, right)}}`;

    post({ command: 'if-loop-condition', relation, level: level.value, condition });
}
</script>

<template>
    <div class="container">
        <FieldGroup label="发包头部">
            <textarea v-model="packetParam" rows="2" placeholder="{46046,1,6099}|{46046,1,6099}"></textarea>
            <button @click="post({ command: 'if-loop-head', content: packetParam })">判断循环体头</button>
        </FieldGroup>

        <FieldGroup label="判断真假">
            <div class="if-field">
                <span class="label">类型:</span>
                <select v-model="typeName">
                    <option v-for="item in TYPES" :key="item.name" :value="item.name">{{ item.name }}</option>
                </select>
            </div>

            <template v-if="leftKind === 'packet' || leftKind === 'textVar'">
                <div class="if-row">
                    <span class="label">{{ leftKind === 'packet' ? '收包:' : '变量:' }}</span>
                    <input v-model.number="left.index" type="number" class="tiny" />
                    <select v-model="left.radix" class="tiny-select">
                        <option v-for="item in RADIX" :key="item" :value="item">{{ item }}</option>
                    </select>
                </div>
                <div class="if-row">
                    <span class="label">参数位置:</span>
                    <input v-model.number="left.start" type="number" class="tiny" />
                    <span class="tilde">~</span>
                    <input v-model.number="left.end" type="number" class="tiny" />
                </div>
            </template>
            <div v-else-if="leftKind === 'intVar'" class="if-row">
                <span class="label">变量:</span>
                <input v-model="left.varName" type="text" placeholder="例如 [1]" />
            </div>
            <div v-else class="if-row">
                <span class="label">数值:</span>
                <input v-model="left.value" type="text" />
            </div>

            <div class="if-row">
                <span class="label">比较:</span>
                <select v-model="operator">
                    <option v-for="item in OPERATORS" :key="item" :value="item">{{ item }}</option>
                </select>
            </div>

            <template v-if="rightKind === 'packet' || rightKind === 'textVar'">
                <div class="if-row">
                    <span class="label">{{ rightKind === 'packet' ? '收包:' : '变量:' }}</span>
                    <input v-model.number="right.index" type="number" class="tiny" />
                    <select v-model="right.radix" class="tiny-select">
                        <option v-for="item in RADIX" :key="item" :value="item">{{ item }}</option>
                    </select>
                </div>
                <div class="if-row">
                    <span class="label">参数位置:</span>
                    <input v-model.number="right.start" type="number" class="tiny" />
                    <span class="tilde">~</span>
                    <input v-model.number="right.end" type="number" class="tiny" />
                </div>
            </template>
            <div v-else-if="rightKind === 'intVar'" class="if-row">
                <span class="label">变量:</span>
                <input v-model="right.varName" type="text" placeholder="例如 [1]" />
            </div>
            <div v-else class="if-row">
                <span class="label">数值:</span>
                <input v-model="right.value" type="text" />
            </div>

            <div class="if-level">
                <span class="label">级别:</span>
                <select v-model.number="level" class="tiny-select">
                    <option v-for="item in LEVELS" :key="item" :value="item">{{ item }}</option>
                </select>
            </div>
            <div class="if-actions">
                <button @click="addCondition('判断真')">判断真</button>
                <button @click="addCondition('且')">且</button>
                <button @click="addCondition('或')">或</button>
                <button @click="addCondition('判断假')">判断假</button>
            </div>
        </FieldGroup>

        <div class="btn-row">
            <button @click="post({ command: 'if-loop-break' })">跳出循环</button>
            <button @click="post({ command: 'if-loop-tail' })">判断循环体尾</button>
        </div>

        <FieldGroup label="说明">
            <div class="hint">{{ TEXTS.ifLoop }}</div>
        </FieldGroup>
    </div>
</template>
