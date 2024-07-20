import { ensureElement } from '../../utils/utils';
import { IEvents } from '../base/events';
import { BaseView } from './BaseView';

interface IAddressAction {
	onClick: () => void;
}

export interface IAdressState {
	paymentMethod: string;
	address: string;
}

class AdressState {
	paymentMethod: string;
	address: string;

	constructor(paymentMethod: string, address: string) {
		(this.paymentMethod = paymentMethod), (this.address = address);
	}
}

export class AddressView extends BaseView {
	protected _paymentMethodCard: HTMLElement;
	protected _paymentMethodCash: HTMLElement;
	protected _address: HTMLInputElement;
	protected _button: HTMLButtonElement;
	protected _selectedPaymentMethod: string;
	protected _adressState: AdressState;
	protected _events: IEvents;

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
		this._adressState = new AdressState('', '');

		this._paymentMethodCard.addEventListener('click', () => {
			this._paymentMethodCard.classList.add('button_alt-active');
			this._paymentMethodCash.classList.remove('button_alt-active');
			this._adressState.paymentMethod = 'card';
			this._events.emit('address:change', this._adressState);
		});

		this._paymentMethodCash.addEventListener('click', () => {
			this._paymentMethodCash.classList.add('button_alt-active');
			this._paymentMethodCard.classList.remove('button_alt-active');
			this._adressState.paymentMethod = 'cash';
			this._events.emit('address:change', this._adressState);
		});

		this._button.addEventListener('click', action.onClick);
		this._address.addEventListener('input', (e: Event) => {
			const target = e.target as HTMLInputElement;
			this.address = target.value;
		});
	}

	set address(address: string) {
		this._address.textContent = address;
		this._adressState.address = address;
		this._events.emit('address:change', this._adressState);
	}

	validate() {
		if (
			this._adressState.address === '' ||
			this._adressState.paymentMethod === ''
		) {
			this._button.disabled = true;
		} else {
			this._button.disabled = false;
		}
	}

	reset() {
		this._address.value = '';
		this._selectedPaymentMethod = '';
		this._paymentMethodCard.classList.remove('button_alt-active');
		this._paymentMethodCash.classList.remove('button_alt-active');
		this._adressState.address = '';
		this._adressState.paymentMethod = '';
	}
}
