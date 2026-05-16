import * as vscode from 'vscode';
import { BaseView } from './baseView';
import { COMMANDS } from '../constants/commands';

export class CompletionStatsView extends BaseView {
    public refresh(): void {
        if (!this.webviewView) {
            return;
        }
        this.webviewView.webview.postMessage({
            command: COMMANDS.REFRESH,
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
        return (
            '<div class="completion-stats-view">' +
            '<div class="stats-header">' +
            '<span class="title">加载中...</span>' +
            '<button id="resetBtn" disabled class="btn-reset-small">清空</button>' +
            '</div>' +
            '<div class="stats-list"></div>' +
            '</div>' +
            '<script>' +
            'const vscode = acquireVsCodeApi();' +
            'document.getElementById("resetBtn").addEventListener("click", function() {' +
            `vscode.postMessage({ command: "${COMMANDS.RESET}" });` +
            '});' +
            'window.addEventListener("message", function(event) {' +
            `if (event.data.command === "${COMMANDS.REFRESH}") {` +
            'var title = document.querySelector(".title");' +
            'if (event.data.total > 0) {' +
            'title.innerHTML = "补全已使用 <span class=\\"count\\">" + event.data.total + "</span> 次";' +
            '} else {' +
            'title.textContent = "暂无使用记录";' +
            '}' +
            'var statsList = document.querySelector(".stats-list");' +
            'if (event.data.stats && event.data.stats.length > 0) {' +
            'var html = "";' +
            'for (var i = 0; i < event.data.stats.length; i++) {' +
            'var s = event.data.stats[i];' +
            'html += "<div class=\\"stats-item\\"><span class=\\"stats-key\\">" + s.key + "</span><span class=\\"stats-count\\">" + s.count + "</span></div>";' +
            '}' +
            'statsList.innerHTML = html;' +
            'document.getElementById("resetBtn").disabled = false;' +
            '} else {' +
            'statsList.innerHTML = "";' +
            'document.getElementById("resetBtn").disabled = true;' +
            '}' +
            '}' +
            '});' +
            'window.addEventListener("load", function() {' +
            `vscode.postMessage({ command: "${COMMANDS.LOAD}" });` +
            '});' +
            '</script>'
        );
    }

    private escapeHtml(text: string): string {
        return text
            .replace(/&/g, '&')
            .replace(/</g, '<')
            .replace(/>/g, '>')
            .replace(/"/g, '"')
            .replace(/'/g, '&#039;');
    }

    protected handleMessage(message: any): void {
        if (
            message.command === COMMANDS.LOAD ||
            message.command === COMMANDS.REFRESH
        ) {
            this.webviewView?.webview.postMessage({
                command: COMMANDS.REFRESH,
                stats: this.getStats(),
                total: this.getTotal(),
            });
            return;
        }

        if (message.command === COMMANDS.RESET) {
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
                            .then(() => {
                                this.refresh();
                                vscode.window.showInformationMessage(
                                    '已清空统计'
                                );
                            });
                    }
                });
        }
    }
}
