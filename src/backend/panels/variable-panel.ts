import type { PanelDescriptor } from '../panel-types';
import { checkXmFile, insertText } from '../services/text-editor';
import { consumeWarning } from '../command-template';
import { NO_CUSTOM_VAR_TYPES } from '../../shared/variable-values';

export const variablePanel: PanelDescriptor = {
    id: 'xm-magic-builder.variable',
    title: '变量',
    actions: [],
    vue: { component: 'variable' },
    handleMessage(message: Record<string, unknown>) {
        if (consumeWarning(message)) {
            return;
        }

        if (!checkXmFile()) {
            return;
        }

        if (message.command === 'variable-clear') {
            void insertText('变量=清空变量');
        } else if (message.command === 'variable-add') {
            const varType = message.varType as string;
            const varValue = message.varValue as string;
            const typeLabel = varType === 'integer' ? '整数型' : '文本型';
            const actualValue = NO_CUSTOM_VAR_TYPES.includes(varValue) ? '0' : (message.customValue as string);
            let output: string;
            if (varValue === '精灵属性查询返回') {
                const typeBase: Record<string, number> = { 基础: 10, PVE: 20, PVP: 30 };
                const valueOffset: Record<string, number> = { 体力: 1, 攻击: 2, 防御: 3, 特攻: 4, 特防: 5, 速度: 6 };
                const attrType = message.attrType as string;
                const attrValue = message.attrValue as string;
                const id = (typeBase[attrType] || 0) + (valueOffset[attrValue] || 0);
                output = `变量=${typeLabel}|${message.varName as string}|${varValue}|{${actualValue},${id}}`;
            } else {
                output = `变量=${typeLabel}|${message.varName as string}|${varValue}|${actualValue}`;
            }
            void insertText(output);
        }
    },
};
