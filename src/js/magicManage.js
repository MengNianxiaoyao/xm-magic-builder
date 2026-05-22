(function () {
    const vscode = acquireVsCodeApi();

    function loadFromFile() {
        vscode.postMessage({ command: 'load-magic-manage' });
    }

    function setFormValues(data) {
        if (!data) return;

        const portRadios = document.querySelectorAll('input[name="port-limit"]');
        portRadios.forEach(function (radio) {
            radio.checked = radio.value === data.portLimit;
        });

        document.getElementById('version-major').value = data.versionMajor;
        document.getElementById('version-minor').value = data.versionMinor;
        document.getElementById('api-param').value = data.apiParam || '';
        document.getElementById('version-check1').checked = data.versionCheck1 === '1';
        document.getElementById('version-check2').checked = data.versionCheck2 === '1';
        document.getElementById('blacklist').value = data.blacklist || '';
        document.getElementById('appid').value = data.appid || '';
        document.getElementById('sponsor-days').value = data.sponsorDays || '1';
    }

    document.getElementById('add-btn').addEventListener('click', function () {
        const portLimit = document.querySelector('input[name="port-limit"]:checked').value;
        const versionMajor = document.getElementById('version-major').value;
        const versionMinor = document.getElementById('version-minor').value;
        const apiParam = document.getElementById('api-param').value;
        const versionCheck1 = document.getElementById('version-check1').checked ? '1' : '0';
        const versionCheck2 = document.getElementById('version-check2').checked ? '1' : '0';
        const blacklist = document.getElementById('blacklist').value;
        const appid = document.getElementById('appid').value;
        const sponsorDays = document.getElementById('sponsor-days').value;

        vscode.postMessage({
            command: 'magic-manage',
            portLimit: portLimit,
            versionMajor: versionMajor,
            versionMinor: versionMinor,
            apiParam: apiParam,
            versionCheck1: versionCheck1,
            versionCheck2: versionCheck2,
            blacklist: blacklist,
            appid: appid,
            sponsorDays: sponsorDays,
        });
    });

    window.addEventListener('load', loadFromFile);

    window.addEventListener('message', function (event) {
        if (event.data.command === 'magic-manage-loaded') {
            setFormValues(event.data.data);
        }
    });
})();
