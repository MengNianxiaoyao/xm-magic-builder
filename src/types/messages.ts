/**
 * WebView 消息类型定义
 * 用于规范 WebView 与扩展间的通信协议
 */

// ===== 发包延时相关消息 =====
export interface AddDelayMessage {
    command: 'add-delay';
    content: string;
}

export interface AddBattleDelayMessage {
    command: 'add-battle-delay';
    content: string;
}

export interface AddPacketMessage {
    command: 'add-packet';
    content: string;
}

// ===== 变量相关消息 =====
export interface VariableClearMessage {
    command: 'variable-clear';
}

export interface VariableAddMessage {
    command: 'variable-add';
    varName: string;
    varType: 'integer' | 'string';
    varValue: string;
    customValue: string;
}

// ===== 魔法管理相关消息 =====
export interface MagicManageMessage {
    command: 'magic-manage';
    portLimit: string;
    versionMajor: string;
    versionMinor: string;
    apiParam: string;
    versionCheck1: string;
    versionCheck2: string;
    blacklist: string;
    appid: string;
    sponsorDays: string;
}

export interface LoadMagicManageMessage {
    command: 'load-magic-manage';
}

// ===== 精灵操作相关消息 =====
export interface PokemonFirstMessage {
    command: '精灵首发';
    content: string;
}

export interface PokemonSwitchIdMessage {
    command: '精灵切换-ID';
    content: string;
}

export interface PokemonSwitchPosMessage {
    command: '精灵切换-位置';
    content: string;
}

export interface PokemonSetBagMessage {
    command: '设置背包';
    content: string;
}

// ===== 对战操作相关消息 =====
export interface BattleTakeoverMessage {
    command: '接管对战';
    content: string;
}

export interface BattleSkillMessage {
    command: '使用技能';
    content: string;
}

export interface BattleItemMessage {
    command: '使用道具';
    content: string;
}

export interface BattlePreBattleMessage {
    command: '战前准备';
    content: string;
}

// ===== 循环控制相关消息 =====
export interface IfLoopHeadMessage {
    command: 'if-loop-head';
    content: string;
}

export interface IfLoopTailMessage {
    command: 'if-loop-tail';
}

export interface IfLoopBreakMessage {
    command: 'if-loop-break';
}

export interface CountLoopHeadMessage {
    command: 'count-loop-head';
    loopId: string;
    value: string;
    init: string;
}

export interface CountLoopTailMessage {
    command: 'count-loop-tail';
    loopId: string;
}

export interface BattleLoopHeadMessage {
    command: 'battle-loop-head';
    content: string;
}

export interface BattleLoopTailMessage {
    command: 'battle-loop-tail';
    content: string;
}

export interface AttackLoopHeadMessage {
    command: 'attack-loop-head';
    content: string;
}

export interface AttackLoopTailMessage {
    command: 'attack-loop-tail';
    content: string;
}

// ===== 其他功能消息 =====
export interface WildPokemonMessage {
    command: 'wild-pokemon';
    mapId: string;
    pokemonId: string;
    type: string;
}

export interface OutputMessage {
    command: 'output';
    content: string;
}

export interface CustomAttackAddMessage {
    command: 'custom-attack-add';
    battlePacket: string;
    fileName: string;
    fileHex: string;
}

export interface CustomMagicAddMessage {
    command: 'custom-magic-add';
    passCurrent: string;
    returnVar: string;
    password: string;
    fileName: string;
    fileHex: string;
}

export interface ShowWarningMessage {
    command: 'show-warning';
    message: string;
}

// ===== 补全统计相关消息 =====
export interface ResetMessage {
    command: 'reset';
}

export interface LoadMessage {
    command: 'load';
}

export interface RefreshMessage {
    command: 'refresh';
}

/**
 * 所有 WebView 消息类型联合
 */
export type ViewMessage =
    | AddDelayMessage
    | AddBattleDelayMessage
    | AddPacketMessage
    | VariableClearMessage
    | VariableAddMessage
    | MagicManageMessage
    | LoadMagicManageMessage
    | PokemonFirstMessage
    | PokemonSwitchIdMessage
    | PokemonSwitchPosMessage
    | PokemonSetBagMessage
    | BattleTakeoverMessage
    | BattleSkillMessage
    | BattleItemMessage
    | BattlePreBattleMessage
    | IfLoopHeadMessage
    | IfLoopTailMessage
    | IfLoopBreakMessage
    | CountLoopHeadMessage
    | CountLoopTailMessage
    | BattleLoopHeadMessage
    | BattleLoopTailMessage
    | AttackLoopHeadMessage
    | AttackLoopTailMessage
    | WildPokemonMessage
    | OutputMessage
    | CustomAttackAddMessage
    | CustomMagicAddMessage
    | ShowWarningMessage
    | ResetMessage
    | LoadMessage
    | RefreshMessage;

/**
 * 命令键值映射（用于类型推导）
 */
export interface CommandMap {
    'add-delay': AddDelayMessage;
    'add-battle-delay': AddBattleDelayMessage;
    'add-packet': AddPacketMessage;
    'variable-clear': VariableClearMessage;
    'variable-add': VariableAddMessage;
    'magic-manage': MagicManageMessage;
    'load-magic-manage': LoadMagicManageMessage;
    '精灵首发': PokemonFirstMessage;
    '精灵切换-ID': PokemonSwitchIdMessage;
    '精灵切换-位置': PokemonSwitchPosMessage;
    '设置背包': PokemonSetBagMessage;
    '接管对战': BattleTakeoverMessage;
    '使用技能': BattleSkillMessage;
    '使用道具': BattleItemMessage;
    '战前准备': BattlePreBattleMessage;
    'if-loop-head': IfLoopHeadMessage;
    'if-loop-tail': IfLoopTailMessage;
    'if-loop-break': IfLoopBreakMessage;
    'count-loop-head': CountLoopHeadMessage;
    'count-loop-tail': CountLoopTailMessage;
    'battle-loop-head': BattleLoopHeadMessage;
    'battle-loop-tail': BattleLoopTailMessage;
    'attack-loop-head': AttackLoopHeadMessage;
    'attack-loop-tail': AttackLoopTailMessage;
    'wild-pokemon': WildPokemonMessage;
    output: OutputMessage;
    'custom-attack-add': CustomAttackAddMessage;
    'custom-magic-add': CustomMagicAddMessage;
    'show-warning': ShowWarningMessage;
    reset: ResetMessage;
    load: LoadMessage;
    refresh: RefreshMessage;
}
