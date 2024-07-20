import { ensureElement } from '../../utils/utils';
import { IEvents } from '../base/events';
import { BaseView } from './BaseView';

export interface IContactsState {
	phone: string;
	email: string;
}

interface IContactsAction {
	onClick: (evt: Event) => void;
}

class ContactsState implements IContactsState {
	phone: string;
	email: string;

	constructor(phone: string, email: string) {
		this.phone = phone;
		this.email = email;
	}
}

export class ContactsView extends BaseView {
	protected _emailInput: HTMLInputElement;
	protected _phoneInput: HTMLInputElement;
	protected _state: IContactsState;
	protected _button: HTMLButtonElement;

	constructor(
		template: HTMLTemplateElement,
		events: IEvents,
		action: IContactsAction
	) {
		super(template);

		this._state = new ContactsState('', '');

		this._emailInput = ensureElement<HTMLInputElement>(
			'[name="email"]',
			this.element
		);
		this._phoneInput = ensureElement<HTMLInputElement>(
			'[name="phone"]',
			this.element
		);

		this._button = ensureElement<HTMLButtonElement>('.button', this.element);

		this._button.addEventListener('click', action.onClick);

		this._emailInput.addEventListener('input', (e: Event) => {
			const target = e.target as HTMLInputElement;
			this._emailInput.textContent = target.value;
			this._state.email = target.value;
			events.emit('contacts:change', this._state);
		});

		this._phoneInput.addEventListener('input', (e: Event) => {
			const target = e.target as HTMLInputElement;
			this._phoneInput.textContent = target.value;
			this._state.phone = target.value;
			events.emit('contacts:change', this._state);
		});
	}

	validate() {
		if (this._state.email === '' || this._state.phone === '') {
			this._button.disabled = true;
		} else {
			this._button.disabled = false;
		}
	}

	reset() {
		this._phoneInput.value = '';
		this._emailInput.value = '';
		this._state.email = '';
		this._state.phone = '';
	}
}
