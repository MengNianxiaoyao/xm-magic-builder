export interface CompletionInfo {
    label: string;
    detail: string;
    documentation: string;
}

export const KEYWORD_COMPLETIONS: Record<string, CompletionInfo[]> = {
    发包: [
        {
            label: '发包=',
            detail: '发包',
            documentation: '发送包体',
        },
    ],
    延时: [
        {
            label: '延时=',
            detail: '延时',
            documentation: '设置延时时间(毫秒), 1000ms=1秒',
        },
        {
            label: '1000',
            detail: '1000ms',
            documentation: '设置1秒延时',
        },
    ],
    对战延时: [
        {
            label: '对战延时=',
            detail: '对战延时',
            documentation: '设置对战延时时间(毫秒), 1000ms=1秒',
        },
        {
            label: '5000',
            detail: '5000ms',
            documentation: '设置5秒对战延时',
        },
    ],
    接管对战: [
        {
            label: '接管对战=',
            detail: '接管对战',
            documentation: '接管指定对战',
        },
    ],
    精灵首发: [
        {
            label: '精灵首发=',
            detail: '精灵首发',
            documentation: '设置首发精灵 ID',
        },
    ],
    精灵切换: [
        {
            label: '精灵切换-ID=',
            detail: '精灵切换-ID',
            documentation: '通过精灵ID切换',
        },
        {
            label: '精灵切换-位置=',
            detail: '精灵切换-位置',
            documentation: '通过背包位置切换',
        },
    ],
    设置背包: [
        {
            label: '设置背包=',
            detail: '设置背包',
            documentation: '设置背包精灵ID列表',
        },
        {
            label: '还原背包',
            detail: '还原背包',
            documentation: '还原默认背包',
        },
    ],
    使用技能: [
        {
            label: '使用技能=',
            detail: '使用技能',
            documentation: '使用指定技能',
        },
        {
            label: '撤退',
            detail: '撤退',
            documentation: '对战撤退',
        },
    ],
    使用道具: [
        {
            label: '使用道具=',
            detail: '使用道具',
            documentation: '使用指定道具',
        },
    ],
    战前准备: [
        {
            label: '压血',
            detail: '压血',
            documentation: '压制血量到20HP',
        },
        {
            label: '全精灵恢复',
            detail: '全精灵恢复',
            documentation: '恢复所有精灵状态',
        },
        {
            label: '领取绿火',
            detail: '领取绿火',
            documentation: '领取绿火加成',
        },
        {
            label: '领取金火',
            detail: '领取金火',
            documentation: '领取金火加成',
        },
        {
            label: '领取紫火',
            detail: '领取紫火',
            documentation: '领取紫火加成',
        },
        {
            label: '领取蓝火',
            detail: '领取蓝火',
            documentation: '领取蓝火加成',
        },
    ],
    出招循环体: [
        {
            label: '出招循环体=头部\r\n\r\n出招循环体=尾部',
            detail: '出招循环体',
            documentation: '创建出招循环体',
        },
        {
            label: '头部',
            detail: '出招循环体头部',
            documentation: '出招循环体开始',
        },
        {
            label: '尾部',
            detail: '尾部',
            documentation: '出招循环体结束',
        },
    ],
    对战循环体: [
        {
            label: '对战循环体=对战胜利头部\r\n\r\n对战循环体=对战胜利尾部',
            detail: '对战循环体',
            documentation: '创建对战循环体(对战胜利)',
        },
        {
            label: '对战胜利头部',
            detail: '胜利头部',
            documentation: '对战循环体开始(对战胜利)',
        },
        {
            label: '对战胜利尾部',
            detail: '胜利尾部',
            documentation: '对战循环体结束(对战胜利)',
        },
        {
            label: '对战循环体=对战未触发头部\r\n\r\n对战循环体=对战未触发尾部',
            detail: '对战循环体',
            documentation: '创建对战循环体(对战未触发)',
        },
        {
            label: '对战未触发头部',
            detail: '未触发头部',
            documentation: '对战循环体开始(对战未触发)',
        },
        {
            label: '对战未触发尾部',
            detail: '未触发尾部',
            documentation: '对战循环体结束(对战未触发)',
        },
    ],
    判断循环体: [
        {
            label: '判断循环体=头部|\r\n\r\n判断循环体=尾部',
            detail: '判断循环体',
            documentation: '创建判断循环体',
        },
        {
            label: '头部|',
            detail: '头部',
            documentation: '判断循环体开始',
        },
        {
            label: '尾部',
            detail: '尾部',
            documentation: '判断循环体结束',
        },
        {
            label: '跳出循环',
            detail: '跳出循环',
            documentation: '跳出判断循环',
        },
        {
            label: '判断真|',
            detail: '判断真1',
            documentation: '判断真1层',
        },
        {
            label: '判断真2|',
            detail: '判断真2',
            documentation: '判断真2层',
        },
        {
            label: '判断真3|',
            detail: '判断真3',
            documentation: '判断真3层',
        },
        {
            label: '判断真4|',
            detail: '判断真4',
            documentation: '判断真4层',
        },
        {
            label: '判断真5|',
            detail: '判断真5',
            documentation: '判断真5层',
        },
        {
            label: '判断假',
            detail: '判断假',
            documentation: '判断假1层',
        },
        {
            label: '判断假2',
            detail: '判断假2',
            documentation: '判断假2层',
        },
        {
            label: '判断假3',
            detail: '判断假3',
            documentation: '判断假3层',
        },
        {
            label: '判断假4',
            detail: '判断假4',
            documentation: '判断假4层',
        },
        {
            label: '判断假5',
            detail: '判断假5',
            documentation: '判断假5层',
        },
    ],
    计次循环体: [
        {
            label: '计次循环体=头部|标识1|[j]|[i]\r\n\r\n计次循环体=尾部|[标识1]',
            detail: '计次循环体',
            documentation:
                '创建计次循环体\r\n\r\n计次循环体=头部|循环标识|指定值|初始值\r\n\r\n计次循环体=尾部|循环标识',
        },
        {
            label: '头部|标识1|',
            detail: '计次循环体头部',
            documentation: '计次循环体开始',
        },
        {
            label: '尾部|标识1',
            detail: '计次循环体尾部',
            documentation: '计次循环体结束',
        },
    ],
    野怪操作: [
        {
            label: '野怪操作-对战=',
            detail: '野怪对战操作',
            documentation: '野怪操作-对战=地图ID|精灵ID',
        },
        {
            label: '野怪操作-捕捉=',
            detail: '野怪捕捉操作',
            documentation: '野怪操作-捕捉=地图ID|精灵ID',
        },
    ],
    变量: [
        {
            label: '变量=',
            detail: '变量',
            documentation: '创建自定义变量',
        },
        {
            label: '清空变量',
            detail: '清空变量',
            documentation: '清空所有自定义变量',
        },
    ],
    信息输出: [
        {
            label: '信息输出=',
            detail: '信息输出',
            documentation: '输出信息到界面',
        },
    ],
};
