import type { FieldDescriptor, ActionDescriptor } from '../shared/types';

export function renderField(field: FieldDescriptor): string {
    switch (field.type) {
        case 'text':
        case 'number':
            return renderInput(field);
        case 'textarea':
            return renderTextarea(field);
        case 'select':
            return renderSelect(field);
        case 'radio':
            return renderRadioGroup(field);
        case 'checkbox':
            return renderCheckboxGroup(field);
        case 'html':
            return field.html || '';
        default:
            return '';
    }
}

function renderInput(field: FieldDescriptor): string {
    const readonlyAttr = field.readonly ? 'readonly' : '';
    const type = field.type === 'number' ? 'number' : 'text';
    return `<input type="${type}" id="${field.id}" placeholder="${field.placeholder || ''}" value="${field.value || ''}" ${readonlyAttr} />`;
}

function renderTextarea(field: FieldDescriptor): string {
    return `<textarea id="${field.id}" placeholder="${field.placeholder || ''}" rows="${field.rows || 3}">${field.value || ''}</textarea>`;
}

function renderSelect(field: FieldDescriptor): string {
    const optionsHtml = (field.options || []).map((o) => `<option value="${o.value}">${o.label}</option>`).join('');
    return `<select id="${field.id}">${optionsHtml}</select>`;
}

function renderRadioGroup(field: FieldDescriptor): string {
    const optionsHtml = (field.options || [])
        .map(
            (o) =>
                `<label class="radio-label">
                    <input type="radio" name="${field.name}" value="${o.value}" ${o.checked ? 'checked' : ''} />
                    <span>${o.label}</span>
                </label>`
        )
        .join('');

    const style = field.columns && field.columns > 0 ? `style="display: flex; flex-wrap: wrap; gap: 8px 16px;"` : '';
    return `<div class="radio-group" ${style}>${optionsHtml}</div>`;
}

function renderCheckboxGroup(field: FieldDescriptor): string {
    const checkboxesHtml = (field.options || [])
        .map(
            (c) =>
                `<label class="checkbox-label">
                    <input type="checkbox" id="${c.value}" ${c.checked ? 'checked' : ''} />
                    <span>${c.label}</span>
                </label>`
        )
        .join('');
    return `<div class="checkbox-group">${checkboxesHtml}</div>`;
}

function buildActionAttrs(action: ActionDescriptor): string {
    const attrs = [`data-command="${action.command}"`];
    if (action.inputId) {
        attrs.push(`data-input="${action.inputId}"`);
    }
    if (action.inputs) {
        const pairs = Object.entries(action.inputs)
            .map(([elId, propName]) => `${elId}:${propName}`)
            .join(',');
        attrs.push(`data-inputs="${pairs}"`);
    }
    if (action.radio) {
        attrs.push(`data-radio="${action.radio}"`);
    }
    return attrs.join(' ');
}

export function renderActionButton(action: ActionDescriptor): string {
    const cls = action.className || '';
    return `<button id="${action.id}" class="${cls}" ${buildActionAttrs(action)}>${action.text}</button>`;
}

export function renderActionsRow(actions: ActionDescriptor[], style?: string): string {
    const rowStyle = style || 'display: flex; flex-wrap: wrap; gap: 8px 16px;';
    const buttonsHtml = actions.map(renderActionButton).join('\n');
    return `<div class="button-row" style="${rowStyle}">${buttonsHtml}</div>`;
}

export function renderFieldWithLabel(field: FieldDescriptor): string {
    return `<div class="input-group">
        <span class="label">${field.label || ''}</span>
        ${renderField(field)}
    </div>`;
}

export function renderFieldsWrap(
    fields: FieldDescriptor[],
    actions: ActionDescriptor[],
    buttonRowStyle?: string
): string {
    const fieldsHtml = fields
        .map((f) => {
            if (f.type === 'html') {
                return f.html || '';
            }
            return renderFieldWithLabel(f);
        })
        .join('\n');
    return fieldsHtml + '\n' + renderActionsRow(actions, buttonRowStyle);
}
