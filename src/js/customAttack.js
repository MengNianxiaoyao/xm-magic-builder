(function () {
    var vscode = acquireVsCodeApi();

    document.getElementById('add-btn').addEventListener('click', function () {
        var battlePacket = document.getElementById('battle-packet').value;
        var fileName = document.getElementById('file-name').value;

        if (!battlePacket || !fileName) {
            vscode.postMessage({ command: 'show-warning', message: '对战包/对战方案不得为空!' });
            return;
        }

        vscode.postMessage({
            command: 'custom-attack-add',
            battlePacket: battlePacket,
            fileName: fileName,
            fileHex: window.fileHex || ''
        });
    });
})();