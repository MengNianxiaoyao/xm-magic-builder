export const CHANGE_LABELS = ['等级', '技能', '学习力', '天赋', '性格', '刻印', '抗性', '体力上限', '战队加成'];
export const TEAM_LABELS = ['体力', '攻击', '防御', '特攻', '特防', '速度'];
export const RESIST_ROWS = ['致命伤害', '固定伤害', '百分比伤害'];
export const RESIST_OPTIONS = [
    { value: '0', label: '0不处理' },
    { value: '5', label: '5%' },
    { value: '35', label: '35%' },
];

const NAMES = [
    '精灵ct',
    '结果',
    '是否更换',
    '是否强制',
    '等级',
    '技能',
    '学习力',
    '天赋',
    '性格',
    '刻印',
    '抗性',
    '体力上限',
    '战队加成',
];

export interface PokemonTrainingState {
    catchtime: string;
    result: string;
    change: boolean[];
    force: boolean[];
    level: string;
    skills: number[];
    efforts: number[];
    talent: number;
    character: string;
    emblems: number[];
    emblemOpen: boolean;
    resist: string[];
    hp: number;
    team: boolean[];
}

export type TrainingResult = { ok: true; content: string } | { ok: false; message: string };

export const DEFAULT_STATE: PokemonTrainingState = {
    catchtime: '[培养精灵]',
    result: '[i]',
    change: Array(9).fill(false),
    force: Array(9).fill(true),
    level: '100',
    skills: [0, 0, 0, 999999],
    efforts: [0, 0, 0, 0, 0, 0],
    talent: 0,
    character: '',
    emblems: [0, 0, 0],
    emblemOpen: false,
    resist: ['0', '0', '0'],
    hp: 0,
    team: Array(6).fill(false),
};

function toInt(value: unknown): number {
    const n = typeof value === 'number' ? value : parseInt(String(value), 10);
    return Number.isFinite(n) ? n : 0;
}

function brace(values: Array<string | number>): string {
    return `{${values.join(',')}}`;
}

export function buildTrainingContent(state: PokemonTrainingState): TrainingResult {
    if (state.catchtime === '') {
        return { ok: false, message: '精灵catchtime不得为空！' };
    }
    if (!state.change.some(Boolean)) {
        return { ok: false, message: '更换检测至少需要勾选一项！' };
    }

    const values = [
        state.catchtime,
        state.result,
        brace(state.change.map(Number)),
        brace(state.force.map(Number)),
        state.level,
        brace(state.skills.map(toInt)),
        brace(state.efforts.map(toInt)),
        String(toInt(state.talent)),
        `{${state.character}}`,
        brace([...state.emblems.map(toInt), state.emblemOpen ? 1 : 0]),
        brace(state.resist),
        String(toInt(state.hp)),
        brace(state.team.map(Number)),
    ];

    let text = '';
    values.forEach((value, index) => {
        if (index < 4 || state.change[index - 4]) {
            text += `${text === '' ? '' : '|'}${NAMES[index]}=${value}`;
        }
    });

    return { ok: true, content: `{${text}}` };
}
