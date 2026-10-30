import { ref } from 'vue';
import type { ImportFileKind } from '../shared/messages';
import { onMessage, post } from './vscode-api';

/** 通过扩展端文件对话框导入文件，按类型分别记住上次目录。 */
export function useFileImport(kind: ImportFileKind) {
    const fileName = ref('');
    const fileHex = ref('');

    onMessage((message) => {
        if (message.command === 'file-picked' && message.kind === kind) {
            fileName.value = message.fileName;
            fileHex.value = message.fileHex;
        }
    });

    return {
        fileName,
        fileHex,
        open(): void {
            post({ command: 'pick-file', kind });
        },
    };
}
