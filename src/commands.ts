import * as vscode from 'vscode';

export function registerCommands(context: vscode.ExtensionContext) {
	const helloWorldDisposable = vscode.commands.registerCommand('xm-magic-builder.helloWorld', () => {
		vscode.window.showInformationMessage('Hello World from xm-magic-builder!');
	});

	const workbenchDisposable = vscode.commands.registerCommand('xm-magic-builder.openWorkbench', () => {
		const panel = vscode.window.createWebviewPanel(
			'xm-magic-builder-workbench',
			'XM Magic Builder',
			vscode.ViewColumn.One,
			{}
		);
		panel.webview.html = getWebviewContent();
	});

	context.subscriptions.push(helloWorldDisposable, workbenchDisposable);
}

function getWebviewContent(): string {
	return `<!DOCTYPE html>
<html>
<head>
	<style>
		body { font-family: Arial, sans-serif; padding: 20px; }
		h1 { color: #333; }
		.placeholder { color: #888; font-style: italic; }
	</style>
</head>
<body>
	<h1>XM Magic Builder Workbench</h1>
	<p class="placeholder">Workbench content coming soon...</p>
</body>
</html>`;
}