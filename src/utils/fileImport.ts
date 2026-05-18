export function createFileImportHtml(options: {
    fileInputId: string;
    fileNameInputId: string;
    importButtonId: string;
    accept: string;
}): string {
    return `
	<input type="file" id="${options.fileInputId}" accept="${options.accept}" style="display: none;" />`;
}

export function createFileImportScript(options: {
    fileInputId: string;
    fileNameInputId: string;
    importButtonId: string;
    variableName: string;
}): string {
    return `
	let ${options.variableName} = '';

	document.getElementById('${options.importButtonId}').addEventListener('click', () => {
		document.getElementById('${options.fileInputId}').click();
	});

	document.getElementById('${options.fileInputId}').addEventListener('change', (e) => {
		const file = e.target.files[0];
		if (file) {
			document.getElementById('${options.fileNameInputId}').value = file.name;
			const reader = new FileReader();
			reader.onload = function(event) {
				const bytes = new Uint8Array(event.target.result);
				let hex = '';
				for (let i = 0; i < bytes.length; i++) {
					hex += bytes[i].toString(16).padStart(2, '0').toUpperCase();
				}
				${options.variableName} = hex.replace(/0+$/, '');
			};
			reader.readAsArrayBuffer(file);
		}
	});`;
}

export function getFileImportWarning(): string {
    return '请先导入文件';
}

export function validateFileImport(fileName: string, fileHex: string): boolean {
    return !!(fileName && fileHex);
}
