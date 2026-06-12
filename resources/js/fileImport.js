(function () {
    const importBtn = document.getElementById('import-btn');
    if (!importBtn) return;

    const accept = importBtn.getAttribute('data-accept');
    let fileDataCache = null;

    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.id = 'file-input';
    fileInput.accept = accept;
    fileInput.style.display = 'none';
    document.body.appendChild(fileInput);

    const fileNameInput = document.getElementById('file-name');

    importBtn.addEventListener('click', function () {
        fileInput.click();
    });

    fileInput.addEventListener('change', function (event) {
        const file = event.target.files[0];
        if (!file) return;

        if (fileNameInput) {
            fileNameInput.value = file.name;
        }

        const reader = new FileReader();
        reader.onload = function (e) {
            const bytes = new Uint8Array(e.target.result);
            fileDataCache = {
                name: file.name,
                hex: __xmUtils.bytesToHex(bytes),
            };
            window.fileHex = fileDataCache.hex;
        };
        reader.onerror = function () {
            console.error('文件读取失败');
        };
        reader.readAsArrayBuffer(file);
    });

    window.__xmFileImport = {
        getFileData: function () {
            return fileDataCache;
        },
    };
})();
