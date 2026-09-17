import * as vscode from 'vscode';
import { KEYWORD_COMPLETIONS, CompletionInfo } from './data';

interface CompletionUsage {
    [key: string]: number;
}

const COMPLETION_TRIGGERS = ['=', '发', '延', '对', '接', '精', '设', '使', '战', '出', '计', '野', '变', '信', '判'];

// 超长行（内联 hex 包体，单行可达 20 万字符）补全无意义，直接跳过
const MAX_LINE_LENGTH = 1000;
// 光标远离 = 超过该长度时视为正在输入长值，不再弹窗
const MAX_VALUE_LENGTH = 120;

interface FlatCompletion {
    keyword: string;
    c: CompletionInfo;
    hasEquals: boolean;
    fullText: string;
}

// 启动时预计算：每次按键不再 Object.keys + 重建数组
const KEYWORD_LIST = Object.keys(KEYWORD_COMPLETIONS);
const ALL_FLAT: FlatCompletion[] = [];
const FLAT_BY_KEYWORD = new Map<string, FlatCompletion[]>();
for (const keyword of KEYWORD_LIST) {
    const list: FlatCompletion[] = [];
    for (const c of KEYWORD_COMPLETIONS[keyword]) {
        const hasEquals = c.label.includes('=');
        const item: FlatCompletion = { keyword, c, hasEquals, fullText: hasEquals ? c.label : `${keyword}=${c.label}` };
        list.push(item);
        ALL_FLAT.push(item);
    }
    FLAT_BY_KEYWORD.set(keyword, list);
}

// documentation 的 MarkdownString 只构建一次，多次复用
const docCache = new Map<string, vscode.MarkdownString>();
function getDoc(text: string): vscode.MarkdownString {
    let doc = docCache.get(text);
    if (!doc) {
        doc = new vscode.MarkdownString(text);
        docCache.set(text, doc);
    }
    return doc;
}

// 使用统计常驻内存，避免每次按键都读 globalState（附带反序列化开销）
let cachedUsage: CompletionUsage | null = null;
function getUsageCached(context: vscode.ExtensionContext): CompletionUsage {
    if (!cachedUsage) {
        cachedUsage = context.globalState.get<CompletionUsage>('completionUsage') || {};
    }
    return cachedUsage;
}

/** 统计被外部清空时调用，避免内存缓存与存储不一致 */
export function clearUsageCache(): void {
    cachedUsage = null;
}

let debounceTimer: NodeJS.Timeout | null = null;
const DEBOUNCE_DELAY = 500;
const pendingUsageUpdates = new Map<string, number>();

export function disposeCompletion(): void {
    if (debounceTimer) {
        clearTimeout(debounceTimer);
        debounceTimer = null;
    }
    pendingUsageUpdates.clear();
    cachedUsage = null;
}

function getUsageCount(context: vscode.ExtensionContext): CompletionUsage {
    return getUsageCached(context);
}

function recordUsageWithDebounce(context: vscode.ExtensionContext, keyword: string, label: string): void {
    const key = `${keyword}:${label}`;

    const currentCount = pendingUsageUpdates.get(key) || 0;
    pendingUsageUpdates.set(key, currentCount + 1);

    if (debounceTimer) {
        clearTimeout(debounceTimer);
    }

    debounceTimer = setTimeout(() => {
        void (async () => {
            try {
                const usage = getUsageCount(context);

                for (const [updateKey, count] of pendingUsageUpdates.entries()) {
                    usage[updateKey] = (usage[updateKey] || 0) + count;
                }

                await context.globalState.update('completionUsage', usage);

                pendingUsageUpdates.clear();
                cachedUsage = usage;

                vscode.commands.executeCommand('xm-magic-builder.refreshCompletionStats');
            } catch (error) {
                console.error('写入补全记录失败:', error);
                pendingUsageUpdates.clear();
                cachedUsage = null;
            }
        })();
    }, DEBOUNCE_DELAY);
}

function calculateInsertText(c: CompletionInfo, keyword: string, beforeEq: string, hasEquals: boolean): string {
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
    flat: FlatCompletion,
    beforeEq: string,
    position: vscode.Position,
    eqIndex: number,
    usage?: CompletionUsage
): vscode.CompletionItem {
    const { keyword, c, hasEquals, fullText } = flat;
    const usageKey = `${keyword}:${c.label}`;
    const count = usage ? usage[usageKey] || 0 : 0;

    const item = new vscode.CompletionItem(
        fullText,
        hasEquals ? vscode.CompletionItemKind.Keyword : vscode.CompletionItemKind.Value
    );
    item.detail = c.detail;
    item.documentation = getDoc(c.documentation);
    item.insertText = calculateInsertText(c, keyword, beforeEq, hasEquals);
    if (eqIndex >= 0) {
        item.range = new vscode.Range(position.line, eqIndex + 1, position.line, position.character);
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

function sortByUsage<T>(items: T[], usage: CompletionUsage, getKey: (item: T) => string): T[] {
    return [...items].sort((a, b) => (usage[getKey(b)] || 0) - (usage[getKey(a)] || 0));
}

function getMatchedCompletions(currentInput: string): FlatCompletion[] {
    const result: FlatCompletion[] = [];
    for (const keyword of KEYWORD_LIST) {
        if (keyword.includes(currentInput) || currentInput.includes(keyword)) {
            const list = FLAT_BY_KEYWORD.get(keyword);
            if (list) {
                for (let i = 0; i < list.length; i++) {
                    result.push(list[i]);
                }
            }
        }
    }
    return result;
}

function buildCompletionList(
    items: FlatCompletion[],
    usage: CompletionUsage,
    position: vscode.Position,
    eqIndex: number,
    beforeEq: string
): vscode.CompletionItem[] {
    return sortByUsage(items, usage, ({ keyword, c }) => `${keyword}:${c.label}`).map((flat) =>
        createCompletionItem(flat, beforeEq, position, eqIndex, usage)
    );
}

export function registerCompletionProvider(extContext: vscode.ExtensionContext) {
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
                if (line.length > MAX_LINE_LENGTH) {
                    return undefined;
                }
                const cursor = Math.min(position.character, line.length);
                const eqIndex = line.lastIndexOf('=', cursor - 1);
                if (eqIndex !== -1 && cursor - eqIndex - 1 > MAX_VALUE_LENGTH) {
                    return undefined;
                }
                const usage = getUsageCount(extContext);
                const beforeEq = eqIndex !== -1 ? line.substring(0, eqIndex).trim() : '';

                for (const keyword of KEYWORD_LIST) {
                    if (beforeEq === keyword || beforeEq.endsWith(keyword)) {
                        const completions = FLAT_BY_KEYWORD.get(keyword);
                        if (!completions || completions.length === 0) {
                            return undefined;
                        }
                        return new vscode.CompletionList(
                            buildCompletionList(completions, usage, position, eqIndex, beforeEq),
                            false
                        );
                    }
                }

                if (eqIndex !== -1) {
                    return undefined;
                }

                const currentInput = line.substring(0, cursor).trim();
                const completions = currentInput === '' ? ALL_FLAT : getMatchedCompletions(currentInput);
                return new vscode.CompletionList(buildCompletionList(completions, usage, position, eqIndex, ''), false);
            },
        },
        ...COMPLETION_TRIGGERS
    );

    extContext.subscriptions.push(provider);
}
