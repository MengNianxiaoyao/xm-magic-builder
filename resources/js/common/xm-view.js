(function () {
    const vscode = acquireVsCodeApi();

    function getCheckedRadio(name) {
        const el = document.querySelector('input[name="' + name + '"]:checked');
        return el ? el.value : null;
    }

    function bytesToHex(bytes) {
        return Array.from(bytes, function (b) {
            return b.toString(16).padStart(2, '0').toUpperCase();
        }).join('');
    }

    const xmView = {
        post: function (payload) {
            vscode.postMessage(payload);
        },

        warn: function (message) {
            vscode.postMessage({ command: 'show-warning', message: message });
        },

        getCheckedRadio: getCheckedRadio,

        escapeHtml: function (text) {
            return String(text)
                .replace(/&/g, '&amp;')
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;')
                .replace(/"/g, '&quot;')
                .replace(/'/g, '&#039;');
        },

        bytesToHex: bytesToHex,

        readValues: function (ids) {
            const out = {};
            ids.forEach(function (id) {
                const el = document.getElementById(id);
                out[id] = el ? el.value : '';
            });
            return out;
        },

        checkState: function (id) {
            const el = document.getElementById(id);
            return el && el.checked ? '1' : '0';
        },

        /**
         * radio 切换显示分组：groups 为 { 选项值: 元素id或id数组 }。
         */
        bindRadioToggle: function (radioName, groups) {
            function toggle() {
                const op = getCheckedRadio(radioName);
                Object.keys(groups).forEach(function (value) {
                    let ids = groups[value];
                    if (!Array.isArray(ids)) {
                        ids = [ids];
                    }
                    ids.forEach(function (id) {
                        const el = document.getElementById(id);
                        if (el) {
                            el.style.display = op === value ? 'flex' : 'none';
                        }
                    });
                });
            }
            document.querySelectorAll('input[name="' + radioName + '"]').forEach(function (radio) {
                radio.addEventListener('change', toggle);
            });
            toggle();
        },

        /**
         * 文件导入：要求页面含 #import-btn[data-accept] 与 #file-name，
         * 选中后回填文件名并把 hex 存入 window.fileHex。
         */
        bindFileImport: function () {
            const importBtn = document.getElementById('import-btn');
            if (!importBtn) {
                return;
            }
            const fileNameInput = document.getElementById('file-name');
            const fileInput = document.createElement('input');
            fileInput.type = 'file';
            fileInput.accept = importBtn.getAttribute('data-accept') || '';
            fileInput.style.display = 'none';
            document.body.appendChild(fileInput);

            importBtn.addEventListener('click', function () {
                fileInput.click();
            });
            fileInput.addEventListener('change', function (event) {
                const file = event.target.files[0];
                if (!file) {
                    return;
                }
                if (fileNameInput) {
                    fileNameInput.value = file.name;
                }
                const reader = new FileReader();
                reader.onload = function (e) {
                    window.fileHex = bytesToHex(new Uint8Array(e.target.result));
                };
                reader.onerror = function () {
                    console.error('文件读取失败');
                };
                reader.readAsArrayBuffer(file);
            });
        },
    };

    window.__xmView = xmView;
})();
