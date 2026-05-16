/**
 * XM 语言关键字常量定义
 * 用于格式化、补全、语法高亮等场景
 */
export const XM_KEYWORDS = {
    // ===== 核心功能 =====
    MAGIC_MANAGE: '魔法管理',
    SEND_PACKET: '发包',
    DELAY: '延时',
    BATTLE_DELAY: '对战延时',
    TAKEOVER_BATTLE: '接管对战',

    // ===== 精灵操作 =====
    POKEMON_FIRST: '精灵首发',
    POKEMON_SWITCH_ID: '精灵切换-ID',
    POKEMON_SWITCH_POS: '精灵切换-位置',
    SET_BAG: '设置背包',
    RESTORE_BAG: '还原背包',

    // ===== 对战操作 =====
    USE_SKILL: '使用技能',
    USE_ITEM: '使用道具',
    PRE_BATTLE: '战前准备',
    RETREAT: '撤退',

    // ===== 循环控制 =====
    ATTACK_LOOP: '出招循环体',
    BATTLE_LOOP: '对战循环体',
    IF_LOOP: '判断循环体',
    COUNT_LOOP: '计次循环体',
    LOOP_HEAD: '头部',
    LOOP_TAIL: '尾部',
    LOOP_BREAK: '跳出循环',

    // ===== 变量相关 =====
    VARIABLE: '变量',
    CLEAR_VAR: '清空变量',

    // ===== 其他功能 =====
    INFO_OUTPUT: '信息输出',
    CUSTOM_ATTACK: '自定义出招',
    WILD_POKEMON: '野怪操作',
    CUSTOM_MAGIC: '自定义魔法',

    // ===== 判断条件 =====
    JUDGE_TRUE: '判断真',
    JUDGE_FALSE: '判断假',

    // ===== 逻辑运算符 =====
    AND: '且',
    OR: '或',
} as const;

/**
 * 格式化器关键字列表（用于检测行类型）
 */
export const FORMAT_KEYWORDS = [
    XM_KEYWORDS.MAGIC_MANAGE,
    XM_KEYWORDS.SEND_PACKET,
    XM_KEYWORDS.DELAY,
    XM_KEYWORDS.BATTLE_DELAY,
    XM_KEYWORDS.TAKEOVER_BATTLE,
    XM_KEYWORDS.POKEMON_FIRST,
    XM_KEYWORDS.POKEMON_SWITCH_ID,
    XM_KEYWORDS.POKEMON_SWITCH_POS,
    XM_KEYWORDS.SET_BAG,
    XM_KEYWORDS.USE_SKILL,
    XM_KEYWORDS.USE_ITEM,
    XM_KEYWORDS.PRE_BATTLE,
    XM_KEYWORDS.ATTACK_LOOP,
    XM_KEYWORDS.BATTLE_LOOP,
    XM_KEYWORDS.IF_LOOP,
    XM_KEYWORDS.COUNT_LOOP,
    XM_KEYWORDS.CUSTOM_ATTACK,
    XM_KEYWORDS.WILD_POKEMON,
    XM_KEYWORDS.VARIABLE,
    XM_KEYWORDS.CUSTOM_MAGIC,
];
