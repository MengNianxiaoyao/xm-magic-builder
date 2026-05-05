import * as vscode from 'vscode';

function convertFullwidth(line: string): string {
	line = line.replace(/[\uff01-\uff5e]/g, (c) => String.fromCharCode(c.charCodeAt(0) - 0xfee0));
	line = line.replace(/　/g, ' ');
	line = line.replace(/／/g, '/');
	line = line.replace(/＼/g, '\\');
	line = line.replace(/｜/g, '|');
	line = line.replace(/＋/g, '+');
	line = line.replace(/－/g, '-');
	line = line.replace(/＝/g, '=');
	line = line.replace(/＜/g, '<');
	line = line.replace(/＞/g, '>');
	line = line.replace(/（/g, '(');
	line = line.replace(/）/g, ')');
	line = line.replace(/［/g, '[');
	line = line.replace(/］/g, ']');
	line = line.replace(/｛/g, '{');
	line = line.replace(/｝/g, '}');
	line = line.replace(/￥/g, '$');
	line = line.replace(/＆/g, '&');
	line = line.replace(/＊/g, '*');
	line = line.replace(/％/g, '%');
	line = line.replace(/＃/g, '#');
	line = line.replace(/＠/g, '@');
	line = line.replace(/！/g, '!');
	line = line.replace(/？/g, '?');
	line = line.replace(/：/g, ':');
	line = line.replace(/；/g, ';');
	line = line.replace(/。/g, '.');
	line = line.replace(/，/g, ',');
	line = line.replace(/、/g, ',');
	return line;
}

function convertChineseBrackets(line: string): string {
	line = line.replace(/《/g, '<');
	line = line.replace(/》/g, '>');
	line = line.replace(/【/g, '[');
	line = line.replace(/】/g, ']');
	line = line.replace(/（/g, '(');
	line = line.replace(/）/g, ')');
	line = line.replace(/，/g, ',');
	return line;
}

function formatContent(content: string): string {
	const lines = content.split('\n');
	let inInfoOutput = false;
	
	const result = lines.map(line => {
		const trimmed = line.trim();
		
		if (trimmed.startsWith('信息输出=')) {
			inInfoOutput = true;
		}
		
		if (inInfoOutput && !trimmed.startsWith('信息输出=') && trimmed !== '') {
			for (const kw of ['魔法管理', '发包', '延时', '对战延时', '接管对战', '精灵首发', '精灵切换', '设置背包', '使用技能', '使用道具', '战前准备', '出招循环体', '对战循环体', '判断循环体', '计次循环体', '自定义出招', '野怪操作', '变量', '自定义魔法']) {
				if (trimmed.startsWith(kw + '=')) {
					inInfoOutput = false;
					break;
				}
			}
		}
		
		line = convertFullwidth(line);
		
		if (!inInfoOutput) {
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