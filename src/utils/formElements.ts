export function createInputRow(inputs: { id: string; type: string; placeholder?: string; value?: string }[], buttons: { id: string; text: string }[]): string {
	const inputsHtml = inputs.map(i => `<input type="${i.type}" id="${i.id}" placeholder="${i.placeholder || ''}" value="${i.value || ''}" />`).join('');
	const buttonsHtml = buttons.map(b => `<button id="${b.id}">${b.text}</button>`).join('');
	
	return `
	<div class="input-row">
		${inputsHtml}
		${buttonsHtml}
	</div>`;
}

export function createRadioGroup(name: string, options: { value: string; label: string; checked?: boolean }[], inline: boolean = false, columns: number = 0): string {
	const optionsHtml = options.map(o => `
		<label class="radio-label">
			<input type="radio" name="${name}" value="${o.value}" ${o.checked ? 'checked' : ''} />
			<span>${o.label}</span>
		</label>`).join('');
	
	const style = columns > 0 ? `style="display: flex; flex-wrap: wrap; gap: 8px 16px;"` : '';
	return `
	<div class="radio-group ${inline ? 'inline' : ''}" ${style}>
		${optionsHtml}
	</div>`;
}

export function createButtonRow(buttons: { id: string; text: string }[], columns: number = 0): string {
	const buttonsHtml = buttons.map(b => `<button id="${b.id}">${b.text}</button>`).join('');
	const style = columns > 0 ? `style="display: flex; flex-wrap: wrap; gap: 8px 16px;"` : '';
	return `<div class="btn-row" ${style}>${buttonsHtml}</div>`;
}

export function createCheckboxGroup(checkboxes: { id: string; label: string; checked?: boolean }[]): string {
	const checkboxesHtml = checkboxes.map(c => `
		<label class="checkbox-label">
			<input type="checkbox" id="${c.id}" ${c.checked ? 'checked' : ''} />
			<span>${c.label}</span>
		</label>`).join('');
	
	return `
	<div class="checkbox-group">
		${checkboxesHtml}
	</div>`;
}

export function createTextInput(options: { id: string; placeholder?: string; value?: string; type?: string; readonly?: boolean }): string {
	const readonlyAttr = options.readonly ? 'readonly' : '';
	return `<input type="${options.type || 'text'}" id="${options.id}" placeholder="${options.placeholder || ''}" value="${options.value || ''}" ${readonlyAttr} />`;
}

export function createTextarea(options: { id: string; placeholder?: string; value?: string; rows?: number }): string {
	return `<textarea id="${options.id}" placeholder="${options.placeholder || ''}" rows="${options.rows || 3}">${options.value || ''}</textarea>`;
}

export function createSelect(options: { id: string; options: { value: string; label: string }[] }): string {
	const optionsHtml = options.options.map((o: { value: string; label: string }) => `<option value="${o.value}">${o.label}</option>`).join('');
	return `<select id="${options.id}">${optionsHtml}</select>`;
}