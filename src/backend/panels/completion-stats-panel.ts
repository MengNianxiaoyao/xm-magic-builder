import * as vscode from 'vscode';
import type { CompletionStat } from '../../shared/messages';
import type { PanelDescriptor } from '../panel-types';
import { discardPendingUsage } from '../language/completion';

export const completionStatsPanel: PanelDescriptor = {
    id: 'xm-magic-builder.completion-stats',
    title: '补全使用统计',
    actions: [],
    vue: { component: 'completion-stats' },
    handleMessage(message: Record<string, unknown>, webview: vscode.WebviewView, context: vscode.ExtensionContext) {
        const msg = message as Record<string, string>;
        if (msg.command === 'load' || msg.command === 'refresh') {
            webview.webview.postMessage({ command: 'refresh', ...summarize(context) });
            return;
        }

        if (msg.command === 'reset') {
            vscode.window
                .showWarningMessage('确定要清空所有补全使用记录吗？', { modal: true }, '确认')
                .then((result) => {
                    if (result !== '确认') {
                        return;
                    }
                    discardPendingUsage();
                    context.globalState.update('completionUsage', undefined).then(
                        () => {
                            webview.webview.postMessage({ command: 'refresh', ...summarize(context) });
                            vscode.window.showInformationMessage('已清空统计');
                        },
                        () => {
                            vscode.window.showErrorMessage('清空统计失败');
                        }
                    );
                });
        }
    },
    onRefresh(context: vscode.ExtensionContext): Record<string, unknown> {
        return { command: 'refresh', ...summarize(context) };
    },
};

function summarize(context: vscode.ExtensionContext): { stats: CompletionStat[]; total: number } {
    const usage = context.globalState.get<Record<string, number>>('completionUsage') || {};
    const stats = Object.entries(usage)
        .sort((a, b) => b[1] - a[1])
        .map(([key, count]) => ({ key, count }));
    const total = stats.reduce((sum, item) => sum + item.count, 0);
    return { stats, total };
}
