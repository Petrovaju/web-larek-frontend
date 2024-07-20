import { ensureElement } from '../../utils/utils';
import { BaseView } from './BaseView';

interface IProductViewAction {
	onClick: (event: MouseEvent) => void;
}

const pricelessPriceString = 'Бесценно';

export class ProductView extends BaseView {
	protected _category?: HTMLElement;
	protected _title: HTMLElement;
	protected _image?: HTMLImageElement;
	protected _description?: HTMLElement;
	protected _price: HTMLElement;
	protected _button?: HTMLButtonElement;
	protected _categoryColor = <Record<string, string>>{
		дополнительное: 'additional',
		'хард-скил': 'hard',
		'софт-скил': 'soft',
		кнопка: 'button',
		другое: 'other',
	};
	constructor(template: HTMLTemplateElement, action?: IProductViewAction) {
		super(template);
		this._title = ensureElement<HTMLElement>('.card__title', this.element);
		this._price = ensureElement<HTMLElement>('.card__price', this.element);

		this._category = this.element.querySelector('.card__category');
		this._image = this.element.querySelector('.card__image');
		this._description = this.element.querySelector('.card__text');
		this._button = this.element.querySelector('.card__button');

		if (action?.onClick) {
			if (this._button) {
				this._button.addEventListener('click', action.onClick);
			} else {
				this.element.addEventListener('click', action.onClick);
			}
		}
	}


	set title(title: string) {
		this._title.textContent = title;
	}

	get title(): string {
		return this._title.textContent || '';
	}

	set image(path: string) {
		if (this._image) {
			this._image.src = path;
			this._image.alt = this.title;
		}
	}

	set price(price: string) {
		if (price) {
			this._price.textContent = `${price} ${this.priceCurrencyString}`;
		} else {
			this._price.textContent = pricelessPriceString;
		}

		if (this._button) {
			this._button.disabled = !price;
		}
	}

	get price(): string {
		return this._price.textContent || '';
	}

	set category(category: string) {
		if (this._category) {
			this._category.textContent = category;
			this._category?.classList?.forEach(
				(name: string, key: number, parent: DOMTokenList) => {
					if (name.startsWith('card_category')) {
						parent.remove(name);
					}
				}
			);
			this._category?.classList?.add(
				`card__category_${this._categoryColor[category]}`
			);
		}
	}

	get category(): string {
		return this._category.textContent || '';
	}

	set description(description: string) {
		if (this._description) {
			this._description.textContent = description;
		}
	}

	get description(): string {
		return this._description.textContent || '';
	}

	set button(buttonText: string) {
		if (this._button) {
			this._button.textContent = buttonText;
		}
	}
}
