import { ref } from 'vue';
import type { ImportFileKind } from '../shared/messages';
import { onMessage, post } from './vscode-api';

/** 通过扩展端文件对话框导入文件，按类型分别记住上次目录。 */
export function useFileImport(kind: ImportFileKind) {
    const fileName = ref('');
    /** 只记路径：hex 在插入时由扩展端重新读取，文件更新后不用重新导入。 */
    const filePath = ref('');

    onMessage((message) => {
        if (message.command === 'file-picked' && message.kind === kind) {
            fileName.value = message.fileName;
            filePath.value = message.filePath;
        }
    });

    return {
        fileName,
        filePath,
        open(): void {
            post({ command: 'pick-file', kind });
        },
    };
}
