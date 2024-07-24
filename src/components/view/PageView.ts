import { ensureElement } from '../../utils/utils';
import { IEvents } from '../base/events';
import { BaseView } from './BaseView';

export class PageView extends BaseView {
	protected _counter: HTMLElement;
	protected _catalog: HTMLElement;
	protected _cart: HTMLElement;
	protected _wrapper: HTMLElement;

	constructor(element: HTMLElement, protected readonly events: IEvents) {
		super(element);
		this._counter = ensureElement<HTMLElement>(
			'.header__basket-counter',
			this.element
		);
		this._catalog = ensureElement<HTMLElement>('.gallery', this.element);
		this._cart = ensureElement<HTMLElement>('.header__basket', this.element);
		this._wrapper = ensureElement<HTMLElement>('.page__wrapper', this.element);

		this._cart.addEventListener('click', () => {
			this.events.emit('cart:open');
		});
	}

	set counter(counter: number) {
		this._counter.textContent = String(counter);
	}

	set catalog(items: HTMLElement[]) {
		this._catalog.replaceChildren(...items);
	}

	set locked(isLocked: boolean) {
		isLocked
			? this._wrapper.classList.add('page__wrapper_locked')
			: this._wrapper.classList.remove('page__wrapper_locked');
	}
}
