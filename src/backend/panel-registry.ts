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
import { outputPanel } from './panels/output-panel';
import { magicManagePanel } from './panels/magic-manage-panel';
import { customMagicPanel } from './panels/custom-magic-panel';
import { completionStatsPanel } from './panels/completion-stats-panel';
import { gameDataPanel } from './panels/game-data-panel';

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
    gameDataPanel,
    completionStatsPanel,
];

export function registerPanels(context: vscode.ExtensionContext) {
    for (const panel of PANELS) {
        const provider = new PanelHost(context, panel);
        context.subscriptions.push(vscode.window.registerWebviewViewProvider(panel.id, provider));

        const suffix = panel.id.slice(panel.id.lastIndexOf('.') + 1);
        context.subscriptions.push(
            vscode.commands.registerCommand(`xm-magic-builder.refresh.${suffix}`, () => provider.runTitleAction())
        );
    }
}
