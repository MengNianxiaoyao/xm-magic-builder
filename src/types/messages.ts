/**
 * WebView 消息类型定义
 * 用于规范 WebView 与扩展间的通信协议
 */
export interface BaseMessage {
    command: string;
    [key: string]: any;
}

// ===== 发包延时相关消息 =====
export interface AddDelayMessage extends BaseMessage {
    command: 'add-delay';
    content: string;
}

export interface AddBattleDelayMessage extends BaseMessage {
    command: 'add-battle-delay';
    content: string;
}

export interface AddPacketMessage extends BaseMessage {
    command: 'add-packet';
    content: string;
}

// ===== 变量相关消息 =====
export interface VariableClearMessage extends BaseMessage {
    command: 'variable-clear';
}

export interface VariableAddMessage extends BaseMessage {
    command: 'variable-add';
    varName: string;
    varType: 'integer' | 'string';
    varValue: string;
    customValue: string;
}

// ===== 魔法管理相关消息 =====
export interface MagicManageMessage extends BaseMessage {
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

export interface LoadMagicManageMessage extends BaseMessage {
    command: 'load-magic-manage';
}

// ===== 循环控制相关消息 =====
export interface IfLoopHeadMessage extends BaseMessage {
    command: 'if-loop-head';
    packetParam: string;
}

export interface IfLoopTailMessage extends BaseMessage {
    command: 'if-loop-tail';
}

export interface IfLoopBreakMessage extends BaseMessage {
    command: 'if-loop-break';
}

export interface CountLoopHeadMessage extends BaseMessage {
    command: 'count-loop-head';
    loopId: string;
    value: string;
    init: string;
}

export interface CountLoopTailMessage extends BaseMessage {
    command: 'count-loop-tail';
    loopId: string;
}

export interface BattleLoopHeadMessage extends BaseMessage {
    command: 'battle-loop-head';
    content: string;
}

export interface BattleLoopTailMessage extends BaseMessage {
    command: 'battle-loop-tail';
    content: string;
}

export interface AttackLoopHeadMessage extends BaseMessage {
    command: 'attack-loop-head';
    content: string;
}

export interface AttackLoopTailMessage extends BaseMessage {
    command: 'attack-loop-tail';
    content: string;
}

// ===== 其他功能消息 =====
export interface WildPokemonMessage extends BaseMessage {
    command: 'wild-pokemon';
    mapId: string;
    pokemonId: string;
    type: string;
}

export interface OutputMessage extends BaseMessage {
    command: 'output';
    content: string;
}

export interface CustomAttackAddMessage extends BaseMessage {
    command: 'custom-attack-add';
    battlePacket: string;
    fileName: string;
    fileHex: string;
}

export interface CustomMagicAddMessage extends BaseMessage {
    command: 'custom-magic-add';
    passCurrent: string;
    returnVar: string;
    password: string;
    fileName: string;
    fileHex: string;
}

export interface ShowWarningMessage extends BaseMessage {
    command: 'show-warning';
    message: string;
}

// ===== 补全统计相关消息 =====
export interface ResetMessage extends BaseMessage {
    command: 'reset';
}

export interface LoadMessage extends BaseMessage {
    command: 'load';
}

export interface RefreshMessage extends BaseMessage {
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
