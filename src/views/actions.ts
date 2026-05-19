import { BaseView } from './baseView';
import { checkXmFile, insertText } from '../utils';

export interface ActionItem {
    id: string;
    text: string;
    command: string;
    /** Single input element ID → reads value into payload.content */
    inputId?: string;
    /** Multiple inputs: { elementId: payloadPropName } */
    inputs?: Record<string, string>;
    /** Radio group: "radioName:payloadProp" → reads checked value */
    radio?: string;
    /** Template when condition property is falsy */
    elseTemplate?: string;
    /** Check this payload property: truthy → template, falsy → elseTemplate */
    condition?: string;
    /** Output template with ${propName} substitution */
    template: string;
    /** Additional CSS class for the button (default: 'btn') */
    className?: string;
}

export function buildActionAttrs(a: ActionItem): string {
    const attrs = [`data-command="${a.command}"`];
    if (a.inputId) {
        attrs.push(`data-input="${a.inputId}"`);
    }
    if (a.inputs) {
        const pairs = Object.entries(a.inputs)
            .map(([elId, propName]) => `${elId}:${propName}`)
            .join(',');
        attrs.push(`data-inputs="${pairs}"`);
    }
    if (a.radio) {
        attrs.push(`data-radio="${a.radio}"`);
    }
    return attrs.join(' ');
}

export function renderActionButton(a: ActionItem): string {
    const cls = a.className || '';
    return `<button id="${a.id}" class="${cls}" ${buildActionAttrs(a)}>${a.text}</button>`;
}

export function renderActionRow(inputHtml: string, action: ActionItem): string {
    return `<div class="input-row">${inputHtml} ${renderActionButton(action)}</div>`;
}

export abstract class SimpleActionView extends BaseView {
    protected abstract getActions(): ActionItem[];

    protected getFormFields(): string {
        return '';
    }

    protected getButtonRowStyle(): string {
        return 'display: flex; flex-wrap: wrap; gap: 8px 16px;';
    }

    protected getScriptPaths(): string[] {
        return ['resources/js/simpleAction.js'];
    }

    getContent(): string {
        const formFields = this.getFormFields();
        const buttonsHtml = this.getActions()
            .map(renderActionButton)
            .join('\n');

        return `
        <div class="container">
            ${formFields}
            <div class="button-row" style="${this.getButtonRowStyle()}">
                ${buttonsHtml}
            </div>
        </div>`;
    }

    protected handleMessage(message: Record<string, string>): void {
        if (!checkXmFile()) {
            return;
        }

        for (const action of this.getActions()) {
            if (message.command === action.command) {
                let tmpl = action.template;
                if (
                    action.condition &&
                    action.elseTemplate &&
                    !message[action.condition]
                ) {
                    tmpl = action.elseTemplate;
                }
                const output = tmpl.replace(
                    /\$\{(\w+)\}/g,
                    (_: string, key: string) => message[key] ?? ''
                );
                void insertText(output);
                return;
            }
        }
    }
}
