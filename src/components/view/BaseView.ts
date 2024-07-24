import { cloneTemplate } from '../../utils/utils';

export abstract class BaseView {
	element: HTMLElement;

	priceCurrencyString = 'синапсов';

	constructor(element: HTMLElement) {
		if (element instanceof HTMLTemplateElement) {
			this.element = cloneTemplate(element);
		} else {
			this.element = element;
		}
	}

	render(data: object): HTMLElement {
		if (typeof data === 'object') {
			Object.assign(this, data);
		}
		return this.element;
	}
}
