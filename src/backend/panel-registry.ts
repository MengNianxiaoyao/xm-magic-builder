import * as vscode from 'vscode';
import type { PanelDescriptor } from './panel-types';
import { PanelHost } from './panel-host';

import { sendPacketPanel } from './panels/send-packet-panel';
import { pokemonOperationPanel } from './panels/pokemon-operation-panel';
import { pokemonTrainingPanel } from './panels/pokemon-training-panel';
import { battleOperationPanel } from './panels/battle-operation-panel';
import { attackLoopPanel } from './panels/attack-loop-panel';
import { battleLoopPanel } from './panels/battle-loop-panel';
import { customAttackPanel } from './panels/custom-attack-panel';
import { wildPokemonPanel } from './panels/wild-pokemon-panel';
import { variablePanel } from './panels/variable-panel';
import { ifLoopPanel } from './panels/if-loop-panel';
import { countLoopPanel } from './panels/count-loop-panel';
import { customMagicPanel } from './panels/custom-magic-panel';
import { outputPanel } from './panels/output-panel';
import { magicManagePanel } from './panels/magic-manage-panel';
import { completionStatsPanel } from './panels/completion-stats-panel';

const PANELS: PanelDescriptor[] = [
    sendPacketPanel,
    pokemonOperationPanel,
    pokemonTrainingPanel,
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

export function registerPanels(context: vscode.ExtensionContext) {
    const providers = new Map<string, PanelHost>();

    for (const panel of PANELS) {
        const provider = new PanelHost(context, panel);
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
