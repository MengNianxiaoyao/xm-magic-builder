import * as vscode from 'vscode';

/**
 * XM 脚本按行编写：`关键字=内容`。
 * 格式化只统一书写符号和字段分隔符，不改动命令语义，也不翻译任何内容。
 */

/** 全角符号区间之外，需要单独换算的全角符号。 */
const EXTRA_FULLWIDTH: Record<string, string> = {
    '　': ' ',
    '【': '[',
    '】': ']',
    '《': '<',
    '》': '>',
};

/** 全角符号区间的码位换算量：！(U+FF01) ~ ～(U+FF5E) 减去它即为对应半角。 */
const FULLWIDTH_OFFSET = 0xfee0;

/** 全角字符的正则字符类：全角符号区间 + 上表中单独列出的符号。 */
const FULLWIDTH_CLASS = `[！-～${Object.keys(EXTRA_FULLWIDTH).join('')}]`;
const FULLWIDTH_TEST = new RegExp(FULLWIDTH_CLASS);
const FULLWIDTH_GLOBAL = new RegExp(FULLWIDTH_CLASS, 'g');

/**
 * 全角转半角。先做一次原生正则探测，没有可转换字符时直接复用原串，
 * 这样大段十六进制数据不会产生逐字符拷贝。
 */
function toHalfwidth(text: string): string {
    if (!FULLWIDTH_TEST.test(text)) {
        return text;
    }
    return text.replace(FULLWIDTH_GLOBAL, (char) => {
        return EXTRA_FULLWIDTH[char] ?? String.fromCharCode(char.charCodeAt(0) - FULLWIDTH_OFFSET);
    });
}

/** 信息输出 的内容是原样文本，只把 {...}、[...]、#<...># 占位符换成半角。 */
const OUTPUT_TOKEN = /\{[^{}]*\}|\[[^[\]]*\]|#<[^>]*>#/g;

function formatOutputText(value: string): string {
    return value.replace(OUTPUT_TOKEN, (token) => toHalfwidth(token));
}

/** 把 {a, b} 列表内部的空格去掉，元素内容不变。 */
function compactLists(text: string): string {
    return text.replace(/\{([^{}]*)\}/g, (_, inner: string) => {
        return `{${inner
            .split(',')
            .map((item) => item.trim())
            .join(',')}}`;
    });
}

/** 按顶层 | 拆分；{} 内部的 | 属于字段内容，不参与拆分。 */
function splitFields(value: string): string[] {
    const fields: string[] = [];
    let depth = 0;
    let start = 0;
    for (let i = 0; i < value.length; i++) {
        const char = value[i];
        if (char === '{') {
            depth++;
        } else if (char === '}') {
            depth--;
        } else if (char === '|' && depth === 0) {
            fields.push(value.slice(start, i));
            start = i + 1;
        }
    }
    fields.push(value.slice(start));
    return fields;
}

/** 普通 | 分隔字段：去掉两侧空白和行尾空字段，保留中间空字段（如自定义魔法 的空密码）。 */
function formatPipeFields(value: string): string {
    const fields = splitFields(value).map((field) => compactLists(field.trim()));
    while (fields.length > 0 && fields[fields.length - 1] === '') {
        fields.pop();
    }
    return fields.join('|');
}

/** 判断循环体：且/或 是独立字段，补上两侧的 |；该行不存在合法的空字段。 */
function formatCondition(value: string): string {
    const trimmed = value.trim();
    // 头部带参数时以 | 结尾，脚本按此识别参数段，行尾的 | 必须保留。
    const keepTrailingPipe = trimmed.startsWith('头部') && trimmed.endsWith('|');
    const withSeparators = trimmed.replace(/且/g, '|且|').replace(/或/g, '|或|');
    const formatted = splitFields(withSeparators)
        .map((field) => compactLists(field.trim()))
        .filter((field) => field !== '')
        .join('|');

    if (formatted === '') {
        return formatted;
    }
    return keepTrailingPipe ? `${formatted}|` : formatted;
}

/** 花括号内的 k=v 字段：精灵培养、魔法管理。字段顺序与是否写出由内容决定，这里不增删。 */
function formatNestedFields(value: string): string {
    const trimmed = value.trim();
    const inner = trimmed.startsWith('{') && trimmed.endsWith('}') ? trimmed.slice(1, -1) : trimmed;
    const fields = splitFields(inner)
        .map((field) => field.trim())
        .filter((field) => field !== '')
        .map((field) => {
            const separator = field.indexOf('=');
            if (separator === -1) {
                return compactLists(field);
            }
            const key = field.slice(0, separator).trim();
            const fieldValue = compactLists(field.slice(separator + 1).trim());
            return `${key}=${fieldValue}`;
        });

    return fields.length > 0 ? `{${fields.join('|')}}` : trimmed;
}

/** 十六进制数据只去掉两侧空白；全角转换在进入这里之前已经整行完成。 */
function hexData(value: string, separator: number): string {
    return value.slice(separator + 1).trim();
}

/** 最后一段是十六进制数据（.xmcus / .xmgic 内容）：前缀按字段整理，数据整段跳过拆分。 */
function formatFileCommand(value: string): string {
    const separator = value.lastIndexOf('|');
    if (separator === -1) {
        return formatPipeFields(value);
    }
    const prefix = formatPipeFields(value.slice(0, separator));
    const data = hexData(value, separator);
    return data === '' ? prefix : `${prefix}|${data}`;
}

/** 变量 的第四段在变量值为“自定义文本”时是十六进制数据，同样整段跳过字段拆分。 */
function formatVariable(value: string): string {
    const fields = value.split('|', 4);
    if (fields.length < 4 || fields[2].trim() !== '自定义文本') {
        return formatPipeFields(value);
    }
    const separator = value.lastIndexOf('|');
    const prefix = formatPipeFields(value.slice(0, separator));
    const data = hexData(value, separator);
    return data === '' ? prefix : `${prefix}|${data}`;
}

type ValueFormatter = (value: string) => string;

/** 各命令内容的书写规则；内容已转为半角，未列出的命令直接去空白。 */
const CONTENT_FORMATTERS: Record<string, ValueFormatter> = {
    精灵培养: formatNestedFields,
    魔法管理: formatNestedFields,
    变量: formatVariable,
    设置背包: formatPipeFields,
    自定义出招: formatFileCommand,
    自定义魔法: formatFileCommand,
    '野怪操作-对战': formatPipeFields,
    '野怪操作-捕捉': formatPipeFields,
    计次循环体: formatPipeFields,
    判断循环体: formatCondition,
};

/** 行首关键字 + 第一个 =（半角或全角）之后的内容。 */
const LINE_PATTERN = /^([^=＝]*)[=＝]([\s\S]*)$/;

function formatLine(line: string): string {
    const matched = line.match(LINE_PATTERN);
    if (!matched) {
        return line;
    }

    const indent = matched[1].match(/^\s*/)?.[0] ?? '';
    const keyword = toHalfwidth(matched[1].trim());
    const rawValue = matched[2];

    if (keyword === '信息输出') {
        return `${indent}${keyword}=${formatOutputText(rawValue)}`;
    }

    const value = toHalfwidth(rawValue);
    const formatter = CONTENT_FORMATTERS[keyword];
    const formatted = formatter ? formatter(value) : value.trim();

    return `${indent}${keyword}=${formatted}`;
}

function formatContent(content: string): string {
    const eol = content.includes('\r\n') ? '\r\n' : '\n';
    return content
        .split(/\r?\n/)
        .map((line) => formatLine(line))
        .join(eol);
}

export function registerFormatter(context: vscode.ExtensionContext) {
    const provider = vscode.languages.registerDocumentFormattingEditProvider('xm', {
        provideDocumentFormattingEdits(document) {
            const text = document.getText();
            const formatted = formatContent(text);

            const fullRange = new vscode.Range(document.positionAt(0), document.positionAt(text.length));

            return [vscode.TextEdit.replace(fullRange, formatted)];
        },
    });

    context.subscriptions.push(provider);
}
