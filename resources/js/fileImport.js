(function () {
    var importBtn = document.getElementById('import-btn');
    if (!importBtn) return;

    var accept = importBtn.getAttribute('data-accept');

    var fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.id = 'file-input';
    fileInput.accept = accept;
    fileInput.style.display = 'none';
    document.body.appendChild(fileInput);

    var fileNameInput = document.getElementById('file-name');

    importBtn.addEventListener('click', function () {
        fileInput.click();
    });

    fileInput.addEventListener('change', function (event) {
        var file = event.target.files[0];
        if (!file) return;

        if (fileNameInput) {
            fileNameInput.value = file.name;
        }

        var reader = new FileReader();
        reader.onload = function (e) {
            var bytes = new Uint8Array(e.target.result);
            var hex = '';
            for (var i = 0; i < bytes.length; i++) {
                hex += bytes[i].toString(16).padStart(2, '0').toUpperCase();
            }
            window.fileHex = hex;
        };
        reader.onerror = function () {
            console.error('文件读取失败');
        };
        reader.readAsArrayBuffer(file);
    });
})();