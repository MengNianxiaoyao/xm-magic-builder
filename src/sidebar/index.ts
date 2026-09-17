import * as vscode from 'vscode';
import type { PanelDescriptor } from '../shared/types';
import { GenericPanelProvider } from '../webview/provider';

import { sendPacketPanel } from './panels/battle/send-packet';
import { pokemonOperationPanel } from './panels/battle/pokemon-operation';
import { battleOperationPanel } from './panels/battle/battle-operation';
import { attackLoopPanel } from './panels/battle/attack-loop';
import { battleLoopPanel } from './panels/battle/battle-loop';
import { customAttackPanel } from './panels/battle/custom-attack';
import { wildPokemonPanel } from './panels/battle/wild-pokemon';
import { variablePanel } from './panels/data/variable';
import { ifLoopPanel } from './panels/flow/if-loop';
import { countLoopPanel } from './panels/flow/count-loop';
import { outputPanel } from './panels/data/output';
import { magicManagePanel } from './panels/magic/magic-manage';
import { customMagicPanel } from './panels/magic/custom-magic';
import { completionStatsPanel } from './panels/stats/completion-stats';

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
    customMagicPanel,
    magicManagePanel,
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
