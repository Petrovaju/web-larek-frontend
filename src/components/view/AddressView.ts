import { ensureElement } from '../../utils/utils';
import { IEvents } from '../base/events';
import { BaseView } from './BaseView';

interface IAddressAction {
	onClick: () => void;
}

export class AddressView extends BaseView {
	protected _paymentMethodCard: HTMLElement;
	protected _paymentMethodCash: HTMLElement;
	protected _address: HTMLInputElement;
	protected _button: HTMLButtonElement;
	protected _errorContainer: HTMLElement;
	protected _events: IEvents;
	element: HTMLFormElement;

	constructor(
		template: HTMLTemplateElement,
		action: IAddressAction,
		events: IEvents
	) {
		super(template);

		this._events = events;

		this._paymentMethodCard = ensureElement<HTMLElement>(
			'[name="card"]',
			this.element
		);
		this._paymentMethodCash = ensureElement<HTMLElement>(
			'[name="cash"]',
			this.element
		);

		this._address = ensureElement<HTMLInputElement>(
			'.form__input',
			this.element
		);
		this._button = ensureElement<HTMLButtonElement>(
			'.order__button',
			this.element
		);

		this._errorContainer = ensureElement<HTMLElement>(
			'.form__errors',
			this.element
		);

		this._paymentMethodCard.addEventListener('click', () => {
			this._paymentMethodCard.classList.add('button_alt-active');
			this._paymentMethodCash.classList.remove('button_alt-active');
			this._events.emit('paymentMethod:byCardSelected');
		});

		this._paymentMethodCash.addEventListener('click', () => {
			this._paymentMethodCash.classList.add('button_alt-active');
			this._paymentMethodCard.classList.remove('button_alt-active');
			this._events.emit('paymentMethod:byCashSelected');
		});

		this._button.addEventListener('click', action.onClick);
		this._address.addEventListener('input', (e: Event) => {
			const target = e.target as HTMLInputElement;
			this._events.emit('addressForm.addressInput:change', {
				value: target.value,
			});
		});
	}

	set address(address: string) {
		this._address.textContent = address;
	}

	set valid(valid: boolean) {
		this._button.disabled = !valid;
	}

	set error(errorText: string) {
		this._errorContainer.textContent = errorText;
	}

	reset() {
		this.element.reset();
		this._paymentMethodCard.classList.remove('button_alt-active');
		this._paymentMethodCash.classList.remove('button_alt-active');
		this.valid = false;
		this.error = '';
	}
}
