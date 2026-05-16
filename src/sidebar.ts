import * as vscode from 'vscode';
import { SendPacketView } from './views/sendPacketView';
import { PokemonOperationView } from './views/pokemonOperationView';
import { BattleOperationView } from './views/battleOperationView';
import { AttackLoopView } from './views/attackLoopView';
import { BattleLoopView } from './views/battleLoopView';
import { CustomAttackView } from './views/customAttackView';
import { WildPokemonView } from './views/wildPokemonView';
import { OutputView } from './views/outputView';
import { MagicManageView } from './views/magicManageView';
import { VariableView } from './views/variableView';
import { IfLoopView } from './views/ifLoopView';
import { CountLoopView } from './views/countLoopView';
import { CustomMagicView } from './views/customMagicView';
import { CompletionStatsView } from './views/completionStatsView';

export function registerSidebar(context: vscode.ExtensionContext) {
    const sendPacketView = new SendPacketView(context);
    const pokemonOperationView = new PokemonOperationView(context);
    const battleOperationView = new BattleOperationView(context);
    const attackLoopView = new AttackLoopView(context);
    const battleLoopView = new BattleLoopView(context);
    const customAttackView = new CustomAttackView(context);
    const wildPokemonView = new WildPokemonView(context);
    const variableView = new VariableView(context);
    const ifLoopView = new IfLoopView(context);
    const countLoopView = new CountLoopView(context);
    const outputView = new OutputView(context);
    const magicManageView = new MagicManageView(context);
    const customMagicView = new CustomMagicView(context);
    const completionStatsView = new CompletionStatsView(context);

    vscode.window.registerWebviewViewProvider(
        'xm-magic-builder.send-packet',
        sendPacketView
    );
    vscode.window.registerWebviewViewProvider(
        'xm-magic-builder.pokemon-operation',
        pokemonOperationView
    );
    vscode.window.registerWebviewViewProvider(
        'xm-magic-builder.battle-operation',
        battleOperationView
    );
    vscode.window.registerWebviewViewProvider(
        'xm-magic-builder.attack-loop',
        attackLoopView
    );
    vscode.window.registerWebviewViewProvider(
        'xm-magic-builder.battle-loop',
        battleLoopView
    );
    vscode.window.registerWebviewViewProvider(
        'xm-magic-builder.custom-attack',
        customAttackView
    );
    vscode.window.registerWebviewViewProvider(
        'xm-magic-builder.wild-pokemon',
        wildPokemonView
    );
    vscode.window.registerWebviewViewProvider(
        'xm-magic-builder.variable',
        variableView
    );
    vscode.window.registerWebviewViewProvider(
        'xm-magic-builder.if-loop',
        ifLoopView
    );
    vscode.window.registerWebviewViewProvider(
        'xm-magic-builder.count-loop',
        countLoopView
    );
    vscode.window.registerWebviewViewProvider(
        'xm-magic-builder.output',
        outputView
    );
    vscode.window.registerWebviewViewProvider(
        'xm-magic-builder.magic-manage',
        magicManageView
    );
    vscode.window.registerWebviewViewProvider(
        'xm-magic-builder.custom-magic',
        customMagicView
    );
    vscode.window.registerWebviewViewProvider(
        'xm-magic-builder.completion-stats',
        completionStatsView
    );

    context.subscriptions.push(
        vscode.commands.registerCommand(
            'xm-magic-builder.refreshMagicManage',
            () => {
                magicManageView.refresh();
            }
        ),
        vscode.commands.registerCommand(
            'xm-magic-builder.refreshCompletionStats',
            () => {
                completionStatsView.refresh();
            }
        )
    );
}
