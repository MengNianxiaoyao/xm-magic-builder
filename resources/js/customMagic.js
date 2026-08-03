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

    document.getElementById('add-plain-btn').addEventListener('click', function () {
        const passCurrent = document.getElementById('pass-current').checked ? '1' : '0';
        const returnVar = document.getElementById('return-var').checked ? '1' : '0';
        const varName = document.getElementById('var-name').value;
        const plainContent = document.getElementById('plain-content').value;

        if (!varName) {
            vscode.postMessage({ command: 'show-warning', message: '明文文件名不得为空!' });
            return;
        }

        if (!plainContent) {
            vscode.postMessage({ command: 'show-warning', message: '明文内容不得为空!' });
            return;
        }

        vscode.postMessage({
            command: 'custom-magic-plain-add',
            passCurrent: passCurrent,
            returnVar: returnVar,
            varName: varName,
            plainContent: plainContent,
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
            vscode.postMessage({ command: 'show-warning', message: '请先导入魔法!' });
            return;
        }

        vscode.postMessage({
            command: 'custom-magic-var-add',
            varName: varName,
            fileHex: window.fileHex || '',
        });
    });

    document.getElementById('use-var-btn').addEventListener('click', function () {
        const passCurrent = document.getElementById('pass-current').checked ? '1' : '0';
        const returnVar = document.getElementById('return-var').checked ? '1' : '0';
        const password = document.getElementById('password').value;
        const varName = document.getElementById('var-name').value;

        if (!varName) {
            vscode.postMessage({ command: 'show-warning', message: '变量名称不得为空!' });
            return;
        }

        vscode.postMessage({
            command: 'custom-magic-use-var',
            passCurrent: passCurrent,
            returnVar: returnVar,
            password: password,
            varName: varName,
        });
    });
})();
