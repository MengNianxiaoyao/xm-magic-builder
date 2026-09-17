import type { PanelDescriptor } from '../shared/types';
import { checkXmFile, insertText, showWarning } from '../services/editor';

type MessageHandler = NonNullable<PanelDescriptor['handleMessage']>;

/**
 * 消费 show-warning 消息（前端校验失败时）。已消费返回 true，调用方直接 return。
 */
export function consumeWarning(message: Record<string, unknown>): boolean {
    if (message.command === 'show-warning') {
        showWarning(message.message as string);
        return true;
    }
    return false;
}

/**
 * “命令=内容”直插型面板（精灵操作/对战操作）：白名单校验 + .xm 检查 + 插入。
 */
export function keyValueHandler(...commands: string[]): MessageHandler {
    return (message) => {
        if (!checkXmFile()) {
            return;
        }
        const cmd = message.command as string;
        if (commands.includes(cmd)) {
            void insertText(`${cmd}=${(message.content as string) ?? ''}`);
        }
    };
}

/**
 * 出招变量/魔法变量存取：自定义出招与自定义魔法共用同一变量行格式。
 */
export function buildVariableAdd(varName: string, fileHex: string): string {
    return `变量=文本型|${varName}|自定义文本|${fileHex}`;
}
