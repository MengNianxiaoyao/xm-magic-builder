(function () {
    const vscode = acquireVsCodeApi();

    document.getElementById('add-btn').addEventListener('click', function () {
        const battlePacket = document.getElementById('battle-packet').value;
        const fileName = document.getElementById('file-name').value;

        if (!battlePacket || !fileName) {
            vscode.postMessage({ command: 'show-warning', message: '对战包/对战方案不得为空!' });
            return;
        }

        vscode.postMessage({
            command: 'custom-attack-add',
            battlePacket: battlePacket,
            fileName: fileName,
            fileHex: window.fileHex || '',
        });
    });

    document.getElementById('add-var-btn').addEventListener('click', function () {
        const varName = document.getElementById('var-name').value;
        const fileName = document.getElementById('file-name').value;

        if (!varName) {
            vscode.postMessage({ command: 'show-warning', message: '变量名称不得为空!' });
            return;
        }
        if (!fileName) {
            vscode.postMessage({ command: 'show-warning', message: '请先导入对战方案!' });
            return;
        }

        vscode.postMessage({
            command: 'custom-attack-var-add',
            varName: varName,
            fileHex: window.fileHex || '',
        });
    });

    document.getElementById('use-var-btn').addEventListener('click', function () {
        const battlePacket = document.getElementById('battle-packet').value;
        const varName = document.getElementById('var-name').value;

        if (!battlePacket) {
            vscode.postMessage({ command: 'show-warning', message: '对战包不得为空!' });
            return;
        }
        if (!varName) {
            vscode.postMessage({ command: 'show-warning', message: '变量名称不得为空!' });
            return;
        }

        vscode.postMessage({
            command: 'custom-attack-use-var',
            battlePacket: battlePacket,
            varName: varName,
        });
    });
})();
