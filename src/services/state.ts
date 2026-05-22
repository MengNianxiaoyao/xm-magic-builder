import * as vscode from 'vscode';

export class StateService {
    constructor(private context: vscode.ExtensionContext) {}

    get<T>(key: string, defaultValue: T): T {
        return this.context.globalState.get<T>(key, defaultValue);
    }

    async update(key: string, value: unknown): Promise<void> {
        await this.context.globalState.update(key, value);
    }

    async delete(key: string): Promise<void> {
        await this.context.globalState.update(key, undefined);
    }
}
