import { ensureElement } from '../../utils/utils';
import { BaseView } from './BaseView';

interface ISuccessViewAction {
	onClick: () => void;
}

export class SuccessView extends BaseView {
	protected _total: HTMLElement;
	protected _button: HTMLButtonElement;

	constructor(template: HTMLTemplateElement, action: ISuccessViewAction) {
		super(template);

		this._total = ensureElement<HTMLElement>(
			'.order-success__description',
			this.element
		);
		this._button = ensureElement<HTMLButtonElement>('.button', this.element);
		this._button.addEventListener('click', action.onClick);
	}

	set total(total: number) {
		this._total.textContent = `Списано ${total} ${this.priceCurrencyString}`;
	}
}
