import * as vscode from 'vscode';
import type { PanelDescriptor } from '../panel-types';
import { checkXmFile, insertTextAtLine } from '../services/text-editor';
import { loadMagicManageFromFile, defaultMagicData } from '../services/magic-manage-file';

export const magicManagePanel: PanelDescriptor = {
    id: 'xm-magic-builder.magic-manage',
    title: '魔法管理',
    actions: [],
    vue: { component: 'magic-manage' },
    handleMessage(message: Record<string, unknown>, _context: vscode.ExtensionContext, webview: vscode.WebviewView) {
        const msg = message as Record<string, string>;
        if (msg.command === 'load-magic-manage') {
            const data = loadMagicManageFromFile() ?? defaultMagicData;
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
        const data = loadMagicManageFromFile() ?? defaultMagicData;
        return { command: 'magic-manage-loaded', data };
    },
};
