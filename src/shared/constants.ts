export interface VarValueEntry {
    value: string;
    label: string;
    description: string;
}

export const INTEGER_VAR_VALUES: VarValueEntry[] = [
    {
        value: '自定义值',
        label: '自定义值',
        description:
            '说明：自定义值可以是数值，也可以是“参数”，还可以是“变量”。使用“#<>#”标识符还可进行简单运算，结果向下取整。',
    },
    {
        value: '向上取整',
        label: '向上取整',
        description: '说明：如果是小数，则向上取整。',
    },
    {
        value: '道具数量返回',
        label: '道具数量返回',
        description: '说明：返回指定道具ID的数量。',
    },
    {
        value: '精灵数量返回1',
        label: '精灵数量返回1',
        description: '说明：查询指定精灵ID的数量（包括处于特殊状态的精灵）。',
    },
    {
        value: '精灵数量返回2',
        label: '精灵数量返回2',
        description: '说明：查询指定精灵ID的数量（不包括处于特殊状态的精灵）。',
    },
    {
        value: '背包精灵catchtime返回',
        label: '背包精灵catchtime返回',
        description: '说明：查询当前背包精灵ID的catchtime，若当前背包没有该精灵返回0。',
    },
    {
        value: '背包精灵catchtime返回2',
        label: '背包精灵catchtime返回2',
        description: '说明：查询当前背包精灵位置的catchtime，出招背包1~6，待命背包7~12，若当前背包没有该精灵返回0。',
    },
    {
        value: '精灵第五状态返回',
        label: '精灵第五状态返回',
        description: '说明：查询指定精灵catchtime的第五技能ID，若该精灵没有第五技能返回。',
    },
    {
        value: '精灵魂印状态返回',
        label: '精灵魂印状态返回',
        description: '说明：查询指定精灵catchtime的魂印ID，若该精灵没有魂印返回0。',
    },
    {
        value: '精灵特性状态返回',
        label: '精灵特性状态返回',
        description: '说明：查询指定精灵catchtime的特性ID（例如精神的eid为65则返回65），若该精灵没有特性返回0。',
    },
    {
        value: '精灵属性查询返回',
        label: '精灵属性查询返回',
        description: '说明：在大括号内填写要查询的精灵的catchtime和要查询的属性序号，会返回对应的属性数值。例如{ct,21}返回精灵PVE体力数值。属性序号：基础10/PVE20/PVP30+体力1/攻击2/防御3/特攻4/特防5/速度6。',
    },
    {
        value: '用户当前超NO状态返回',
        label: '用户当前超NO状态返回',
        description: '说明：用户当前为超能NONO（包含年费）返回1，否则返回0。',
    },
    {
        value: '用户当前年费状态返回',
        label: '用户当前年费状态返回',
        description: '说明：用户当前为年费NONO返回1，否则返回0。',
    },
    {
        value: '用户当前火焰状态返回',
        label: '用户当前火焰状态返回',
        description: '说明：有火返回对应火焰序号，没火返回0。绿火6、蓝火7、紫火8、金火9。',
    },
    {
        value: '现行10位时间戳',
        label: '现行10位时间戳',
        description: '说明：当前电脑系统时间的10位时间戳',
    },
    {
        value: '当前星期几',
        label: '当前星期几',
        description: '说明：当前星期几，数值1~7。',
    },
    {
        value: '当前年份',
        label: '当前年份',
        description: '说明：获取当前年份，例如当前是2025年则返回2025。',
    },
    {
        value: '当前月份',
        label: '当前月份',
        description: '说明：获取当前月份，数值1~12。',
    },
    {
        value: '当前日',
        label: '当前日',
        description: '说明：获取当前日期，数值1~31。',
    },
    {
        value: '当前小时',
        label: '当前小时',
        description: '说明：获取当前小时，数值0~23。',
    },
    {
        value: '当前分钟',
        label: '当前分钟',
        description: '说明：获取当前分钟，数值0~59。',
    },
    {
        value: '当前秒数',
        label: '当前秒数',
        description: '说明：获取当前秒，数值0~59。',
    },
    {
        value: '时间戳取年份',
        label: '时间戳取年份',
        description: '说明：返回填写的时间戳对应的年份。',
    },
    {
        value: '时间戳取月份',
        label: '时间戳取月份',
        description: '说明：返回填写的时间戳对应的月份。',
    },
    {
        value: '时间戳取日',
        label: '时间戳取日',
        description: '说明：返回填写的时间戳对应的日期。',
    },
    {
        value: '时间戳取小时',
        label: '时间戳取小时',
        description: '说明：返回填写的时间戳对应的小时。',
    },
    {
        value: '时间戳取分钟',
        label: '时间戳取分钟',
        description: '说明：返回填写的时间戳对应的分钟。',
    },
    {
        value: '时间戳取秒数',
        label: '时间戳取秒数',
        description: '说明：返回填写的时间戳对应的秒数。',
    },
];

export const STRING_VAR_VALUES: VarValueEntry[] = [
    {
        value: '自定义文本',
        label: '自定义文本',
        description: '说明：与“信息输出”语句的处理相同，换行用\\r\\n代替。',
    },
    {
        value: '游戏收包主体文本返回',
        label: '游戏收包主体文本返回',
        description: '说明：填写要返回收包的发包文本/包字节集，会发送该包并返回收包的包体即主体参数部分的文本。',
    },
    {
        value: '现行时间',
        label: '现行时间',
        description: '说明：当前电脑系统时间格式化文本。',
    },
    {
        value: '时间戳转文本',
        label: '时间戳转文本',
        description: '说明：将10位时间戳格式化并返回文本。',
    },
];

export const NO_CUSTOM_VAR_TYPES: string[] = [
    '用户当前超NO状态返回',
    '用户当前年费状态返回',
    '用户当前火焰状态返回',
    '现行10位时间戳',
    '当前星期几',
    '当前年份',
    '当前月份',
    '当前日',
    '当前小时',
    '当前分钟',
    '当前秒数',
    '现行时间',
];
