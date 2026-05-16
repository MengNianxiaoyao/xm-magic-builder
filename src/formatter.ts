import * as vscode from 'vscode';
import { XM_KEYWORDS, FORMAT_KEYWORDS } from './constants/xmKeywords';

const fullwidthMap: {
    pattern: RegExp;
    replacement: string;
    preserveInOutput?: boolean;
}[] = [
    { pattern: /　/g, replacement: ' ' },
    { pattern: /／/g, replacement: '/' },
    { pattern: /＼/g, replacement: '\\' },
    { pattern: /｜/g, replacement: '|' },
    { pattern: /＋/g, replacement: '+' },
    { pattern: /－/g, replacement: '-' },
    { pattern: /＝/g, replacement: '=' },
    { pattern: /＜/g, replacement: '<' },
    { pattern: /＞/g, replacement: '>' },
    { pattern: /（/g, replacement: '(' },
    { pattern: /）/g, replacement: ')' },
    { pattern: /［/g, replacement: '[' },
    { pattern: /］/g, replacement: ']' },
    { pattern: /｛/g, replacement: '{' },
    { pattern: /｝/g, replacement: '}' },
    { pattern: /＊/g, replacement: '*' },
    { pattern: /％/g, replacement: '%' },
    { pattern: /＃/g, replacement: '#' },
    { pattern: /！/g, replacement: '!' },
    { pattern: /？/g, replacement: '?' },
    { pattern: /；/g, replacement: ';' },
    { pattern: /＇/g, replacement: "'" },
    { pattern: /。/g, replacement: '.' },
    { pattern: /【/g, replacement: '[' },
    { pattern: /】/g, replacement: ']' },
    { pattern: /，/g, replacement: ',', preserveInOutput: true },
    { pattern: /：/g, replacement: ':', preserveInOutput: true },
];

const aliasMap: { pattern: RegExp; replacement: string }[] = [
    { pattern: /forstart/g, replacement: '计次循环体=头部' },
    { pattern: /forend/g, replacement: '计次循环体=尾部' },
    { pattern: /whilestart/g, replacement: '判断循环体=头部' },
    { pattern: /whileend/g, replacement: '判断循环体=尾部' },
    { pattern: /if/g, replacement: '判断循环体=判断真' },
    { pattern: /else/g, replacement: '判断循环体=判断假' },
    { pattern: /break/g, replacement: '判断循环体=跳出循环' },
    { pattern: /and/g, replacement: '且' },
    { pattern: /or/g, replacement: '或' },
];

function applyMaps(
    line: string,
    maps: { pattern: RegExp; replacement: string }[]
): string {
    for (const { pattern, replacement } of maps) {
        line = line.replace(pattern, replacement);
    }
    return line;
}

function convertFullwidth(line: string, preserve: boolean): string {
    line = line.replace(/[\uff01-\uff5e]/g, (c) => {
        const ch = c.charCodeAt(0) - 0xfee0;
        if (preserve && (ch === 0x3a || ch === 0x2c)) {
            return c;
        }
        return String.fromCharCode(ch);
    });
    line = applyMaps(
        line,
        preserve
            ? fullwidthMap.filter((e) => !e.preserveInOutput)
            : fullwidthMap
    );
    line = applyMaps(line, aliasMap);
    return line;
}

function convertChineseBrackets(line: string): string {
    line = line.replace(/《/g, '<');
    line = line.replace(/》/g, '>');
    line = line.replace(/（/g, '(');
    line = line.replace(/）/g, ')');
    line = line.replace(/，/g, ',');
    return line;
}

function convertBracketsInInfoOutput(line: string): string {
    return line.replace(/(\{[^}]*\}|\[[^\]]*\]|#<[^>]*>#)/g, (match) => {
        return convertChineseBrackets(match);
    });
}

/**
 * 优化后的格式化函数
 * - 使用预编译正则表达式提高性能
 * - 减少字符串拼接操作
 * - 优化关键字匹配逻辑
 */
function formatContent(content: string): string {
    const lines = content.split('\n');
    const keywords = FORMAT_KEYWORDS;

    // 预编译关键字匹配函数，避免重复创建正则
    const keywordPattern = new RegExp(
        `^(${keywords.map((kw) => kw.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')}|${XM_KEYWORDS.INFO_OUTPUT})=`
    );

    const result = lines.map((line) => {
        const trimmed = line.trim();

        // 快速判断是否为信息输出
        const isInfoOutput = trimmed.startsWith(`${XM_KEYWORDS.INFO_OUTPUT}=`);

        // 使用预编译模式快速判断是否为关键字行
        const isKeywordLine =
            !isInfoOutput && trimmed !== '' && keywordPattern.test(trimmed);

        let formattedLine = line;
        formattedLine = convertFullwidth(formattedLine, isInfoOutput);

        if (isInfoOutput) {
            formattedLine = convertBracketsInInfoOutput(formattedLine);
        } else if (!isKeywordLine) {
            formattedLine = convertChineseBrackets(formattedLine);
        }

        return formattedLine;
    });

    return result.join('\n');
}

/**
 * 大文件格式化优化
 * 当文件超过一定行数时，采用分块处理策略
 */
const LARGE_FILE_THRESHOLD = 1000; // 1000 行阈值

async function formatLargeFile(
    document: vscode.TextDocument
): Promise<vscode.TextEdit[]> {
    const lineCount = document.lineCount;

    // 小文件直接处理
    if (lineCount < LARGE_FILE_THRESHOLD) {
        const text = document.getText();
        const formatted = formatContent(text);

        const fullRange = new vscode.Range(
            document.positionAt(0),
            document.positionAt(text.length)
        );

        return [vscode.TextEdit.replace(fullRange, formatted)];
    }

    // 大文件分块处理
    const edits: vscode.TextEdit[] = [];
    const chunkSize = 100; // 每批处理 100 行

    for (let startLine = 0; startLine < lineCount; startLine += chunkSize) {
        const endLine = Math.min(startLine + chunkSize, lineCount);
        const startPos = new vscode.Position(startLine, 0);
        const endPos = new vscode.Position(
            endLine,
            endLine === lineCount ? 0 : 0
        );

        const chunkLines: string[] = [];
        for (let i = startLine; i < endLine && i < lineCount; i++) {
            chunkLines.push(document.lineAt(i).text);
        }

        const chunk = chunkLines.join('\n');
        const formattedChunk = formatContent(chunk);

        const range = new vscode.Range(startPos, endPos);
        edits.push(vscode.TextEdit.replace(range, formattedChunk));
    }

    return edits;
}

export function registerFormatter(context: vscode.ExtensionContext) {
    const provider = vscode.languages.registerDocumentFormattingEditProvider(
        'xm',
        {
            async provideDocumentFormattingEdits(document) {
                // 使用优化后的格式化逻辑
                return formatLargeFile(document);
            },
        }
    );

    context.subscriptions.push(provider);
}
