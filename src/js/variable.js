(function () {
    const vscode = acquireVsCodeApi();

    const data = window.__variableViewData;
    const integerValues = data.integerValues;
    const stringValues = data.stringValues;
    const noCustomTypes = data.noCustomTypes;

    function updateValueOptions(type) {
        const valueSelect = document.getElementById('var-value');
        const options = type === 'integer' ? integerValues : stringValues;
        valueSelect.innerHTML = options
            .map(function (v) {
                return '<option value="' + v.value + '">' + v.label + '</option>';
            })
            .join('');
    }

    function updateCustomInput(value, type) {
        const customGroup = document.getElementById('custom-value-group');
        if (customGroup) {
            if (noCustomTypes.indexOf(value) !== -1) {
                customGroup.style.display = 'none';
            } else {
                customGroup.style.display = 'flex';
            }
        }
    }

    document.getElementById('var-type').addEventListener('change', function (e) {
        const type = e.target.value;
        updateValueOptions(type);
        updateCustomInput(document.getElementById('var-value').value, type);
    });

    document.getElementById('var-value').addEventListener('change', function (e) {
        updateCustomInput(e.target.value, document.getElementById('var-type').value);
    });

    document.getElementById('clear-btn').addEventListener('click', function () {
        vscode.postMessage({ command: 'variable-clear' });
    });

    document.getElementById('add-btn').addEventListener('click', function () {
        const varName = document.getElementById('var-name').value;
        const varType = document.getElementById('var-type').value;
        const varValue = document.getElementById('var-value').value;
        const customValueInput = document.getElementById('custom-value');
        const customValue = customValueInput ? customValueInput.value : '';

        if (!varName) {
            vscode.postMessage({ command: 'show-warning', message: '变量名称不得为空！' });
            return;
        }

        if (noCustomTypes.indexOf(varValue) === -1 && !customValue) {
            vscode.postMessage({ command: 'show-warning', message: '当前类型变量值不得为空！' });
            return;
        }

        vscode.postMessage({
            command: 'variable-add',
            varName: varName,
            varType: varType,
            varValue: varValue,
            customValue: customValue,
        });
    });
})();
