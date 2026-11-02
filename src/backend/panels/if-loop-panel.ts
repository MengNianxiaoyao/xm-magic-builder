import * as vscode from 'vscode';
import type { PanelDescriptor } from '../panel-types';
import { appendToIfLine, checkXmFile, insertText } from '../services/text-editor';
import { consumeWarning } from '../command-template';

export const ifLoopPanel: PanelDescriptor = {
    id: 'xm-magic-builder.if-loop',
    title: '判断循环体',
    actions: [],
    vue: { component: 'if-loop' },
    async handleMessage(
        message: Record<string, unknown>,
        _context: vscode.ExtensionContext,
        _webview: vscode.WebviewView
    ) {
        if (consumeWarning(message)) {
            return;
        }

        const msg = message as Record<string, string>;
        if (!checkXmFile()) {
            return;
        }

        if (msg.command === 'if-loop-head') {
            await insertText(msg.content ? `判断循环体=头部|${msg.content}` : '判断循环体=头部');
        } else if (msg.command === 'if-loop-tail') {
            await insertText('判断循环体=尾部');
        } else if (msg.command === 'if-loop-break') {
            await insertText('判断循环体=跳出循环');
        } else if (msg.command === 'if-loop-condition') {
            const level = Number(msg.level) > 1 ? String(msg.level) : '';
            if (msg.relation === '判断假') {
                await insertText(`判断循环体=判断假${level}`);
                return;
            }

            if (!msg.condition) {
                return;
            }

            if (msg.relation === '判断真') {
                await insertText(`判断循环体=判断真${level}|${msg.condition}`);
            } else {
                await appendToIfLine(`|${msg.relation}|${msg.condition}`);
            }
        }
    },
};
