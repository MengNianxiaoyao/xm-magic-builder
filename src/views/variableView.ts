import * as vscode from 'vscode';
import { BaseView } from './baseView';

export class VariableView extends BaseView {
	getContent(): string {
		return `<p class="placeholder">暂未完成</p>`;
	}
}