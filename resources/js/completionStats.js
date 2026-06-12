(function () {
    const vscode = acquireVsCodeApi();

    function renderStats(stats, total) {
        const title = document.querySelector('.title');
        const countSpan = '<span class="count">' + total + '</span>';
        if (total > 0) {
            title.innerHTML = '补全已使用 ' + countSpan + ' 次';
        } else {
            title.textContent = '暂无使用记录';
        }

        const statsList = document.querySelector('.stats-list');
        const resetBtn = document.getElementById('resetBtn');
        if (stats && stats.length > 0) {
            let html = '';
            for (let i = 0; i < stats.length; i++) {
                const s = stats[i];
                html +=
                    '<div class="stats-item">' +
                    '<span class="stats-key">' +
                    __xmUtils.escapeHtml(s.key) +
                    '</span>' +
                    '<span class="stats-count">' +
                    s.count +
                    '</span>' +
                    '</div>';
            }
            statsList.innerHTML = html;
            resetBtn.disabled = false;
        } else {
            statsList.innerHTML = '';
            resetBtn.disabled = true;
        }
    }

    document.getElementById('resetBtn').addEventListener('click', function () {
        vscode.postMessage({ command: 'reset' });
    });

    window.addEventListener('message', function (event) {
        if (event.data.command === 'refresh') {
            renderStats(event.data.stats, event.data.total);
        }
    });

    window.addEventListener('load', function () {
        vscode.postMessage({ command: 'load' });
    });
})();
