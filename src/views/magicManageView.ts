import * as vscode from 'vscode';
import { BaseView } from './baseView';
import { createRadioGroup, createTextInput, createCheckboxGroup, checkXmFile, insertTextAtLine } from '../utils';

export class MagicManageView extends BaseView {
	getContent(): string {
		const portLimitHtml = createRadioGroup('port-limit', [
			{ value: '0', label: '不限', checked: true },
			{ value: '1', label: '限Unity端' },
			{ value: '2', label: '限Flash端' },
		], true);
		
		const versionWrapper = `
		<div class="version-wrapper">
			<input type="number" id="version-major" value="0" class="version-input" />
			<span class="version-dot">.</span>
			<input type="number" id="version-minor" value="1" class="version-input" />
		</div>`;
		
		const apiParamHtml = createTextInput({ id: 'api-param' });
		const versionCheckHtml = createCheckboxGroup([
			{ id: 'version-check1', label: '当魔法版本小于接口返回的版本号时，禁止运行', checked: true },
			{ id: 'version-check2', label: '当接口参数获取最新版本数据失败时，允许运行' },
		]);
		const blacklistHtml = createTextInput({ id: 'blacklist' });
		const appidHtml = createTextInput({ id: 'appid' });
		const sponsorDaysHtml = createTextInput({ id: 'sponsor-days', value: '1', type: 'number' });
		
		return `
	<div class="container">
		<div class="input-group">
			<span class="label">端口限制</span>
			${portLimitHtml}
		</div>
		<div class="input-group">
			<span class="label">当前版本</span>
			${versionWrapper}
		</div>
		<div class="input-group">
			<span class="label">接口参数</span>
			${apiParamHtml}
		</div>
		<div class="input-group">
			<span class="label">版本控制</span>
			${versionCheckHtml}
		</div>
		<div class="input-group">
			<span class="label">本地黑名单</span>
			${blacklistHtml}
		</div>
		<div class="input-group">
			<span class="label">Appid</span>
			${appidHtml}
		</div>
		<div class="input-group">
			<span class="label">赞助用户到设置天数前可免费使用</span>
			${sponsorDaysHtml}
		</div>
		<button id="add-btn" class="btn-block">添加</button>
	</div>
	<script>
		const vscode = acquireVsCodeApi();
		document.getElementById('add-btn').addEventListener('click', () => {
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
				portLimit,
				versionMajor,
				versionMinor,
				apiParam,
				versionCheck1,
				versionCheck2,
				blacklist,
				appid,
				sponsorDays
			});
		});
	</script>`;
	}

	protected handleMessage(message: any): void {
		if (!checkXmFile()) {return;}
		
		if (message.command === 'magic-manage') {
			const output = `魔法管理={端口限制=${message.portLimit}|当前版本=${message.versionMajor}.${message.versionMinor}|接口参数=${message.apiParam}|接口类型=0|版本控制1=${message.versionCheck1}|版本控制2=${message.versionCheck2}|本地黑名单=${message.blacklist}|Appid=${message.appid}|赞助免费=${message.sponsorDays}}`;
			insertTextAtLine(output, 0);
		}
	}
}