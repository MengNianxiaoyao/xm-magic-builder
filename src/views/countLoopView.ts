import { SimpleActionView, ActionItem } from './actions';
import { createTextInput } from '../utils';

export class CountLoopView extends SimpleActionView {
    protected getActions(): ActionItem[] {
        return [
            {
                id: 'head-btn',
                text: '计次循环体头',
                command: 'count-loop-head',
                inputs: {
                    'loop-id': 'loopId',
                    value: 'value',
                    'init-value': 'init',
                },
                template: '计次循环体=头部|${loopId}|${value}|${init}',
            },
            {
                id: 'tail-btn',
                text: '计次循环体尾',
                command: 'count-loop-tail',
                inputs: {
                    'loop-id': 'loopId',
                },
                template: '计次循环体=尾部|${loopId}',
            },
        ];
    }

    protected getFormFields(): string {
        return `
            <div class="input-group">
                <span class="label">循环标识</span>
                ${createTextInput({ id: 'loop-id', value: '标识1' })}
            </div>
            <div class="input-group">
                <span class="label">指定值</span>
                ${createTextInput({ id: 'value', value: '[j]' })}
            </div>
            <div class="input-group">
                <span class="label">初始值赋值变量</span>
                ${createTextInput({ id: 'init-value', value: '[i]' })}
            </div>`;
    }
}
