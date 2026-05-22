(function () {
    const vscode = acquireVsCodeApi();

    function getCheckedRadio(name) {
        const el = document.querySelector('input[name="' + name + '"]:checked');
        return el ? el.value : null;
    }

    function toggleInput() {
        const op = getCheckedRadio('battle-op');
        if (!op) return;

        document.getElementById('takeover-group').style.display = 'none';
        document.getElementById('skill-group').style.display = 'none';
        document.getElementById('item-group').style.display = 'none';
        document.getElementById('pre-battle-group').style.display = 'none';

        if (op === 'takeover') {
            document.getElementById('takeover-group').style.display = 'flex';
        } else if (op === 'skill') {
            document.getElementById('skill-group').style.display = 'flex';
        } else if (op === 'item') {
            document.getElementById('item-group').style.display = 'flex';
        } else if (op === 'pre-battle') {
            document.getElementById('pre-battle-group').style.display = 'flex';
        }
    }

    document.querySelectorAll('input[name="battle-op"]').forEach(function (radio) {
        radio.addEventListener('change', toggleInput);
    });

    document.getElementById('add-btn').addEventListener('click', function () {
        const op = getCheckedRadio('battle-op');
        if (!op) return;
        let command = '';
        let content = '';

        switch (op) {
            case 'takeover':
                command = '接管对战';
                content = document.getElementById('battle-id').value;
                break;
            case 'skill':
                command = '使用技能';
                content = document.getElementById('skill-id').value;
                break;
            case 'item':
                command = '使用道具';
                content = document.getElementById('item-id').value;
                break;
            case 'pre-battle':
                command = '战前准备';
                content = '领取' + document.getElementById('fire-select').value;
                break;
        }

        vscode.postMessage({ command: command, content: content });
    });

    document.getElementById('retreat-btn').addEventListener('click', function () {
        vscode.postMessage({ command: '使用技能', content: '撤退' });
    });

    document.getElementById('pressure-btn').addEventListener('click', function () {
        vscode.postMessage({ command: '战前准备', content: '压血' });
    });

    document.getElementById('recover-btn').addEventListener('click', function () {
        vscode.postMessage({ command: '战前准备', content: '全精灵恢复' });
    });
})();
