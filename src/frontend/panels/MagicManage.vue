<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { onMessage, post } from '../vscode-api';
import FieldGroup from '../components/FieldGroup.vue';

const PORT_LIMITS = [
    { value: '0', label: '不限' },
    { value: '1', label: '限Unity端' },
    { value: '2', label: '限Flash端' },
];
const SPONSOR_PRESETS = ['1', '30', '90', '365', '0'];

const portLimit = ref('0');
const versionMajor = ref('0');
const versionMinor = ref('1');
const apiParam = ref('');
const versionCheck1 = ref(true);
const versionCheck2 = ref(false);
const blacklist = ref('');
const appid = ref('');
const sponsorDays = ref('1');

onMounted(() => post({ command: 'load-magic-manage' }));

onMessage((message) => {
    if (message.command !== 'magic-manage-loaded') {
        return;
    }
    const data = message.data;
    portLimit.value = data.portLimit;
    versionMajor.value = data.versionMajor;
    versionMinor.value = data.versionMinor;
    apiParam.value = data.apiParam;
    versionCheck1.value = data.versionCheck1 === '1';
    versionCheck2.value = data.versionCheck2 === '1';
    blacklist.value = data.blacklist;
    appid.value = data.appid;
    sponsorDays.value = SPONSOR_PRESETS.includes(data.sponsorDays) ? data.sponsorDays : '1';
});

function add(): void {
    post({
        command: 'magic-manage',
        portLimit: portLimit.value,
        versionMajor: versionMajor.value,
        versionMinor: versionMinor.value,
        apiParam: apiParam.value,
        versionCheck1: versionCheck1.value ? '1' : '0',
        versionCheck2: versionCheck2.value ? '1' : '0',
        blacklist: blacklist.value,
        appid: appid.value,
        sponsorDays: sponsorDays.value,
    });
}
</script>

<template>
    <div class="container">
        <FieldGroup label="端口限制">
            <div class="radio-group pt-inline">
                <label v-for="option in PORT_LIMITS" :key="option.value" class="radio-label">
                    <input v-model="portLimit" type="radio" :value="option.value" />
                    <span>{{ option.label }}</span>
                </label>
            </div>
        </FieldGroup>
        <FieldGroup label="当前版本">
            <div class="version-wrapper">
                <input v-model="versionMajor" type="number" class="version-input" />
                <span class="version-dot">.</span>
                <input v-model="versionMinor" type="number" class="version-input" />
            </div>
        </FieldGroup>
        <FieldGroup label="接口参数">
            <input v-model="apiParam" type="text" />
        </FieldGroup>
        <FieldGroup label="版本控制">
            <div class="checkbox-group">
                <label class="checkbox-label">
                    <input v-model="versionCheck1" type="checkbox" />
                    <span>当魔法版本小于接口返回的版本号时，禁止运行</span>
                </label>
                <label class="checkbox-label">
                    <input v-model="versionCheck2" type="checkbox" />
                    <span>当接口参数获取最新版本数据失败时，允许运行</span>
                </label>
            </div>
        </FieldGroup>
        <FieldGroup label="本地黑名单">
            <input v-model="blacklist" type="text" />
        </FieldGroup>
        <FieldGroup label="Appid">
            <input v-model="appid" type="text" />
        </FieldGroup>
        <FieldGroup label="赞助免费时长">
            <div class="pt-grid-3">
                <label class="radio-label"><input v-model="sponsorDays" type="radio" value="1" /><span>不限制</span></label>
                <label class="radio-label"><input v-model="sponsorDays" type="radio" value="30" /><span>月卡</span></label>
                <label class="radio-label"><input v-model="sponsorDays" type="radio" value="90" /><span>季卡</span></label>
                <label class="radio-label"><input v-model="sponsorDays" type="radio" value="365" /><span>年卡</span></label>
                <label class="radio-label"><input v-model="sponsorDays" type="radio" value="0" /><span>禁止</span></label>
            </div>
        </FieldGroup>
        <button class="btn-block" @click="add">添加</button>
    </div>
</template>
