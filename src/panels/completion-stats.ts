import * as vscode from 'vscode';
import type { PanelDescriptor } from '../shared/types';

export const completionStatsPanel: PanelDescriptor = {
    id: 'xm-magic-builder.completion-stats',
    title: '补全使用统计',
    fields: [],
    actions: [],
    scripts: ['resources/js/completionStats.js'],
    getHtml() {
        return `<div class="completion-stats-view">
            <div class="stats-header">
                <span class="title">加载中...</span>
                <button id="resetBtn" disabled class="btn-reset-small">清空</button>
            </div>
            <div class="stats-list"></div>
        </div>`;
    },
    handleMessage(message: Record<string, unknown>, context: vscode.ExtensionContext, webview: vscode.WebviewView) {
        const msg = message as Record<string, string>;
        if (msg.command === 'load' || msg.command === 'refresh') {
            const stats = getStats(context);
            webview.webview.postMessage({
                command: 'refresh',
                stats,
                total: getTotal(context),
            });
            return;
        }

        if (msg.command === 'reset') {
            vscode.window
                .showWarningMessage('确定要清空所有补全使用记录吗？', { modal: true }, '确认')
                .then((result) => {
                    if (result === '确认') {
                        context.globalState.update('completionUsage', undefined).then(
                            () => {
                                const s = getStats(context);
                                webview.webview.postMessage({
                                    command: 'refresh',
                                    stats: s,
                                    total: getTotal(context),
                                });
                                vscode.window.showInformationMessage('已清空统计');
                            },
                            () => {
                                vscode.window.showErrorMessage('清空统计失败');
                            }
                        );
                    }
                });
        }
    },
    onRefresh(context: vscode.ExtensionContext): Record<string, unknown> {
        return {
            command: 'refresh',
            stats: getStats(context),
            total: getTotal(context),
        };
    },
};

function getStats(context: vscode.ExtensionContext): Array<{ key: string; count: number }> {
    const stats = context.globalState.get<Record<string, number>>('completionUsage') || {};
    return Object.entries(stats)
        .sort((a, b) => b[1] - a[1])
        .map(([key, count]) => ({ key, count }));
}

function getTotal(context: vscode.ExtensionContext): number {
    const stats = context.globalState.get<Record<string, number>>('completionUsage') || {};
    return Object.values(stats).reduce((sum, count) => sum + count, 0);
}
