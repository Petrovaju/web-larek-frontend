import { ensureElement } from '../../utils/utils';
import { IEvents } from '../base/events';
import { BaseView } from './BaseView';

interface IContactsAction {
	onClick: (evt: Event) => void;
}

export class ContactsView extends BaseView {
	protected _emailInput: HTMLInputElement;
	protected _phoneInput: HTMLInputElement;
	protected _button: HTMLButtonElement;
	protected _errorContainer: HTMLElement;
	protected _events: IEvents;
	element: HTMLFormElement;

	constructor(
		template: HTMLTemplateElement,
		events: IEvents,
		action: IContactsAction
	) {
		super(template);

		this.element = this.element as HTMLFormElement;

		this._events = events;

		this._emailInput = ensureElement<HTMLInputElement>(
			'[name="email"]',
			this.element
		);
		this._phoneInput = ensureElement<HTMLInputElement>(
			'[name="phone"]',
			this.element
		);

		this._button = ensureElement<HTMLButtonElement>('.button', this.element);

		this._errorContainer = ensureElement<HTMLElement>(
			'.form__errors',
			this.element
		);

		this._button.addEventListener('click', action.onClick);

		this._emailInput.addEventListener('input', (e: Event) => {
			const target = e.target as HTMLInputElement;
			this._emailInput.textContent = target.value;
			events.emit('contactsForm.emailInput:change', { value: target.value });
		});

		this._phoneInput.addEventListener('input', (e: Event) => {
			const target = e.target as HTMLInputElement;
			this._phoneInput.textContent = target.value;
			events.emit('contactsForm.phoneInput:change', {
				value: target.value,
			});
		});
	}

	set valid(valid: boolean) {
		this._button.disabled = !valid;
	}

	set error(errorText: string) {
		this._errorContainer.textContent = errorText;
	}

	reset() {
		this.element.reset();
		this.valid = false;
		this.error = '';
	}
}
