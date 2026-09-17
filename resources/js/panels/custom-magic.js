(function () {
    const view = window.__xmView;

    view.bindFileImport();

    function readPassFlags() {
        return {
            passCurrent: view.checkState('pass-current'),
            returnVar: view.checkState('return-var'),
        };
    }

    document.getElementById('add-btn').addEventListener('click', function () {
        const values = view.readValues(['password', 'file-name']);
        if (!values['file-name']) {
            view.warn('自定义魔法不得为空!');
            return;
        }

        const flags = readPassFlags();
        view.post({
            command: 'custom-magic-add',
            passCurrent: flags.passCurrent,
            returnVar: flags.returnVar,
            password: values.password,
            fileName: values['file-name'],
            fileHex: window.fileHex || '',
        });
    });

    document.getElementById('add-plain-btn').addEventListener('click', function () {
        const values = view.readValues(['var-name', 'plain-content']);
        if (!values['var-name']) {
            view.warn('明文文件名不得为空!');
            return;
        }
        if (!values['plain-content']) {
            view.warn('明文内容不得为空!');
            return;
        }

        const flags = readPassFlags();
        view.post({
            command: 'custom-magic-plain-add',
            passCurrent: flags.passCurrent,
            returnVar: flags.returnVar,
            varName: values['var-name'],
            plainContent: values['plain-content'],
        });
    });

    document.getElementById('add-var-btn').addEventListener('click', function () {
        const values = view.readValues(['var-name', 'file-name']);
        if (!values['var-name']) {
            view.warn('变量名称不得为空!');
            return;
        }
        if (!values['file-name']) {
            view.warn('请先导入魔法!');
            return;
        }

        view.post({
            command: 'custom-magic-var-add',
            varName: values['var-name'],
            fileHex: window.fileHex || '',
        });
    });

    document.getElementById('use-var-btn').addEventListener('click', function () {
        const values = view.readValues(['password', 'var-name']);
        if (!values['var-name']) {
            view.warn('变量名称不得为空!');
            return;
        }

        const flags = readPassFlags();
        view.post({
            command: 'custom-magic-use-var',
            passCurrent: flags.passCurrent,
            returnVar: flags.returnVar,
            password: values.password,
            varName: values['var-name'],
        });
    });
})();
