import { registerSidebar } from './sidebar';
import { registerCompletionProvider, disposeCompletion } from './xm/completion/provider';
import { registerFormatter } from './xm/formatter/provider';
import { showWelcomePanel } from './ui/welcome';

export function activate(context: import('vscode').ExtensionContext) {
    registerSidebar(context);
    registerCompletionProvider(context);
    registerFormatter(context);
    showWelcomePanel(context);
}

export function deactivate() {
    disposeCompletion();
}
