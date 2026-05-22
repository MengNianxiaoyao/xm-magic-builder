(function () {
    var vscode = acquireVsCodeApi();

    var data = window.__variableViewData;
    var integerValues = data.integerValues;
    var stringValues = data.stringValues;
    var noCustomTypes = data.noCustomTypes;

    function updateValueOptions(type) {
        var valueSelect = document.getElementById('var-value');
        var options = type === 'integer' ? integerValues : stringValues;
        valueSelect.innerHTML = options.map(function (v) {
            return '<option value="' + v.value + '">' + v.label + '</option>';
        }).join('');
    }

    function updateCustomInput(value, type) {
        var customGroup = document.getElementById('custom-value-group');
        if (customGroup) {
            if (noCustomTypes.indexOf(value) !== -1) {
                customGroup.style.display = 'none';
            } else {
                customGroup.style.display = 'flex';
            }
        }
    }

    document.getElementById('var-type').addEventListener('change', function (e) {
        var type = e.target.value;
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
        var varName = document.getElementById('var-name').value;
        var varType = document.getElementById('var-type').value;
        var varValue = document.getElementById('var-value').value;
        var customValueInput = document.getElementById('custom-value');
        var customValue = customValueInput ? customValueInput.value : '';

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
            customValue: customValue
        });
    });
})();