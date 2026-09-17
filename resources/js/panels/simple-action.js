(function () {
    const vscode = acquireVsCodeApi();

    document.querySelectorAll('button[data-command]').forEach(function (btn) {
        btn.addEventListener('click', function () {
            const command = btn.getAttribute('data-command');
            if (!command) return;

            const payload = { command: command };

            const inputIds = btn.getAttribute('data-inputs');
            if (inputIds) {
                inputIds.split(',').forEach(function (pair) {
                    const parts = pair.split(':');
                    if (parts.length >= 2) {
                        const el = document.getElementById(parts[0].trim());
                        if (el) payload[parts[1].trim()] = el.value;
                    }
                });
            } else {
                const inputId = btn.getAttribute('data-input');
                if (inputId) {
                    const el = document.getElementById(inputId);
                    if (el) payload.content = el.value;
                }
            }

            const radioMap = btn.getAttribute('data-radio');
            if (radioMap) {
                const parts = radioMap.split(':');
                if (parts.length >= 2) {
                    const radioEl = document.querySelector('input[name="' + parts[0] + '"]:checked');
                    if (radioEl) payload[parts[1].trim()] = radioEl.value;
                }
            }

            vscode.postMessage(payload);
        });
    });
})();
