import { registerSidebar } from './sidebar';
import { registerCompletionProvider } from './completion';
import { registerIndentCommand } from './indent';
import { registerFormatter } from './formatter';
import { showWelcomePanel } from './views/welcomeView';

export function activate(context: import('vscode').ExtensionContext) {
	console.log('Congratulations, your extension "xm-magic-builder" is now active!');

	registerSidebar(context);
	registerCompletionProvider(context);
	registerIndentCommand(context);
	registerFormatter(context);
	showWelcomePanel(context);
}

export function deactivate() {}