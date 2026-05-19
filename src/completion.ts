import * as vscode from 'vscode';
import { KEYWORD_COMPLETIONS, CompletionInfo } from './completionsData';

interface CompletionUsage {
    [key: string]: number;
}

const COMPLETION_TRIGGERS = [
    '=',
    '发',
    '延',
    '对',
    '接',
    '精',
    '设',
    '使',
    '战',
    '出',
    '计',
    '野',
    '变',
    '信',
    '判',
];

// 防抖写入相关变量
let debounceTimer: NodeJS.Timeout | null = null;
const DEBOUNCE_DELAY = 500;
const pendingUsageUpdates = new Map<string, number>();

export function disposeCompletion(): void {
    if (debounceTimer) {
        clearTimeout(debounceTimer);
        debounceTimer = null;
    }
    pendingUsageUpdates.clear();
}

function getUsageCount(context: vscode.ExtensionContext): CompletionUsage {
    return context.globalState.get<CompletionUsage>('completionUsage') || {};
}

/**
 * 防抖写入使用记录
 * 合并多次写入操作，减少 globalState 的写入频率
 */
function recordUsageWithDebounce(
    context: vscode.ExtensionContext,
    keyword: string,
    label: string
): void {
    const key = `${keyword}:${label}`;

    // 累加待写入的计数
    const currentCount = pendingUsageUpdates.get(key) || 0;
    pendingUsageUpdates.set(key, currentCount + 1);

    // 清除之前的定时器
    if (debounceTimer) {
        clearTimeout(debounceTimer);
    }

    // 设置新的防抖定时器
    debounceTimer = setTimeout(async () => {
        try {
            // 读取最新的 usage 数据
            const usage = getUsageCount(context);

            // 合并所有待写入的更新
            for (const [updateKey, count] of pendingUsageUpdates.entries()) {
                usage[updateKey] = (usage[updateKey] || 0) + count;
            }

            // 写入 globalState
            await context.globalState.update('completionUsage', usage);

            // 清空待写入队列
            pendingUsageUpdates.clear();

            // 刷新补全统计视图
            vscode.commands.executeCommand(
                'xm-magic-builder.refreshCompletionStats'
            );
        } catch (error) {
            console.error('写入补全记录失败:', error);
            pendingUsageUpdates.clear();
        }
    }, DEBOUNCE_DELAY);
}

function calculateInsertText(
    c: CompletionInfo,
    keyword: string,
    beforeEq: string
): string {
    const hasEquals = c.label.includes('=');
    if (beforeEq === '') {
        return hasEquals ? c.label : `${keyword}=${c.label}`;
    }
    if (beforeEq === keyword && hasEquals) {
        return c.label.substring(keyword.length + 1);
    }
    if (beforeEq !== keyword && !hasEquals) {
        return `${keyword}=${c.label}`;
    }
    return c.label;
}

function createCompletionItem(
    c: CompletionInfo,
    keyword: string,
    beforeEq: string,
    _context: vscode.ExtensionContext,
    position: vscode.Position,
    eqIndex: number,
    usage?: CompletionUsage
): vscode.CompletionItem {
    const fullText = c.label.includes('=') ? c.label : `${keyword}=${c.label}`;
    const isSubKeyword = c.label.includes('=');
    const usageKey = `${keyword}:${c.label}`;
    const count = usage ? usage[usageKey] || 0 : 0;

    const item = new vscode.CompletionItem(
        fullText,
        isSubKeyword
            ? vscode.CompletionItemKind.Keyword
            : vscode.CompletionItemKind.Value
    );
    item.detail = c.detail;
    item.documentation = new vscode.MarkdownString(c.documentation);
    item.insertText = calculateInsertText(c, keyword, beforeEq);
    if (eqIndex >= 0) {
        item.range = new vscode.Range(
            position.line,
            eqIndex + 1,
            position.line,
            position.character
        );
    }
    item.sortText =
        count > 0
            ? `A${Math.max(0, 1000000 - count)
                  .toString()
                  .padStart(10, '0')}`
            : undefined;
    item.command = {
        command: 'xm-magic-builder.recordCompletionUsage',
        title: 'Record Usage',
        arguments: [keyword, c.label],
    };
    return item;
}

function sortByUsage<T>(
    items: T[],
    usage: CompletionUsage,
    getKey: (item: T) => string
): T[] {
    return [...items].sort(
        (a, b) => (usage[getKey(b)] || 0) - (usage[getKey(a)] || 0)
    );
}

function getAllCompletions(): { keyword: string; c: CompletionInfo }[] {
    const result: { keyword: string; c: CompletionInfo }[] = [];
    for (const keyword of Object.keys(KEYWORD_COMPLETIONS)) {
        for (const c of KEYWORD_COMPLETIONS[keyword]) {
            result.push({ keyword, c });
        }
    }
    return result;
}

function getMatchedCompletions(
    currentInput: string
): { keyword: string; c: CompletionInfo }[] {
    const result: { keyword: string; c: CompletionInfo }[] = [];
    for (const keyword of Object.keys(KEYWORD_COMPLETIONS)) {
        if (keyword.includes(currentInput) || currentInput.includes(keyword)) {
            for (const c of KEYWORD_COMPLETIONS[keyword]) {
                result.push({ keyword, c });
            }
        }
    }
    return result;
}

function buildCompletionList(
    items: { keyword: string; c: CompletionInfo }[],
    usage: CompletionUsage,
    context: vscode.ExtensionContext,
    position: vscode.Position,
    eqIndex: number,
    beforeEq: string
): vscode.CompletionItem[] {
    return sortByUsage(
        items,
        usage,
        ({ keyword, c }) => `${keyword}:${c.label}`
    ).map(({ keyword, c }) =>
        createCompletionItem(
            c,
            keyword,
            beforeEq,
            context,
            position,
            eqIndex,
            usage
        )
    );
}

export function registerCompletionProvider(
    extContext: vscode.ExtensionContext
) {
    const recordUsageCommand = vscode.commands.registerCommand(
        'xm-magic-builder.recordCompletionUsage',
        (keyword: string, label: string) => {
            recordUsageWithDebounce(extContext, keyword, label);
        }
    );

    extContext.subscriptions.push(recordUsageCommand);

    const provider = vscode.languages.registerCompletionItemProvider(
        'xm',
        {
            provideCompletionItems(document, position) {
                const line = document.lineAt(position.line).text;
                const lineUntil = line.substring(0, position.character);
                const usage = getUsageCount(extContext);
                const eqIndex = lineUntil.lastIndexOf('=');
                const beforeEq =
                    eqIndex !== -1
                        ? lineUntil.substring(0, eqIndex).trim()
                        : '';

                for (const keyword of Object.keys(KEYWORD_COMPLETIONS)) {
                    if (beforeEq === keyword || beforeEq.endsWith(keyword)) {
                        const completions = KEYWORD_COMPLETIONS[keyword];
                        if (completions.length === 0) {
                            return undefined;
                        }
                        return new vscode.CompletionList(
                            buildCompletionList(
                                completions.map((c) => ({ keyword, c })),
                                usage,
                                extContext,
                                position,
                                eqIndex,
                                beforeEq
                            ),
                            false
                        );
                    }
                }

                if (eqIndex !== -1) {
                    return undefined;
                }

                const currentInput = lineUntil.trim();
                const completions =
                    currentInput === ''
                        ? getAllCompletions()
                        : getMatchedCompletions(currentInput);
                return new vscode.CompletionList(
                    buildCompletionList(
                        completions,
                        usage,
                        extContext,
                        position,
                        eqIndex,
                        ''
                    ),
                    false
                );
            },
        },
        ...COMPLETION_TRIGGERS
    );

    extContext.subscriptions.push(provider);
}
