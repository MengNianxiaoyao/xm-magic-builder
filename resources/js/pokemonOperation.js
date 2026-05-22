(function () {
    const vscode = acquireVsCodeApi();

    function getCheckedRadio(name) {
        const el = document.querySelector('input[name="' + name + '"]:checked');
        return el ? el.value : null;
    }

    function toggleInput() {
        const op = getCheckedRadio('pokemon-op');
        if (!op) return;

        const idGroup = document.getElementById('id-input-group');
        const posGroup = document.getElementById('pos-input-group');
        const bagGroup = document.getElementById('bag-input-group');

        idGroup.style.display = 'none';
        posGroup.style.display = 'none';
        bagGroup.style.display = 'none';

        if (op === 'first' || op === 'switch-id') {
            idGroup.style.display = 'flex';
        } else if (op === 'switch-pos') {
            posGroup.style.display = 'flex';
        } else if (op === 'set-bag') {
            bagGroup.style.display = 'flex';
        }
    }

    document.querySelectorAll('input[name="pokemon-op"]').forEach(function (radio) {
        radio.addEventListener('change', toggleInput);
    });

    document.getElementById('add-btn').addEventListener('click', function () {
        const op = getCheckedRadio('pokemon-op');
        if (!op) return;
        const idValue = document.getElementById('pokemon-id').value;
        const posValue = document.getElementById('pokemon-pos').value;
        const bagValue = document.getElementById('bag-ids').value;

        let command = '';
        let content = '';

        switch (op) {
            case 'first':
                command = '精灵首发';
                content = idValue;
                break;
            case 'switch-id':
                command = '精灵切换-ID';
                content = idValue;
                break;
            case 'switch-pos':
                command = '精灵切换-位置';
                content = posValue;
                break;
            case 'set-bag':
                command = '设置背包';
                content = bagValue;
                break;
        }

        vscode.postMessage({ command: command, content: content });
    });

    document.getElementById('restore-btn').addEventListener('click', function () {
        vscode.postMessage({ command: '设置背包', content: '还原背包' });
    });
})();
