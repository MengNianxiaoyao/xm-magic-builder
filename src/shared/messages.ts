/** 扩展与 webview 之间的消息协议，两端共用。 */
export interface MagicManageData {
    portLimit: string;
    versionMajor: string;
    versionMinor: string;
    apiParam: string;
    versionCheck1: string;
    versionCheck2: string;
    blacklist: string;
    appid: string;
    sponsorDays: string;
}

export interface CompletionStat {
    key: string;
    count: number;
}

export type ImportFileKind = 'custom-attack' | 'custom-magic';

export const DEFAULT_MAGIC_MANAGE: MagicManageData = {
    portLimit: '0',
    versionMajor: '0',
    versionMinor: '1',
    apiParam: '',
    versionCheck1: '1',
    versionCheck2: '0',
    blacklist: '',
    appid: '',
    sponsorDays: '1',
};

export type WebviewMessage =
    | { command: 'show-warning'; message: string }
    | { command: '精灵培养'; content: string }
    | { command: 'add-packet'; content: string }
    | { command: 'add-delay'; content: string }
    | { command: 'add-battle-delay'; content: string }
    | { command: '精灵首发'; content: string }
    | { command: '精灵切换-ID'; content: string }
    | { command: '精灵切换-位置'; content: string }
    | { command: '设置背包'; content: string }
    | { command: '接管对战'; content: string }
    | { command: '使用技能'; content: string }
    | { command: '使用道具'; content: string }
    | { command: '战前准备'; content: string }
    | { command: 'attack-loop-head' }
    | { command: 'attack-loop-tail' }
    | { command: 'battle-loop-head'; content: string }
    | { command: 'battle-loop-tail'; content: string }
    | { command: 'if-loop-head'; content: string }
    | { command: 'if-loop-tail' }
    | { command: 'if-loop-break' }
    | { command: 'count-loop-head'; loopId: string; value: string; init: string }
    | { command: 'count-loop-tail'; loopId: string }
    | { command: 'wild-pokemon'; type: string; mapId: string; pokemonId: string }
    | { command: 'output'; content: string }
    | { command: 'custom-attack-add'; battlePacket: string; fileName: string; fileHex: string }
    | { command: 'custom-attack-var-add'; varName: string; fileHex: string }
    | { command: 'custom-attack-use-var'; battlePacket: string; varName: string }
    | {
          command: 'custom-magic-add';
          passCurrent: string;
          returnVar: string;
          password: string;
          fileName: string;
          fileHex: string;
      }
    | {
          command: 'custom-magic-plain-add';
          passCurrent: string;
          returnVar: string;
          varName: string;
          plainContent: string;
      }
    | { command: 'custom-magic-var-add'; varName: string; fileHex: string }
    | {
          command: 'custom-magic-use-var';
          passCurrent: string;
          returnVar: string;
          password: string;
          varName: string;
      }
    | { command: 'variable-clear' }
    | {
          command: 'variable-add';
          varName: string;
          varType: string;
          varValue: string;
          customValue: string;
          attrType: string;
          attrValue: string;
      }
    | {
          command: 'magic-manage';
          portLimit: string;
          versionMajor: string;
          versionMinor: string;
          apiParam: string;
          versionCheck1: string;
          versionCheck2: string;
          blacklist: string;
          appid: string;
          sponsorDays: string;
      }
    | { command: 'load-magic-manage' }
    | { command: 'pick-file'; kind: ImportFileKind }
    | { command: 'load' }
    | { command: 'reset' };

export type ExtensionMessage =
    | { command: 'magic-manage-loaded'; data: MagicManageData }
    | { command: 'refresh'; stats: CompletionStat[]; total: number }
    | { command: 'file-picked'; kind: ImportFileKind; fileName: string; fileHex: string };
