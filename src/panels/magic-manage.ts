import * as vscode from 'vscode';
import type { PanelDescriptor } from '../shared/types';
import { checkXmFile, insertTextAtLine } from '../services/editor';
import { loadMagicManageFromFile } from '../features/magic-manage-loader';

export const magicManagePanel: PanelDescriptor = {
    id: 'xm-magic-builder.magic-manage',
    title: '魔法管理',
    fields: [],
    actions: [],
    scripts: ['src/js/magicManage.js'],
    getHtml() {
        return `<div class="container">
            <div class="input-group">
                <span class="label">端口限制</span>
                <div class="radio-group" style="display: flex; flex-wrap: wrap; gap: 8px 16px;">
                    <label class="radio-label">
                        <input type="radio" name="port-limit" value="0" checked />
                        <span>不限</span>
                    </label>
                    <label class="radio-label">
                        <input type="radio" name="port-limit" value="1" />
                        <span>限Unity端</span>
                    </label>
                    <label class="radio-label">
                        <input type="radio" name="port-limit" value="2" />
                        <span>限Flash端</span>
                    </label>
                </div>
            </div>
            <div class="input-group">
                <span class="label">当前版本</span>
                <div class="version-wrapper">
                    <input type="number" id="version-major" value="0" class="version-input" />
                    <span class="version-dot">.</span>
                    <input type="number" id="version-minor" value="1" class="version-input" />
                </div>
            </div>
            <div class="input-group">
                <span class="label">接口参数</span>
                <input type="text" id="api-param" />
            </div>
            <div class="input-group">
                <span class="label">版本控制</span>
                <div class="checkbox-group">
                    <label class="checkbox-label">
                        <input type="checkbox" id="version-check1" checked />
                        <span>当魔法版本小于接口返回的版本号时，禁止运行</span>
                    </label>
                    <label class="checkbox-label">
                        <input type="checkbox" id="version-check2" />
                        <span>当接口参数获取最新版本数据失败时，允许运行</span>
                    </label>
                </div>
            </div>
            <div class="input-group">
                <span class="label">本地黑名单</span>
                <input type="text" id="blacklist" />
            </div>
            <div class="input-group">
                <span class="label">Appid</span>
                <input type="text" id="appid" />
            </div>
            <div class="input-group">
                <span class="label">赞助用户到设置天数前可免费使用</span>
                <input type="number" id="sponsor-days" value="1" />
            </div>
            <button id="add-btn" class="btn-block">添加</button>
        </div>`;
    },
    handleMessage(message: Record<string, unknown>, _context: vscode.ExtensionContext, webview: vscode.WebviewView) {
        const msg = message as Record<string, string>;
        if (msg.command === 'load-magic-manage') {
            const data = loadMagicManageFromFile();
            webview.webview.postMessage({
                command: 'magic-manage-loaded',
                data,
            });
            return;
        }

        if (!checkXmFile()) {
            return;
        }

        if (msg.command === 'magic-manage') {
            const output = `魔法管理={端口限制=${msg.portLimit}|当前版本=${msg.versionMajor}.${msg.versionMinor}|接口参数=${msg.apiParam}|接口类型=0|版本控制1=${msg.versionCheck1}|版本控制2=${msg.versionCheck2}|本地黑名单=${msg.blacklist}|Appid=${msg.appid}|赞助免费=${msg.sponsorDays}}`;
            void insertTextAtLine(output, 0);
        }
    },
    onRefresh(_context: vscode.ExtensionContext): Record<string, unknown> {
        const data = loadMagicManageFromFile();
        return { command: 'magic-manage-loaded', data };
    },
};
