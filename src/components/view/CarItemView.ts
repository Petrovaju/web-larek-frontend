import { ensureElement } from '../../utils/utils';
import { BaseView } from './BaseView';

interface ICartItemAction {
	onClick: () => void;
}

export class CartItemView extends BaseView {
	protected _indexElement: HTMLSpanElement;
	protected _titleElement: HTMLElement;
	protected _priceElement: HTMLElement;
	protected _buttonElement: HTMLButtonElement;

	constructor(
		template: HTMLTemplateElement,
		action: ICartItemAction,
		idx: number
	) {
		super(template);

		this._indexElement = ensureElement<HTMLSpanElement>(
			'.basket__item-index',
			this.element
		);
		this._titleElement = ensureElement<HTMLElement>(
			'.card__title',
			this.element
		);
		this._priceElement = ensureElement<HTMLElement>(
			'.card__price',
			this.element
		);
		this._buttonElement = ensureElement<HTMLButtonElement>(
			'.card__button',
			this.element
		);

		this._indexElement.textContent = String(idx);

		this._buttonElement.addEventListener('click', action.onClick);
	}

	set price(price: number) {
		this._priceElement.textContent = `${price} ${this.priceCurrencyString}`;
	}

	set title(title: string) {
		this._titleElement.textContent = title;
	}
}
