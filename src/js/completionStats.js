(function () {
    var vscode = acquireVsCodeApi();

    function escapeHtml(text) {
        return text
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }

    function renderStats(stats, total) {
        var title = document.querySelector('.title');
        if (total > 0) {
            title.innerHTML = '补全已使用 <span class="count">' + total + '</span> 次';
        } else {
            title.textContent = '暂无使用记录';
        }

        var statsList = document.querySelector('.stats-list');
        if (stats && stats.length > 0) {
            var html = '';
            for (var i = 0; i < stats.length; i++) {
                var s = stats[i];
                html += '<div class="stats-item"><span class="stats-key">' + escapeHtml(s.key) + '</span><span class="stats-count">' + s.count + '</span></div>';
            }
            statsList.innerHTML = html;
            document.getElementById('resetBtn').disabled = false;
        } else {
            statsList.innerHTML = '';
            document.getElementById('resetBtn').disabled = true;
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