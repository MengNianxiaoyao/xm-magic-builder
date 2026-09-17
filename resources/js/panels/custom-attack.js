(function () {
    const view = window.__xmView;

    view.bindFileImport();

    document.getElementById('add-btn').addEventListener('click', function () {
        const values = view.readValues(['battle-packet', 'file-name']);
        if (!values['battle-packet'] || !values['file-name']) {
            view.warn('对战包/对战方案不得为空!');
            return;
        }

        view.post({
            command: 'custom-attack-add',
            battlePacket: values['battle-packet'],
            fileName: values['file-name'],
            fileHex: window.fileHex || '',
        });
    });

    document.getElementById('add-var-btn').addEventListener('click', function () {
        const values = view.readValues(['var-name', 'file-name']);
        if (!values['var-name']) {
            view.warn('变量名称不得为空!');
            return;
        }
        if (!values['file-name']) {
            view.warn('请先导入对战方案!');
            return;
        }

        view.post({
            command: 'custom-attack-var-add',
            varName: values['var-name'],
            fileHex: window.fileHex || '',
        });
    });

    document.getElementById('use-var-btn').addEventListener('click', function () {
        const values = view.readValues(['battle-packet', 'var-name']);
        if (!values['battle-packet']) {
            view.warn('对战包不得为空!');
            return;
        }
        if (!values['var-name']) {
            view.warn('变量名称不得为空!');
            return;
        }

        view.post({
            command: 'custom-attack-use-var',
            battlePacket: values['battle-packet'],
            varName: values['var-name'],
        });
    });
})();
