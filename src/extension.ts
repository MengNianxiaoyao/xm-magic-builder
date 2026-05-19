import { registerSidebar } from './sidebar';
import { registerCompletionProvider, disposeCompletion } from './completion';
import { registerFormatter } from './formatter';
import { showWelcomePanel } from './views/welcomeView';

export function activate(context: import('vscode').ExtensionContext) {
    registerSidebar(context);
    registerCompletionProvider(context);
    registerFormatter(context);
    showWelcomePanel(context);
}

export function deactivate() {
    disposeCompletion();
}
