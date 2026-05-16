import * as vscode from 'vscode';
import type { BaseMessage } from '../types/messages';

/**
 * 错误处理选项
 */
export interface ErrorOptions {
    view: string;
    command?: string;
    showMessage?: boolean;
}

/**
 * 统一错误处理函数
 * @param error 错误对象
 * @param options 错误上下文信息
 */
export function handleError(
    error: Error | unknown,
    options: ErrorOptions
): void {
    const errorStr = error instanceof Error ? error.message : String(error);
    const context = `[${options.view}${options.command ? `/${options.command}` : ''}]`;

    // 记录到控制台
    console.error(`${context} 错误：${errorStr}`);

    // 显示用户提示
    if (options.showMessage !== false) {
        vscode.window.showErrorMessage(`${options.view} 操作失败：${errorStr}`);
    }
}

/**
 * 安全执行异步消息处理
 * @param handler 消息处理函数
 * @param options 错误上下文信息
 * @returns 包装后的异步处理函数
 */
export function safeHandleMessage<T extends BaseMessage = any>(
    handler: (message: T) => void | Promise<void>,
    options: { view: string }
) {
    return async (message: T) => {
        try {
            await handler(message);
        } catch (error) {
            handleError(error as Error, {
                view: options.view,
                command: message.command,
            });
        }
    };
}
