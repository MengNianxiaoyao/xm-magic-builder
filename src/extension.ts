import { registerSidebar } from './sidebar';
import { registerCompletionProvider } from './completion';
import { registerFormatter } from './formatter';
import { showWelcomePanel } from './views/welcomeView';

export function activate(context: import('vscode').ExtensionContext) {
	console.log('Congratulations, your extension "xm-magic-builder" is now active!');

	registerSidebar(context);
	registerCompletionProvider(context);
	registerFormatter(context);
	showWelcomePanel(context);
}

export function deactivate() { }