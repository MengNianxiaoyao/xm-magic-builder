import * as vscode from 'vscode';

const fullwidthMap: { pattern: RegExp; replacement: string; preserveInOutput?: boolean }[] = [
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

function applyMaps(line: string, maps: { pattern: RegExp; replacement: string }[]): string {
	for (const { pattern, replacement } of maps) {
		line = line.replace(pattern, replacement);
	}
	return line;
}

function convertFullwidth(line: string, preserve: boolean): string {
	line = line.replace(/[\uff01-\uff5e]/g, (c) => {
		const ch = c.charCodeAt(0) - 0xfee0;
		if (preserve && (ch === 0x3a || ch === 0x2c)) {return c;}
		return String.fromCharCode(ch);
	});
	line = applyMaps(line, preserve ? fullwidthMap.filter(e => !e.preserveInOutput) : fullwidthMap);
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

function formatContent(content: string): string {
	const lines = content.split('\n');
	const keywords = ['魔法管理', '发包', '延时', '对战延时', '接管对战', '精灵首发', '精灵切换', '设置背包', '使用技能', '使用道具', '战前准备', '出招循环体', '对战循环体', '判断循环体', '计次循环体', '自定义出招', '野怪操作', '变量', '自定义魔法'];

	const result = lines.map(line => {
		const trimmed = line.trim();
		const isInfoOutput = trimmed.startsWith('信息输出=');
		const isKeywordLine = !isInfoOutput && trimmed !== '' && keywords.some(kw => trimmed.startsWith(kw + '='));

		line = convertFullwidth(line, isInfoOutput);

		if (isInfoOutput) {
			line = convertBracketsInInfoOutput(line);
		} else if (!isKeywordLine) {
			line = convertChineseBrackets(line);
		}

		return line;
	});

	return result.join('\n');
}

export function registerFormatter(context: vscode.ExtensionContext) {
	const provider = vscode.languages.registerDocumentFormattingEditProvider('xm', {
		provideDocumentFormattingEdits(document) {
			const text = document.getText();
			const formatted = formatContent(text);

			const fullRange = new vscode.Range(
				document.positionAt(0),
				document.positionAt(text.length)
			);

			return [vscode.TextEdit.replace(fullRange, formatted)];
		},
	});

	context.subscriptions.push(provider);
}