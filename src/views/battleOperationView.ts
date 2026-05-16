import { BaseView } from './baseView';
import {
    createTextInput,
    createButtonRow,
    createRadioGroup,
    createSelect,
    checkXmFile,
    insertText,
} from '../utils';
import { XM_KEYWORDS } from '../constants/xmKeywords';

export class BattleOperationView extends BaseView {
    getContent(): string {
        const selectHtml = createSelect({
            id: 'fire-select',
            options: [
                { value: '绿火', label: '绿火' },
                { value: '金火', label: '金火' },
                { value: '紫火', label: '紫火' },
                { value: '蓝火', label: '蓝火' },
            ],
        });

        const battleIdHtml = createTextInput({ id: 'battle-id' });
        const skillIdHtml = createTextInput({ id: 'skill-id' });
        const itemIdHtml = createTextInput({ id: 'item-id' });
        const radioHtml = createRadioGroup(
            'battle-op',
            [
                {
                    value: 'takeover',
                    label: XM_KEYWORDS.TAKEOVER_BATTLE,
                    checked: true,
                },
                { value: 'skill', label: XM_KEYWORDS.USE_SKILL },
                { value: 'item', label: XM_KEYWORDS.USE_ITEM },
                { value: 'pre-battle', label: XM_KEYWORDS.PRE_BATTLE },
            ],
            true,
            2
        );
        const buttonsHtml = createButtonRow(
            [
                { id: 'add-btn', text: '添加' },
                { id: 'retreat-btn', text: '对战撤退' },
                { id: 'pressure-btn', text: '压血' },
                { id: 'recover-btn', text: '全精灵恢复' },
            ],
            2
        );

        return `
        <div class="container">
            ${radioHtml}
            
            <div id="takeover-group" class="input-group">
                <span class="label">对战包</span>
                ${battleIdHtml}
            </div>
            
            <div id="skill-group" class="input-group" style="display: none;">
                <span class="label">技能ID</span>
                ${skillIdHtml}
            </div>
            
            <div id="item-group" class="input-group" style="display: none;">
                <span class="label">道具ID</span>
                ${itemIdHtml}
            </div>
            
            <div id="pre-battle-group" class="input-group" style="display: none;">
                <span class="label">借火类型</span>
                ${selectHtml}
            </div>
            
            ${buttonsHtml}
        </div>
        <script>
            const vscode = acquireVsCodeApi();
            
            function toggleInput() {
                const op = document.querySelector('input[name="battle-op"]:checked').value;
                
                document.getElementById('takeover-group').style.display = 'none';
                document.getElementById('skill-group').style.display = 'none';
                document.getElementById('item-group').style.display = 'none';
                document.getElementById('pre-battle-group').style.display = 'none';
                
                if (op === 'takeover') {
                    document.getElementById('takeover-group').style.display = 'flex';
                } else if (op === 'skill') {
                    document.getElementById('skill-group').style.display = 'flex';
                } else if (op === 'item') {
                    document.getElementById('item-group').style.display = 'flex';
                } else if (op === 'pre-battle') {
                    document.getElementById('pre-battle-group').style.display = 'flex';
                }
            }
            
            document.querySelectorAll('input[name="battle-op"]').forEach(radio => {
                radio.addEventListener('change', toggleInput);
            });
            
            document.getElementById('add-btn').addEventListener('click', () => {
                const op = document.querySelector('input[name="battle-op"]:checked').value;
                let command = '';
                let content = '';
                
                switch (op) {
                    case 'takeover':
                        command = XM_KEYWORDS.TAKEOVER_BATTLE;
                        content = document.getElementById('battle-id').value;
                        break;
                    case 'skill':
                        command = XM_KEYWORDS.USE_SKILL;
                        content = document.getElementById('skill-id').value;
                        break;
                    case 'item':
                        command = XM_KEYWORDS.USE_ITEM;
                        content = document.getElementById('item-id').value;
                        break;
                    case 'pre-battle':
                        command = XM_KEYWORDS.PRE_BATTLE;
                        content = '领取' + document.getElementById('fire-select').value;
                        break;
                }

                vscode.postMessage({ command, content });
            });

            document.getElementById('retreat-btn').addEventListener('click', () => {
                vscode.postMessage({ command: XM_KEYWORDS.USE_SKILL, content: XM_KEYWORDS.RETREAT });
            });

            document.getElementById('pressure-btn').addEventListener('click', () => {
                vscode.postMessage({ command: XM_KEYWORDS.PRE_BATTLE, content: '压血' });
            });

            document.getElementById('recover-btn').addEventListener('click', () => {
                vscode.postMessage({ command: XM_KEYWORDS.PRE_BATTLE, content: '全精灵恢复' });
            });
        </script>`;
    }

    protected handleMessage(message: {
        command: string;
        content: string;
    }): void {
        if (!checkXmFile()) {
            return;
        }

        if (message.command === XM_KEYWORDS.TAKEOVER_BATTLE) {
            insertText(`${XM_KEYWORDS.TAKEOVER_BATTLE}=${message.content}`);
        } else if (message.command === XM_KEYWORDS.USE_SKILL) {
            insertText(`${XM_KEYWORDS.USE_SKILL}=${message.content}`);
        } else if (message.command === XM_KEYWORDS.USE_ITEM) {
            insertText(`${XM_KEYWORDS.USE_ITEM}=${message.content}`);
        } else if (message.command === XM_KEYWORDS.PRE_BATTLE) {
            insertText(`${XM_KEYWORDS.PRE_BATTLE}=${message.content}`);
        }
    }
}
