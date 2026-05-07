import * as vscode from 'vscode';

const KEYWORD_COMPLETIONS: Record<string, string[]> = {
	'发包': [],
	'延时': ['', '1000\r\n'],
	'对战延时': ['', '5000\r\n'],
	'接管对战': [],
	'精灵首发': [],
	'精灵切换': ['精灵切换-ID=', '精灵切换-位置='],
	'设置背包': ['', '还原背包\r\n'],
	'使用技能': ['', '撤退\r\n'],
	'使用道具': [],
	'战前准备': ['压血\r\n', '全精灵恢复\r\n', '领取绿火\r\n', '领取金火\r\n', '领取紫火\r\n', '领取蓝火\r\n'],
	'出招循环体': ['出招循环体=头部\r\n\r\n出招循环体=尾部', '头部', '尾部\r\n'],
	'对战循环体': ['对战循环体=对战胜利头部\r\n\r\n对战循环体=对战胜利尾部', '对战胜利头部', '对战胜利尾部\r\n', '对战循环体=对战未触发头部\r\n\r\n对战循环体=对战未触发尾部', '对战未触发头部', '对战未触发尾部\r\n'],
	'判断循环体': ['判断循环体=头部|\r\n\r\n判断循环体=尾部', '头部|', '尾部\r\n', '跳出循环', '判断真|', '判断真2|', '判断真3|', '判断真4|', '判断真5|', '判断假', '判断假2', '判断假3', '判断假4', '判断假5'],
	'计次循环体': ['计次循环体=头部\r\n\r\n计次循环体=尾部', '头部|', '尾部\r\n'],
	'野怪操作': ['野怪操作-对战=', '野怪操作-捕捉='],
	'变量': ['', '清空变量\r\n'],
	'信息输出': [],
};

export function registerCompletionProvider(context: vscode.ExtensionContext) {
	const provider = vscode.languages.registerCompletionItemProvider('xm', {
		provideCompletionItems(document, position, token, context) {
			const line = document.lineAt(position.line).text;
			const lineUntil = line.substring(0, position.character);
			
			const eqIndex = lineUntil.lastIndexOf('=');
			const beforeEq = eqIndex !== -1 ? lineUntil.substring(0, eqIndex).trim() : '';
			
			for (const keyword of Object.keys(KEYWORD_COMPLETIONS)) {
				if (beforeEq === keyword || beforeEq.endsWith(keyword)) {
					const completions = KEYWORD_COMPLETIONS[keyword];
					if (completions.length === 0) {
						return undefined;
					}
					const items: vscode.CompletionItem[] = completions.map(c => {
						const isSubKeyword = c.includes('=');
						const insertValue = isSubKeyword ? c.split('=')[1] : c;
						const item = new vscode.CompletionItem(insertValue, isSubKeyword ? vscode.CompletionItemKind.Keyword : vscode.CompletionItemKind.Value);
						item.insertText = insertValue;
						item.range = new vscode.Range(position.line, eqIndex + 1, position.line, position.character);
						return item;
					});
					return items;
				}
			}
			
			if (eqIndex !== -1) {
				return undefined;
			}
			
			const items: vscode.CompletionItem[] = [];
			const currentInput = lineUntil.trim();
			
			if (currentInput === '') {
				for (const keyword of Object.keys(KEYWORD_COMPLETIONS)) {
					const completions = KEYWORD_COMPLETIONS[keyword];
					if (completions.length > 0) {
						completions.forEach(c => {
							const fullText = c.includes('=') ? c : `${keyword}=${c}`;
							const item = new vscode.CompletionItem(fullText, vscode.CompletionItemKind.Keyword);
							item.insertText = fullText;
							items.push(item);
						});
					} else {
						const item = new vscode.CompletionItem(keyword + '=', vscode.CompletionItemKind.Keyword);
						item.insertText = keyword + '=';
						items.push(item);
					}
				}
			} else {
				for (const keyword of Object.keys(KEYWORD_COMPLETIONS)) {
					if (keyword.includes(currentInput) || currentInput.includes(keyword)) {
						const completions = KEYWORD_COMPLETIONS[keyword];
						if (completions.length > 0) {
							completions.forEach(c => {
								const fullText = c.includes('=') ? c : `${keyword}=${c}`;
								const item = new vscode.CompletionItem(fullText, vscode.CompletionItemKind.Keyword);
								item.insertText = fullText;
								items.push(item);
							});
						} else {
							const item = new vscode.CompletionItem(keyword + '=', vscode.CompletionItemKind.Keyword);
							item.insertText = keyword + '=';
							items.push(item);
						}
					}
				}
			}
			
			return items;
		},
	}, '=', '发', '延', '对', '接', '精', '设', '使', '战', '出', '计', '自', '野', '变', '信', '魔', '判');
	
	context.subscriptions.push(provider);
}