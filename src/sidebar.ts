import * as vscode from 'vscode';
import { BaseView } from './views/baseView';
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

type ViewCtor = new (context: vscode.ExtensionContext) => BaseView;

const VIEW_REGISTRY: Array<{ id: string; Provider: ViewCtor }> = [
    { id: 'xm-magic-builder.send-packet', Provider: SendPacketView },
    {
        id: 'xm-magic-builder.pokemon-operation',
        Provider: PokemonOperationView,
    },
    { id: 'xm-magic-builder.battle-operation', Provider: BattleOperationView },
    { id: 'xm-magic-builder.attack-loop', Provider: AttackLoopView },
    { id: 'xm-magic-builder.battle-loop', Provider: BattleLoopView },
    { id: 'xm-magic-builder.custom-attack', Provider: CustomAttackView },
    { id: 'xm-magic-builder.wild-pokemon', Provider: WildPokemonView },
    { id: 'xm-magic-builder.variable', Provider: VariableView },
    { id: 'xm-magic-builder.if-loop', Provider: IfLoopView },
    { id: 'xm-magic-builder.count-loop', Provider: CountLoopView },
    { id: 'xm-magic-builder.output', Provider: OutputView },
    { id: 'xm-magic-builder.magic-manage', Provider: MagicManageView },
    { id: 'xm-magic-builder.custom-magic', Provider: CustomMagicView },
    { id: 'xm-magic-builder.completion-stats', Provider: CompletionStatsView },
];

export function registerSidebar(context: vscode.ExtensionContext) {
    const instances = new Map<string, BaseView>();

    for (const { id, Provider } of VIEW_REGISTRY) {
        const instance = new Provider(context);
        instances.set(id, instance);
        context.subscriptions.push(
            vscode.window.registerWebviewViewProvider(id, instance)
        );
    }

    const magicManageView = instances.get(
        'xm-magic-builder.magic-manage'
    ) as MagicManageView;
    const completionStatsView = instances.get(
        'xm-magic-builder.completion-stats'
    ) as CompletionStatsView;

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
