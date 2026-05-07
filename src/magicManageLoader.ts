import * as vscode from 'vscode';

export interface MagicManageData {
	portLimit: string;
	versionMajor: string;
	versionMinor: string;
	apiParam: string;
	versionCheck1: string;
	versionCheck2: string;
	blacklist: string;
	appid: string;
	sponsorDays: string;
}

export function parseMagicManage(content: string): MagicManageData | null {
	const match = content.match(/^魔法管理=\{(.+)\}$/);
	if (!match) {return null;}
	
	const pairs = match[1].split('|');
	const data: MagicManageData = {
		portLimit: '0',
		versionMajor: '0',
		versionMinor: '1',
		apiParam: '',
		versionCheck1: '0',
		versionCheck2: '0',
		blacklist: '',
		appid: '',
		sponsorDays: '1',
	};
	
	for (const pair of pairs) {
		const [key, value] = pair.split('=');
		if (!key || value === undefined) {continue;}
		
		switch (key) {
			case '端口限制':
				data.portLimit = value;
				break;
			case '当前版本':
				const [major, minor] = value.split('.');
				data.versionMajor = major || '0';
				data.versionMinor = minor || '1';
				break;
			case '接口参数':
				data.apiParam = value;
				break;
			case '版本控制1':
				data.versionCheck1 = value === '1' ? '1' : '0';
				break;
			case '版本控制2':
				data.versionCheck2 = value === '1' ? '1' : '0';
				break;
			case '本地黑名单':
				data.blacklist = value;
				break;
			case 'Appid':
				data.appid = value;
				break;
			case '赞助免费':
				data.sponsorDays = value;
				break;
		}
	}
	
	return data;
}

export function loadMagicManageFromFile(): MagicManageData | null {
	const editor = vscode.window.activeTextEditor;
	if (!editor || !editor.document.fileName.endsWith('.xm')) {return null;}
	
	const firstLine = editor.document.lineAt(0).text.trim();
	if (!firstLine.startsWith('魔法管理=')) {return null;}
	
	return parseMagicManage(firstLine);
}