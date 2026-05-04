import * as vscode from 'vscode';
import { BaseView } from './baseView';

export class PlaceholderView extends BaseView {
	constructor(title: string, context: vscode.ExtensionContext) {
		super(context);
		this.title = title;
	}

	private title: string;

	getContent(): string {
		return `<p class="placeholder">${this.title} - Coming soon...</p>`;
	}
}