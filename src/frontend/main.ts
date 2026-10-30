import './styles.css';
import { createApp } from 'vue';
import AttackLoop from './panels/AttackLoop.vue';
import BattleLoop from './panels/BattleLoop.vue';
import BattleOperation from './panels/BattleOperation.vue';
import CompletionStats from './panels/CompletionStats.vue';
import CountLoop from './panels/CountLoop.vue';
import CustomAttack from './panels/CustomAttack.vue';
import CustomMagic from './panels/CustomMagic.vue';
import IfLoop from './panels/IfLoop.vue';
import MagicManage from './panels/MagicManage.vue';
import Output from './panels/Output.vue';
import PokemonOperation from './panels/PokemonOperation.vue';
import PokemonTraining from './panels/PokemonTraining.vue';
import SendPacket from './panels/SendPacket.vue';
import Variable from './panels/Variable.vue';
import Welcome from './panels/Welcome.vue';
import WildPokemon from './panels/WildPokemon.vue';

const VIEWS = {
    'send-packet': SendPacket,
    'pokemon-operation': PokemonOperation,
    'pokemon-training': PokemonTraining,
    'battle-operation': BattleOperation,
    'attack-loop': AttackLoop,
    'battle-loop': BattleLoop,
    'custom-attack': CustomAttack,
    'wild-pokemon': WildPokemon,
    variable: Variable,
    'if-loop': IfLoop,
    'count-loop': CountLoop,
    output: Output,
    'custom-magic': CustomMagic,
    'magic-manage': MagicManage,
    'completion-stats': CompletionStats,
    welcome: Welcome,
};

const host = document.getElementById('app');
const name = host?.dataset.panel ?? '';
const view = VIEWS[name as keyof typeof VIEWS];

if (host && view) {
    createApp(view).mount(host);
}
