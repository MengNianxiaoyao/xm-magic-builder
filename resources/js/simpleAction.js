(function () {
    var vscode = acquireVsCodeApi();

    document.querySelectorAll('button[data-command]').forEach(function (btn) {
        btn.addEventListener('click', function () {
            var command = btn.getAttribute('data-command');
            if (!command) return;

            var payload = { command: command };

            var inputIds = btn.getAttribute('data-inputs');
            if (inputIds) {
                inputIds.split(',').forEach(function (pair) {
                    var parts = pair.split(':');
                    if (parts.length >= 2) {
                        var el = document.getElementById(parts[0].trim());
                        if (el) payload[parts[1].trim()] = el.value;
                    }
                });
            } else {
                var inputId = btn.getAttribute('data-input');
                if (inputId) {
                    var el = document.getElementById(inputId);
                    if (el) payload.content = el.value;
                }
            }

            var radioMap = btn.getAttribute('data-radio');
            if (radioMap) {
                var parts = radioMap.split(':');
                if (parts.length >= 2) {
                    var radioEl = document.querySelector(
                        'input[name="' + parts[0] + '"]:checked'
                    );
                    if (radioEl) payload[parts[1].trim()] = radioEl.value;
                }
            }

            vscode.postMessage(payload);
        });
    });
})();
