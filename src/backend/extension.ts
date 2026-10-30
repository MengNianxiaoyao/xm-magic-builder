import { registerPanels } from './panel-registry';
import { registerCompletionProvider, disposeCompletion } from './language/completion';
import { registerFormatter } from './language/formatter';
import { showWelcomePanel } from './welcome-panel';

export function activate(context: import('vscode').ExtensionContext) {
    registerPanels(context);
    registerCompletionProvider(context);
    registerFormatter(context);
    showWelcomePanel(context);
}

export function deactivate() {
    disposeCompletion();
}
