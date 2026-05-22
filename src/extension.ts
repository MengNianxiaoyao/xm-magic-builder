import { registerSidebar } from './panel-registry';
import { registerCompletionProvider, disposeCompletion } from './features/completion/provider';
import { registerFormatter } from './features/formatter/provider';
import { showWelcomePanel } from './features/welcome/panel';

export function activate(context: import('vscode').ExtensionContext) {
    registerSidebar(context);
    registerCompletionProvider(context);
    registerFormatter(context);
    showWelcomePanel(context);
}

export function deactivate() {
    disposeCompletion();
}
