import * as vscode from 'vscode';
import { SendPacketView } from './views/sendPacket';
import { DelayView } from './views/delayView';
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

export function registerSidebar(context: vscode.ExtensionContext) {
	vscode.window.registerWebviewViewProvider('xm-magic-builder.send-packet', new SendPacketView(context));
	vscode.window.registerWebviewViewProvider('xm-magic-builder.delay', new DelayView(context));
	vscode.window.registerWebviewViewProvider('xm-magic-builder.pokemon-operation', new PokemonOperationView(context));
	vscode.window.registerWebviewViewProvider('xm-magic-builder.battle-operation', new BattleOperationView(context));
	vscode.window.registerWebviewViewProvider('xm-magic-builder.attack-loop', new AttackLoopView(context));
	vscode.window.registerWebviewViewProvider('xm-magic-builder.battle-loop', new BattleLoopView(context));
	vscode.window.registerWebviewViewProvider('xm-magic-builder.custom-attack', new CustomAttackView(context));
	vscode.window.registerWebviewViewProvider('xm-magic-builder.wild-pokemon', new WildPokemonView(context));
	vscode.window.registerWebviewViewProvider('xm-magic-builder.variable', new VariableView(context));
	vscode.window.registerWebviewViewProvider('xm-magic-builder.if-loop', new IfLoopView(context));
	vscode.window.registerWebviewViewProvider('xm-magic-builder.count-loop', new CountLoopView(context));
	vscode.window.registerWebviewViewProvider('xm-magic-builder.output', new OutputView(context));
	vscode.window.registerWebviewViewProvider('xm-magic-builder.magic-manage', new MagicManageView(context));
	vscode.window.registerWebviewViewProvider('xm-magic-builder.custom-magic', new CustomMagicView(context));
}