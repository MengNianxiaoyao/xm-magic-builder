import { BaseView } from './baseView';
import {
    createRadioGroup,
    createTextInput,
    createCheckboxGroup,
    checkXmFile,
    insertTextAtLine,
} from '../utils';
import { loadMagicManageFromFile } from '../magicManageLoader';
import { COMMANDS } from '../constants/commands';
import { XM_KEYWORDS } from '../constants/xmKeywords';

export class MagicManageView extends BaseView {
    public refresh(): void {
        if (!this.webviewView) {
            return;
        }
        const data = loadMagicManageFromFile();
        this.webviewView.webview.postMessage({
            command: 'magic-manage-loaded',
            data,
        });
    }

    getContent(): string {
        const portLimitHtml = createRadioGroup(
            'port-limit',
            [
                { value: '0', label: '不限', checked: true },
                { value: '1', label: '限 Unity 端' },
                { value: '2', label: '限 Flash 端' },
            ],
            true
        );

        const versionWrapper = `
      <div class="version-wrapper">
      <input type="number" id="version-major" value="0" class="version-input" />
      <span class="version-dot">.</span>
      <input type="number" id="version-minor" value="1" class="version-input" />
      </div>`;

        const apiParamHtml = createTextInput({ id: 'api-param' });
        const versionCheckHtml = createCheckboxGroup([
            {
                id: 'version-check1',
                label: '当魔法版本小于接口返回的版本号时，禁止运行',
                checked: true,
            },
            {
                id: 'version-check2',
                label: '当接口参数获取最新版本数据失败时，允许运行',
            },
        ]);
        const blacklistHtml = createTextInput({ id: 'blacklist' });
        const appidHtml = createTextInput({ id: 'appid' });
        const sponsorDaysHtml = createTextInput({
            id: 'sponsor-days',
            value: '1',
            type: 'number',
        });

        return `
        <div class="container">
        <div class="input-group">
        <span class="label">端口限制</span>
        ${portLimitHtml}
        </div>
        <div class="input-group">
        <span class="label">当前版本</span>
        ${versionWrapper}
        </div>
        <div class="input-group">
        <span class="label">接口参数</span>
        ${apiParamHtml}
        </div>
        <div class="input-group">
        <span class="label">版本控制</span>
        ${versionCheckHtml}
        </div>
        <div class="input-group">
        <span class="label">本地黑名单</span>
        ${blacklistHtml}
        </div>
        <div class="input-group">
        <span class="label">Appid</span>
        ${appidHtml}
        </div>
        <div class="input-group">
        <span class="label">赞助用户到设置天数前可免费使用</span>
        ${sponsorDaysHtml}
        </div>
        <button id="add-btn" class="btn-block">添加</button>
        </div>
        <script>
        const vscode = acquireVsCodeApi();

        function loadFromFile() {
        vscode.postMessage({ command: 'load-magic-manage' });
        }

        function setFormValues(data) {
        if (!data) {return;}

        const portRadios = document.querySelectorAll('input[name="port-limit"]');
        portRadios.forEach(radio => {
        radio.checked = radio.value === data.portLimit;
        });

        document.getElementById('version-major').value = data.versionMajor;
        document.getElementById('version-minor').value = data.versionMinor;
        document.getElementById('api-param').value = data.apiParam || '';
        document.getElementById('version-check1').checked = data.versionCheck1 === '1';
        document.getElementById('version-check2').checked = data.versionCheck2 === '1';
        document.getElementById('blacklist').value = data.blacklist || '';
        document.getElementById('appid').value = data.appid || '';
        document.getElementById('sponsor-days').value = data.sponsorDays || '1';
        }

        document.getElementById('add-btn').addEventListener('click', () => {
        const portLimit = document.querySelector('input[name="port-limit"]:checked').value;
        const versionMajor = document.getElementById('version-major').value;
        const versionMinor = document.getElementById('version-minor').value;
        const apiParam = document.getElementById('api-param').value;
        const versionCheck1 = document.getElementById('version-check1').checked ? '1' : '0';
        const versionCheck2 = document.getElementById('version-check2').checked ? '1' : '0';
        const blacklist = document.getElementById('blacklist').value;
        const appid = document.getElementById('appid').value;
        const sponsorDays = document.getElementById('sponsor-days').value;

        vscode.postMessage({
        command: 'magic-manage',
        portLimit,
        versionMajor,
        versionMinor,
        apiParam,
        versionCheck1,
        versionCheck2,
        blacklist,
        appid,
        sponsorDays
        });
        });

        window.addEventListener('load', loadFromFile);

        window.addEventListener('message', (event) => {
        if (event.data.command === 'magic-manage-loaded') {
        setFormValues(event.data.data);
        }
        });
        </script>`;
    }

    protected handleMessage(message: any): void {
        if (message.command === COMMANDS.LOAD_MAGIC_MANAGE) {
            const data = loadMagicManageFromFile();
            this.webviewView?.webview.postMessage({
                command: 'magic-manage-loaded',
                data,
            });
            return;
        }

        if (!checkXmFile()) {
            return;
        }

        if (message.command === COMMANDS.MAGIC_MANAGE) {
            const output = `${XM_KEYWORDS.MAGIC_MANAGE}={端口限制=${message.portLimit}|当前版本=${message.versionMajor}.${message.versionMinor}|接口参数=${message.apiParam}|接口类型=0|版本控制1=${message.versionCheck1}|版本控制2=${message.versionCheck2}|本地黑名单=${message.blacklist}|Appid=${message.appid}|赞助免费=${message.sponsorDays}}`;
            insertTextAtLine(output, 0);
        }
    }
}
