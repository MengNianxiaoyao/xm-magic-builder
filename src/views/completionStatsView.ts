import * as vscode from 'vscode';
import { BaseView } from './baseView';
import { ViewMessage } from '../types/messages';

export class CompletionStatsView extends BaseView {
    protected getScriptPaths(): string[] {
        return ['resources/js/completionStats.js'];
    }

    public refresh(): void {
        if (!this.webviewView) {
            return;
        }
        this.webviewView.webview.postMessage({
            command: 'refresh',
            stats: this.getStats(),
            total: this.getTotal(),
        });
    }

    private getStats(): Array<{ key: string; count: number }> {
        const stats =
            this.context.globalState.get<Record<string, number>>(
                'completionUsage'
            ) || {};
        return Object.entries(stats)
            .sort((a, b) => b[1] - a[1])
            .map(([key, count]) => ({ key, count }));
    }

    private getTotal(): number {
        const stats =
            this.context.globalState.get<Record<string, number>>(
                'completionUsage'
            ) || {};
        return Object.values(stats).reduce((sum, count) => sum + count, 0);
    }

    getContent(): string {
        return `
        <div class="completion-stats-view">
            <div class="stats-header">
                <span class="title">加载中...</span>
                <button id="resetBtn" disabled class="btn-reset-small">清空</button>
            </div>
            <div class="stats-list"></div>
        </div>`;
    }

    protected handleMessage(message: ViewMessage): void {
        if (message.command === 'load' || message.command === 'refresh') {
            this.webviewView?.webview.postMessage({
                command: 'refresh',
                stats: this.getStats(),
                total: this.getTotal(),
            });
            return;
        }

        if (message.command === 'reset') {
            vscode.window
                .showWarningMessage(
                    '确定要清空所有补全使用记录吗？',
                    { modal: true },
                    '确认'
                )
                .then((result) => {
                    if (result === '确认') {
                        this.context.globalState
                            .update('completionUsage', undefined)
                            .then(
                                () => {
                                    this.refresh();
                                    vscode.window.showInformationMessage(
                                        '已清空统计'
                                    );
                                },
                                () => {
                                    vscode.window.showErrorMessage(
                                        '清空统计失败'
                                    );
                                }
                            );
                    }
                });
        }
    }
}
