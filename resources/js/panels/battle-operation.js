(function () {
    const view = window.__xmView;

    view.bindRadioToggle('battle-op', {
        takeover: 'takeover-group',
        skill: 'skill-group',
        item: 'item-group',
        'pre-battle': 'pre-battle-group',
    });

    document.getElementById('add-btn').addEventListener('click', function () {
        const op = view.getCheckedRadio('battle-op');
        const values = view.readValues(['battle-id', 'skill-id', 'item-id', 'fire-select']);
        let command = null;
        let content = '';

        if (op === 'takeover') {
            command = '接管对战';
            content = values['battle-id'];
        } else if (op === 'skill') {
            command = '使用技能';
            content = values['skill-id'];
        } else if (op === 'item') {
            command = '使用道具';
            content = values['item-id'];
        } else if (op === 'pre-battle') {
            command = '战前准备';
            content = '领取' + values['fire-select'];
        }
        if (!command) {
            return;
        }

        view.post({ command: command, content: content });
    });

    const shortcuts = [
        ['retreat-btn', '使用技能', '撤退'],
        ['pressure-btn', '战前准备', '压血'],
        ['recover-btn', '战前准备', '全精灵恢复'],
    ];
    shortcuts.forEach(function (item) {
        document.getElementById(item[0]).addEventListener('click', function () {
            view.post({ command: item[1], content: item[2] });
        });
    });
})();
