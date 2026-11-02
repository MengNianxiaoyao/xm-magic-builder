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
            '自定义值可以是数值，也可以是“参数”，例如 {1,十六进制,1,1}，还可以是“变量”，例如 [变量名称]。使用“#<>#”标识符还可对标识符中的内容进行简单的表达式运算，最终结果若为小数会向下取整。',
    },
    {
        value: '向上取整',
        label: '向上取整',
        description: '如果是小数，最终赋值时会向上取整，其余与自定义值相同。',
    },
    {
        value: '道具数量返回',
        label: '道具数量返回',
        description: '填写要查询道具的ID，会返回当前拥有的对应ID的道具数量并赋值给该变量。该语句赋值默认有0.1秒延迟。',
    },
    {
        value: '精灵数量返回1',
        label: '精灵数量返回1',
        description:
            '填写要查询精灵的ID，会返回当前背包以及仓库中已拥有的对应ID的精灵数量并赋值给该变量（包括处于特殊状态的精灵，例如战队派遣中的精灵也会计算）。该语句赋值默认有0.5秒延迟。',
    },
    {
        value: '精灵数量返回2',
        label: '精灵数量返回2',
        description:
            '填写要查询精灵的ID，会返回当前背包以及仓库中可出战的对应ID的精灵数量并赋值给该变量（只计算处于背包、仓库、精英仓库中的可用于出战的精灵）。该语句赋值默认有0.5秒延迟。',
    },
    {
        value: '背包精灵catchtime返回',
        label: '背包精灵catchtime返回',
        description:
            '填写要查询精灵的ID，会返回当前背包中对应ID精灵的catchtime；若当前背包没有该精灵返回0。该语句赋值默认有0.5秒延迟。',
    },
    {
        value: '背包精灵catchtime返回2',
        label: '背包精灵catchtime返回2',
        description:
            '填写要查询精灵当前在背包中的位置：出战背包1~6，待命背包7~12。会返回当前背包中对应位置精灵的catchtime；若该位置没有精灵则返回0。该语句赋值默认有0.5秒延迟。',
    },
    {
        value: '精灵第五状态返回',
        label: '精灵第五状态返回',
        description:
            '填写要查询精灵的catchtime，会返回该精灵的第五技能ID；若该精灵没有第五技能则返回0。该语句赋值默认有0.5秒延迟。',
    },
    {
        value: '精灵魂印状态返回',
        label: '精灵魂印状态返回',
        description:
            '填写要查询精灵的catchtime，会返回该精灵的魂印ID；若该精灵没有魂印则返回0。该语句赋值默认有0.5秒延迟。',
    },
    {
        value: '精灵特性状态返回',
        label: '精灵特性状态返回',
        description:
            '填写要查询精灵的catchtime，会返回该精灵的特性ID（例如精神的eid为65则返回65）；若该精灵没有特性则返回0。该语句赋值默认有0.5秒延迟。',
    },
    {
        value: '精灵属性查询返回',
        label: '精灵属性查询返回',
        description:
            '在大括号内分别填写要查询精灵的catchtime和属性序号，会返回该精灵对应的属性数值。属性序号：基础10/PVE20/PVP30 + 体力1/攻击2/防御3/特攻4/特防5/速度6。例如 {ct,21} 就是查询某精灵的PVE体力数值。该语句赋值默认有0.5秒延迟。',
    },
    {
        value: '用户当前超NO状态返回',
        label: '用户当前超NO状态返回',
        description: '用户当前为超能NONO（包括年费）返回1，不为超能NONO返回0。该语句赋值默认有0.5秒延迟。',
    },
    {
        value: '用户当前年费状态返回',
        label: '用户当前年费状态返回',
        description: '用户当前为年费NONO返回1，不为年费NONO返回0。该语句赋值默认有0.5秒延迟。',
    },
    {
        value: '用户当前火焰状态返回',
        label: '用户当前火焰状态返回',
        description:
            '有火则返回对应火焰序号，没火返回0。返回6绿火、7蓝火、8紫火、9金火。该语句赋值默认有0.5秒延迟。',
    },
    {
        value: '现行10位时间戳',
        label: '现行10位时间戳',
        description: '当前电脑系统时间的10位时间戳。',
    },
    {
        value: '当前星期几',
        label: '当前星期几',
        description: '获取当前星期几，数值1~7。例如周一返回1，周六返回6，周日返回7。',
    },
    {
        value: '当前年份',
        label: '当前年份',
        description: '获取当前年份，例如当前是2025年则返回2025，2026年则返回2026。',
    },
    {
        value: '当前月份',
        label: '当前月份',
        description: '获取当前月份，数值1~12。',
    },
    {
        value: '当前日',
        label: '当前日',
        description: '获取当前日期，数值1~31。',
    },
    {
        value: '当前小时',
        label: '当前小时',
        description: '获取当前小时，数值0~23。',
    },
    {
        value: '当前分钟',
        label: '当前分钟',
        description: '获取当前分钟，数值0~59。',
    },
    {
        value: '当前秒数',
        label: '当前秒数',
        description: '获取当前秒，数值0~59。',
    },
    {
        value: '时间戳取年份',
        label: '时间戳取年份',
        description: '填写一个10位时间戳，会返回该时间戳对应的年份。',
    },
    {
        value: '时间戳取月份',
        label: '时间戳取月份',
        description: '填写一个10位时间戳，会返回该时间戳对应的月份。',
    },
    {
        value: '时间戳取日',
        label: '时间戳取日',
        description: '填写一个10位时间戳，会返回该时间戳对应的日。',
    },
    {
        value: '时间戳取小时',
        label: '时间戳取小时',
        description: '填写一个10位时间戳，会返回该时间戳对应的小时。',
    },
    {
        value: '时间戳取分钟',
        label: '时间戳取分钟',
        description: '填写一个10位时间戳，会返回该时间戳对应的分钟。',
    },
    {
        value: '时间戳取秒数',
        label: '时间戳取秒数',
        description: '填写一个10位时间戳，会返回该时间戳对应的秒数。',
    },
];

export const STRING_VAR_VALUES: VarValueEntry[] = [
    {
        value: '自定义文本',
        label: '自定义文本',
        description: '与[信息输出]语句的处理相同，换行用\\r\\n代替。',
    },
    {
        value: '游戏收包主体文本返回',
        label: '游戏收包主体文本返回',
        description:
            '填写要返回收包的发包文本/包字节集，会发送该包并返回收包的包体，即主体参数部分的文本。该语句赋值默认有0.1秒延迟。',
    },
    {
        value: '现行时间',
        label: '现行时间',
        description: '当前电脑系统时间的格式化文本。',
    },
    {
        value: '时间戳转文本',
        label: '时间戳转文本',
        description: '填写一个10位时间戳，会将该时间戳格式化并返回文本。',
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
