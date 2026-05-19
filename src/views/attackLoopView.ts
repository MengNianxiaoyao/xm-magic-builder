import { SimpleActionView, ActionItem } from './actions';

export class AttackLoopView extends SimpleActionView {
    protected getActions(): ActionItem[] {
        return [
            {
                id: 'head-btn',
                text: '出招循环体头',
                command: 'attack-loop-head',
                template: '出招循环体=头部',
            },
            {
                id: 'tail-btn',
                text: '出招循环体尾',
                command: 'attack-loop-tail',
                template: '出招循环体=尾部',
            },
        ];
    }
}
