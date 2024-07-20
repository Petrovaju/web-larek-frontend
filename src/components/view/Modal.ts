import { ensureElement } from '../../utils/utils';
import { BaseView } from './BaseView';

export class Modal extends BaseView {
	protected closeButton: HTMLButtonElement;
	protected _content: HTMLElement;

	constructor(container: HTMLElement) {
		super(container);
		this.closeButton = ensureElement<HTMLButtonElement>(
			'.modal__close',
			this.element
		);
		this._content = ensureElement<HTMLElement>('.modal__content', this.element);

		this.closeButton.addEventListener('click', this.close.bind(this));
		this.element.addEventListener('click', this.close.bind(this));
		this.element
			.querySelector('.modal__container')
			.addEventListener('click', (event) => event.stopPropagation());
	}

	set content(value: HTMLElement) {
		this._content.replaceChildren(value);
	}

	open() {
		this.element.classList.add('modal_active');
	}

	close() {
		this.element.classList.remove('modal_active');
		this.content = null;
	}

	render(): HTMLElement {
		this._content;
		this.open();
		return this.element;
	}
}
