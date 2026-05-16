import * as vscode from 'vscode';

interface CompletionUsage {
    [key: string]: number;
}

interface CompletionInfo {
    label: string;
    detail: string;
    documentation: string;
}

const KEYWORD_COMPLETIONS: Record<string, CompletionInfo[]> = {
    发包: [
        {
            label: '发包=',
            detail: '发包',
            documentation: '发送包体',
        },
    ],
    延时: [
        {
            label: '延时=',
            detail: '延时',
            documentation: '设置延时时间(毫秒), 1000ms=1秒',
        },
        {
            label: '1000\r\n',
            detail: '1000ms',
            documentation: '设置1秒延时',
        },
    ],
    对战延时: [
        {
            label: '对战延时=',
            detail: '对战延时',
            documentation: '设置对战延时时间(毫秒), 1000ms=1秒',
        },
        {
            label: '5000\r\n',
            detail: '5000ms',
            documentation: '设置5秒对战延时',
        },
    ],
    接管对战: [
        {
            label: '接管对战=',
            detail: '接管对战',
            documentation: '接管指定对战',
        },
    ],
    精灵首发: [
        {
            label: '精灵首发=',
            detail: '精灵首发',
            documentation: '设置首发精灵 ID',
        },
    ],
    精灵切换: [
        {
            label: '精灵切换-ID=',
            detail: '精灵切换-ID',
            documentation: '通过精灵ID切换',
        },
        {
            label: '精灵切换-位置=',
            detail: '精灵切换-位置',
            documentation: '通过背包位置切换',
        },
    ],
    设置背包: [
        {
            label: '设置背包=',
            detail: '设置背包',
            documentation: '设置背包精灵ID列表',
        },
        {
            label: '还原背包\r\n',
            detail: '还原背包',
            documentation: '还原默认背包',
        },
    ],
    使用技能: [
        {
            label: '使用技能=',
            detail: '使用技能',
            documentation: '使用指定技能',
        },
        {
            label: '撤退\r\n',
            detail: '撤退',
            documentation: '对战撤退',
        },
    ],
    使用道具: [
        {
            label: '使用道具=',
            detail: '使用道具',
            documentation: '使用指定道具',
        },
    ],
    战前准备: [
        {
            label: '压血\r\n',
            detail: '压血',
            documentation: '压制血量到20HP',
        },
        {
            label: '全精灵恢复\r\n',
            detail: '全精灵恢复',
            documentation: '恢复所有精灵状态',
        },
        {
            label: '领取绿火\r\n',
            detail: '领取绿火',
            documentation: '领取绿火加成',
        },
        {
            label: '领取金火\r\n',
            detail: '领取金火',
            documentation: '领取金火加成',
        },
        {
            label: '领取紫火\r\n',
            detail: '领取紫火',
            documentation: '领取紫火加成',
        },
        {
            label: '领取蓝火\r\n',
            detail: '领取蓝火',
            documentation: '领取蓝火加成',
        },
    ],
    出招循环体: [
        {
            label: '出招循环体=头部\r\n\r\n出招循环体=尾部',
            detail: '出招循环体',
            documentation: '创建出招循环体',
        },
        {
            label: '头部',
            detail: '头部',
            documentation: '出招循环体开始',
        },
        {
            label: '尾部\r\n',
            detail: '尾部',
            documentation: '出招循环体结束',
        },
    ],
    对战循环体: [
        {
            label: '对战循环体=对战胜利头部\r\n\r\n对战循环体=对战胜利尾部',
            detail: '对战循环体',
            documentation: '创建对战循环体(对战胜利)',
        },
        {
            label: '对战胜利头部',
            detail: '胜利头部',
            documentation: '对战胜利循环开始',
        },
        {
            label: '对战胜利尾部\r\n',
            detail: '胜利尾部',
            documentation: '对战胜利循环结束',
        },
        {
            label: '对战循环体=对战未触发头部\r\n\r\n对战循环体=对战未触发尾部',
            detail: '对战循环体',
            documentation: '创建对战循环体(对战未触发)',
        },
        {
            label: '对战未触发头部',
            detail: '未触发头部',
            documentation: '对战未触发循环开始',
        },
        {
            label: '对战未触发尾部\r\n',
            detail: '未触发尾部',
            documentation: '对战未触发循环结束',
        },
    ],
    判断循环体: [
        {
            label: '判断循环体=头部\r\n\r\n判断循环体=尾部',
            detail: '判断循环体',
            documentation: '创建判断循环体(不含发包参数)',
        },
        {
            label: '判断循环体=头部|\r\n\r\n判断循环体=尾部',
            detail: '判断循环体',
            documentation: '创建判断循环体(含发包参数)',
        },
        {
            label: '头部',
            detail: '头部',
            documentation: '判断循环体开始(不含发包参数)',
        },
        {
            label: '头部|',
            detail: '头部',
            documentation: '判断循环体开始(含发包参数)',
        },
        {
            label: '尾部\r\n',
            detail: '尾部',
            documentation: '判断循环体结束',
        },
        {
            label: '跳出循环',
            detail: '跳出循环',
            documentation: '跳出判断循环',
        },
        {
            label: '判断真|',
            detail: '判断真1',
            documentation: '判断真1层',
        },
        {
            label: '判断真2|',
            detail: '判断真2',
            documentation: '判断真2层',
        },
        {
            label: '判断真3|',
            detail: '判断真3',
            documentation: '判断真3层',
        },
        {
            label: '判断真4|',
            detail: '判断真4',
            documentation: '判断真4层',
        },
        {
            label: '判断真5|',
            detail: '判断真5',
            documentation: '判断真5层',
        },
        {
            label: '判断假',
            detail: '判断假',
            documentation: '判断假1层',
        },
        {
            label: '判断假2',
            detail: '判断假2',
            documentation: '判断假2层',
        },
        {
            label: '判断假3',
            detail: '判断假3',
            documentation: '判断假3层',
        },
        {
            label: '判断假4',
            detail: '判断假4',
            documentation: '判断假4层',
        },
        {
            label: '判断假5',
            detail: '判断假5',
            documentation: '判断假5层',
        },
    ],
    计次循环体: [
        {
            label: '计次循环体=头部|标识1|[j]|[i]\r\n\r\n计次循环体=尾部',
            detail: '计次循环体',
            documentation: '创建计次循环体',
        },
        {
            label: '头部|',
            detail: '计次循环体头部',
            documentation: '计次循环体开始',
        },
        {
            label: '尾部|标识1\r\n',
            detail: '计次循环体尾部',
            documentation: '计次循环体结束',
        },
    ],
    野怪操作: [
        {
            label: '野怪操作-对战=',
            detail: '野怪对战操作',
            documentation: '野怪操作-对战=地图ID|精灵ID',
        },
        {
            label: '野怪操作-捕捉=',
            detail: '野怪捕捉操作',
            documentation: '野怪操作-捕捉=地图ID|精灵ID',
        },
    ],
    变量: [
        {
            label: '变量=',
            detail: '变量',
            documentation: '创建自定义变量',
        },
        {
            label: '清空变量\r\n',
            detail: '清空变量',
            documentation: '清空所有自定义变量',
        },
    ],
    信息输出: [
        {
            label: '信息输出=',
            detail: '信息输出',
            documentation: '输出信息到界面',
        },
    ],
};

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
const DEBOUNCE_DELAY = 500; // 500ms 防抖
const pendingUsageUpdates = new Map<string, number>();

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
    context: vscode.ExtensionContext,
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
            ? `A${(1000000 - count).toString().padStart(10, '0')}`
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
