import { registerCommands } from './commands';
import { registerSidebar } from './sidebar';

export function activate(context: import('vscode').ExtensionContext) {
	console.log('Congratulations, your extension "xm-magic-builder" is now active!');

	registerCommands(context);
	registerSidebar(context);
}

export function deactivate() {}