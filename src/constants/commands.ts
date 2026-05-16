/**
 * WebView 消息命令常量定义
 * 用于统一所有 WebView 与扩展间的通信命令
 */
export const COMMANDS = {
    // ===== 发包延时相关 =====
    ADD_DELAY: 'add-delay',
    ADD_BATTLE_DELAY: 'add-battle-delay',
    ADD_PACKET: 'add-packet',

    // ===== 变量相关 =====
    VARIABLE_CLEAR: 'variable-clear',
    VARIABLE_ADD: 'variable-add',

    // ===== 魔法管理相关 =====
    MAGIC_MANAGE: 'magic-manage',
    LOAD_MAGIC_MANAGE: 'load-magic-manage',

    // ===== 循环控制相关 =====
    IF_LOOP_HEAD: 'if-loop-head',
    IF_LOOP_TAIL: 'if-loop-tail',
    IF_LOOP_BREAK: 'if-loop-break',
    COUNT_LOOP_HEAD: 'count-loop-head',
    COUNT_LOOP_TAIL: 'count-loop-tail',
    BATTLE_LOOP_HEAD: 'battle-loop-head',
    BATTLE_LOOP_TAIL: 'battle-loop-tail',
    ATTACK_LOOP_HEAD: 'attack-loop-head',
    ATTACK_LOOP_TAIL: 'attack-loop-tail',

    // ===== 其他功能 =====
    WILD_POKEMON: 'wild-pokemon',
    OUTPUT: 'output',
    CUSTOM_ATTACK_ADD: 'custom-attack-add',
    CUSTOM_MAGIC_ADD: 'custom-magic-add',
    SHOW_WARNING: 'show-warning',
    RESET: 'reset',
    LOAD: 'load',
    REFRESH: 'refresh',
} as const;

export type CommandKey = keyof typeof COMMANDS;
