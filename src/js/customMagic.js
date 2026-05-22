(function () {
    const vscode = acquireVsCodeApi();

    document.getElementById('add-btn').addEventListener('click', function () {
        const passCurrent = document.getElementById('pass-current').checked ? '1' : '0';
        const returnVar = document.getElementById('return-var').checked ? '1' : '0';
        const password = document.getElementById('password').value;
        const fileName = document.getElementById('file-name').value;

        if (!fileName) {
            vscode.postMessage({ command: 'show-warning', message: '自定义魔法不得为空!' });
            return;
        }

        vscode.postMessage({
            command: 'custom-magic-add',
            passCurrent: passCurrent,
            returnVar: returnVar,
            password: password,
            fileName: fileName,
            fileHex: window.fileHex || '',
        });
    });
})();
