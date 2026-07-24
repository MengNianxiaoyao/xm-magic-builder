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

    function updateDescription(value, type) {
        const values = type === 'integer' ? integerValues : stringValues;
        let found = null;
        for (let i = 0; i < values.length; i++) {
            if (values[i].value === value) {
                found = values[i];
                break;
            }
        }
        document.getElementById('value-desc').textContent = found ? found.description : '';
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

    function onValueOrTypeChange() {
        const type = document.getElementById('var-type').value;
        const value = document.getElementById('var-value').value;
        updateCustomInput(value, type);
        updateDescription(value, type);
    }

    document.getElementById('var-type').addEventListener('change', function (e) {
        const type = e.target.value;
        updateValueOptions(type);
        onValueOrTypeChange();
    });

    document.getElementById('var-value').addEventListener('change', function (e) {
        onValueOrTypeChange();
    });

    onValueOrTypeChange();

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
