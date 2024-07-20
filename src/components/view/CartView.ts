import { ensureElement } from '../../utils/utils';
import { BaseView } from './BaseView';

interface ICartViewAction {
	onClick: () => void;
}

export class CartView extends BaseView {
	protected _list: HTMLElement;
	protected _button: HTMLButtonElement;
	protected _total: HTMLElement;

	constructor(template: HTMLTemplateElement, action: ICartViewAction) {
		super(template);

		this._list = ensureElement<HTMLElement>('.basket__list', this.element);
		this._button = ensureElement<HTMLElement>(
			'.basket__button',
			this.element
		) as HTMLButtonElement;
		this._total = ensureElement<HTMLElement>('.basket__price', this.element);

		this._button.addEventListener('click', action.onClick);
	}

	set list(items: HTMLElement[]) {
		this._list.replaceChildren(...items);
		if (this._list.childElementCount > 0) {
			this._button.disabled = false;
		} else {
			this._button.disabled = true;
		}
	}

	set total(total: number) {
		this._total.textContent = `${total} ${this.priceCurrencyString}`;
	}
}
