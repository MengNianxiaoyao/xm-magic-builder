(function () {
    const view = window.__xmView;

    const NAMES = [
        '精灵ct',
        '结果',
        '是否更换',
        '是否强制',
        '等级',
        '技能',
        '学习力',
        '天赋',
        '性格',
        '刻印',
        '抗性',
        '体力上限',
        '战队加成',
    ];

    function toInt(value) {
        const n = parseInt(value, 10);
        return isNaN(n) ? 0 : n;
    }

    function readNumber(id) {
        const el = document.getElementById(id);
        return toInt(el ? el.value : '');
    }

    function readNumbers(prefix, count) {
        const out = [];
        for (let i = 1; i <= count; i++) {
            out.push(readNumber(prefix + '-' + i));
        }
        return out;
    }

    function readFlags(prefix, count) {
        const out = [];
        for (let i = 1; i <= count; i++) {
            const el = document.getElementById(prefix + '-' + i);
            out.push(el && el.checked ? 1 : 0);
        }
        return out;
    }

    function readRadio(name) {
        return view.getCheckedRadio(name) || '0';
    }

    function brace(values) {
        return '{' + values.join(',') + '}';
    }

    document.querySelectorAll('.pt-tab').forEach(function (tab) {
        tab.addEventListener('click', function () {
            const name = tab.getAttribute('data-tab');
            document.querySelectorAll('.pt-tab').forEach(function (item) {
                item.classList.toggle('active', item === tab);
            });
            document.querySelectorAll('.pt-tab-panel').forEach(function (panel) {
                panel.classList.toggle('active', panel.id === 'pt-tab-' + name);
            });
        });
    });

    function buildValues(changeFlags) {
        return [
            document.getElementById('pt-catchtime').value,
            document.getElementById('pt-result').value,
            brace(changeFlags),
            brace(readFlags('pt-force', 9)),
            view.getCheckedRadio('pt-level') || '100',
            brace(readNumbers('pt-skill', 4)),
            brace(readNumbers('pt-effort', 6)),
            String(readNumber('pt-talent')),
            '{' + document.getElementById('pt-character').value + '}',
            brace(readNumbers('pt-emblem', 3).concat([document.getElementById('pt-emblem-open').checked ? 1 : 0])),
            brace([readRadio('pt-res-1'), readRadio('pt-res-2'), readRadio('pt-res-3')]),
            String(readNumber('pt-hp')),
            brace(readFlags('pt-team', 6)),
        ];
    }

    document.getElementById('add-btn').addEventListener('click', function () {
        const catchtime = document.getElementById('pt-catchtime').value;
        if (catchtime === '') {
            view.warn('精灵ct不得为空！');
            return;
        }

        const changeFlags = readFlags('pt-change', 9);
        if (changeFlags.indexOf(1) === -1) {
            view.warn('更换检测至少需要勾选一项！');
            return;
        }

        const values = buildValues(changeFlags);
        let text = '';
        for (let i = 0; i < values.length; i++) {
            if (i < 4 || changeFlags[i - 4] === 1) {
                text += (text === '' ? '' : '|') + NAMES[i] + '=' + values[i];
            }
        }

        view.post({ command: '精灵培养', content: '{' + text + '}' });
    });
})();
