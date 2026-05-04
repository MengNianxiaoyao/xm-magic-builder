import * as vscode from 'vscode';
import { SendPacketView, PlaceholderView } from './views';
import { DelayView } from './views/delayView';
import { TakeoverBattleView } from './views/takeoverBattleView';
import { PokemonFirstView } from './views/pokemonFirstView';
import { PokemonSwitchView } from './views/pokemonSwitchView';
import { SetBagView } from './views/setBagView';
import { UseSkillView } from './views/useSkillView';
import { UseItemView } from './views/useItemView';
import { PreBattleView } from './views/preBattleView';
import { AttackLoopView } from './views/attackLoopView';
import { BattleLoopView } from './views/battleLoopView';
import { CustomAttackView } from './views/customAttackView';
import { WildPokemonView } from './views/wildPokemonView';
import { OutputView } from './views/outputView';
import { MagicManageView } from './views/magicManageView';

export function registerSidebar(context: vscode.ExtensionContext) {
	vscode.window.registerWebviewViewProvider('xm-magic-builder.send-packet', new SendPacketView(context));
	vscode.window.registerWebviewViewProvider('xm-magic-builder.delay', new DelayView(context));
	vscode.window.registerWebviewViewProvider('xm-magic-builder.takeover-battle', new TakeoverBattleView(context));
	vscode.window.registerWebviewViewProvider('xm-magic-builder.pokemon-first', new PokemonFirstView(context));
	vscode.window.registerWebviewViewProvider('xm-magic-builder.pokemon-switch', new PokemonSwitchView(context));
	vscode.window.registerWebviewViewProvider('xm-magic-builder.set-bag', new SetBagView(context));
	vscode.window.registerWebviewViewProvider('xm-magic-builder.use-skill', new UseSkillView(context));
	vscode.window.registerWebviewViewProvider('xm-magic-builder.use-item', new UseItemView(context));
	vscode.window.registerWebviewViewProvider('xm-magic-builder.pre-battle', new PreBattleView(context));
	vscode.window.registerWebviewViewProvider('xm-magic-builder.attack-loop', new AttackLoopView(context));
	vscode.window.registerWebviewViewProvider('xm-magic-builder.battle-loop', new BattleLoopView(context));
	vscode.window.registerWebviewViewProvider('xm-magic-builder.custom-attack', new CustomAttackView(context));
	vscode.window.registerWebviewViewProvider('xm-magic-builder.wild-pokemon', new WildPokemonView(context));
	vscode.window.registerWebviewViewProvider('xm-magic-builder.variable', new PlaceholderView('变量', context));
	vscode.window.registerWebviewViewProvider('xm-magic-builder.if-loop', new PlaceholderView('判断循环体', context));
	vscode.window.registerWebviewViewProvider('xm-magic-builder.count-loop', new PlaceholderView('计次循环体', context));
	vscode.window.registerWebviewViewProvider('xm-magic-builder.output', new OutputView(context));
	vscode.window.registerWebviewViewProvider('xm-magic-builder.magic-manage', new MagicManageView(context));
	vscode.window.registerWebviewViewProvider('xm-magic-builder.custom-magic', new PlaceholderView('自定义魔法', context));
}