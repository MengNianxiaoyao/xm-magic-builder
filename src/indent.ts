import * as vscode from 'vscode';

function getLevel(line: string): number {
	const trimmed = line.trim();
	
	if (trimmed.match(/^判断循环体=头部$/)) {return 0;}
	if (trimmed.match(/^判断循环体=判断真$/)) {return 1;}
	if (trimmed.match(/^判断循环体=判断假$/)) {return 1;}
	
	const trueMatch = trimmed.match(/^判断循环体=判断真(\d+)$/);
	if (trueMatch) {
		return parseInt(trueMatch[1]);
	}
	
	const falseMatch = trimmed.match(/^判断循环体=判断假(\d+)$/);
	if (falseMatch) {
		return parseInt(falseMatch[1]);
	}
	
	if (trimmed.match(/^(出招循环体|对战循环体|计次循环体)=.+(头部)$/)) {return 0;}
	if (trimmed.match(/^(出招循环体|对战循环体|计次循环体)=.+(尾部)$/)) {return -1;}
	
	return -1;
}

export function registerIndentCommand(context: vscode.ExtensionContext) {
	const indentDisposable = vscode.commands.registerCommand('xm-magic-builder.autoIndent', () => {
		const editor = vscode.window.activeTextEditor;
		if (!editor) {return;}
		
		const document = editor.document;
		const position = editor.selection.active;
		const lineNumber = position.line;
		
		if (lineNumber === 0) {return;}
		
		const currentLine = document.lineAt(lineNumber).text;
		const currentLevel = getLevel(currentLine);
		
		const prevLineNumber = lineNumber - 1;
		const prevLine = document.lineAt(prevLineNumber).text;
		const prevLevel = getLevel(prevLine);
		
		if (prevLevel < 0) {return;}
		
		if (currentLevel >= 0 && currentLevel === prevLevel) {
			editor.edit(builder => {
				const indent = '  '.repeat(prevLevel);
				builder.replace(new vscode.Range(lineNumber, 0, lineNumber, currentLine.length), indent + currentLine.trim());
			});
			return;
		}
		
		const indent = '  '.repeat(prevLevel + 1);
		editor.edit(builder => {
			builder.replace(new vscode.Range(lineNumber, 0, lineNumber, currentLine.length), indent + currentLine.trim());
		});
	});
	
	context.subscriptions.push(indentDisposable);
}