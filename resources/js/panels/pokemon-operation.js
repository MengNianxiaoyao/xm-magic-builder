(function () {
    const view = window.__xmView;

    view.bindRadioToggle('pokemon-op', {
        first: 'id-input-group',
        'switch-id': 'id-input-group',
        'switch-pos': 'pos-input-group',
        'set-bag': 'bag-input-group',
    });

    const OP_COMMANDS = {
        first: '精灵首发',
        'switch-id': '精灵切换-ID',
        'switch-pos': '精灵切换-位置',
        'set-bag': '设置背包',
    };
    const OP_INPUTS = {
        first: 'pokemon-id',
        'switch-id': 'pokemon-id',
        'switch-pos': 'pokemon-pos',
        'set-bag': 'bag-ids',
    };

    document.getElementById('add-btn').addEventListener('click', function () {
        const op = view.getCheckedRadio('pokemon-op');
        const command = OP_COMMANDS[op];
        if (!command) {
            return;
        }
        const input = document.getElementById(OP_INPUTS[op]);
        view.post({ command: command, content: input ? input.value : '' });
    });

    document.getElementById('restore-btn').addEventListener('click', function () {
        view.post({ command: '设置背包', content: '还原背包' });
    });
})();
