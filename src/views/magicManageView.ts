import * as vscode from 'vscode';
import { BaseView } from './baseView';

export class MagicManageView extends BaseView {
	getContent(): string {
		return `
	<div class="container">
		<div class="input-group">
			<span class="label">端口限制</span>
			<div class="radio-group inline">
				<label class="radio-label">
					<input type="radio" name="port-limit" value="0" checked />
					<span>不限</span>
				</label>
				<label class="radio-label">
					<input type="radio" name="port-limit" value="1" />
					<span>限Unity端</span>
				</label>
				<label class="radio-label">
					<input type="radio" name="port-limit" value="2" />
					<span>限Flash端</span>
				</label>
			</div>
		</div>
		<div class="input-group">
			<span class="label">当前版本</span>
			<div class="version-wrapper">
				<input type="number" id="version-major" value="0" class="version-input" />
				<span class="version-dot">.</span>
				<input type="number" id="version-minor" value="1" class="version-input" />
			</div>
		</div>
		<div class="input-group">
			<span class="label">接口参数</span>
			<input type="text" id="api-param" />
		</div>
		<div class="input-group">
			<span class="label">版本控制</span>
			<div class="checkbox-group">
				<label class="checkbox-label">
					<input type="checkbox" id="version-check1" checked />
					<span>当魔法版本小于接口返回的版本号时，禁止运行</span>
				</label>
				<label class="checkbox-label">
					<input type="checkbox" id="version-check2" />
					<span>当接口参数获取最新版本数据失败时，允许运行</span>
				</label>
			</div>
		</div>
		<div class="input-group">
			<span class="label">本地黑名单</span>
			<input type="text" id="blacklist" />
		</div>
		<div class="input-group">
			<span class="label">Appid</span>
			<input type="text" id="appid" />
		</div>
		<div class="input-group">
			<span class="label">赞助用户到设置天数前可免费使用</span>
			<input type="number" id="sponsor-days" value="1" />
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
		if (!this.checkXmFile()) return;
		
		const editor = vscode.window.activeTextEditor;
		if (!editor) return;
		
		if (message.command === 'magic-manage') {
			const output = `魔法管理={端口限制=${message.portLimit}|当前版本=${message.versionMajor}.${message.versionMinor}|接口参数=${message.apiParam}|接口类型=0|版本控制1=${message.versionCheck1}|版本控制2=${message.versionCheck2}|本地黑名单=${message.blacklist}|Appid=${message.appid}|赞助免费=${message.sponsorDays}}`;
			
			const firstLine = editor.document.lineAt(0);
			const isFirstLineMagic = firstLine.text.trim().startsWith('魔法管理=');
			
			editor.edit((builder) => {
				if (isFirstLineMagic) {
					const range = new vscode.Range(0, 0, 0, firstLine.text.length);
					builder.replace(range, output);
				} else {
					const pos = new vscode.Position(0, 0);
					builder.insert(pos, output + '\n');
				}
			});
		}
	}
}