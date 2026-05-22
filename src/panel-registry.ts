import * as vscode from 'vscode';
import type { PanelDescriptor } from './shared/types';
import { GenericPanelProvider } from './core/panel-provider';

import { sendPacketPanel } from './panels/send-packet';
import { pokemonOperationPanel } from './panels/pokemon-operation';
import { battleOperationPanel } from './panels/battle-operation';
import { attackLoopPanel } from './panels/attack-loop';
import { battleLoopPanel } from './panels/battle-loop';
import { customAttackPanel } from './panels/custom-attack';
import { wildPokemonPanel } from './panels/wild-pokemon';
import { variablePanel } from './panels/variable';
import { ifLoopPanel } from './panels/if-loop';
import { countLoopPanel } from './panels/count-loop';
import { outputPanel } from './panels/output';
import { magicManagePanel } from './panels/magic-manage';
import { customMagicPanel } from './panels/custom-magic';
import { completionStatsPanel } from './panels/completion-stats';

const PANELS: PanelDescriptor[] = [
    sendPacketPanel,
    pokemonOperationPanel,
    battleOperationPanel,
    attackLoopPanel,
    battleLoopPanel,
    customAttackPanel,
    wildPokemonPanel,
    variablePanel,
    ifLoopPanel,
    countLoopPanel,
    outputPanel,
    magicManagePanel,
    customMagicPanel,
    completionStatsPanel,
];

export function registerSidebar(context: vscode.ExtensionContext) {
    const providers = new Map<string, GenericPanelProvider>();

    for (const panel of PANELS) {
        const provider = new GenericPanelProvider(context, panel);
        providers.set(panel.id, provider);
        context.subscriptions.push(vscode.window.registerWebviewViewProvider(panel.id, provider));
    }

    const magicManageProvider = providers.get('xm-magic-builder.magic-manage')!;
    const completionStatsProvider = providers.get('xm-magic-builder.completion-stats')!;

    context.subscriptions.push(
        vscode.commands.registerCommand('xm-magic-builder.refreshMagicManage', () => {
            magicManageProvider.refresh();
        }),
        vscode.commands.registerCommand('xm-magic-builder.refreshCompletionStats', () => {
            completionStatsProvider.refresh();
        })
    );
}
