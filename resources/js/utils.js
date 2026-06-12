(function () {
    window.__xmUtils = {
        getCheckedRadio: function (name) {
            const el = document.querySelector('input[name="' + name + '"]:checked');
            return el ? el.value : null;
        },

        escapeHtml: function (text) {
            return text
                .replace(/&/g, '&')
                .replace(/</g, '<')
                .replace(/>/g, '>')
                .replace(/"/g, '"')
                .replace(/'/g, '&#039;');
        },

        bytesToHex: function (bytes) {
            return Array.from(bytes, function (b) {
                return b.toString(16).padStart(2, '0').toUpperCase();
            }).join('');
        },
    };
})();
