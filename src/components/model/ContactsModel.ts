import { IContactsState } from '../../types';

const phoneRegex = /(^8|7|\+7)((\d{10})|(\s\(\d{3}\)\s\d{3}\s\d{2}\s\d{2}))/;
const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g;

export class ContactsModel implements IContactsState {
	protected _email: string;
	protected _phone: string;
	protected valid: boolean;
	protected error: string;

	set email(email: string) {
		this._email = email;
	}

	get email(): string {
		return this._email;
	}

	set phone(phone: string) {
		this._phone = phone;
	}

	get phone(): string {
		return this._phone;
	}

	validate() {
		const validatePhoneResult = this._validatePhone();
		const validateEmailResult = this._validateEmail();

		if (validateEmailResult === true && validatePhoneResult === true) {
			this.error = '';
			this.valid = true;
		} else {
			this.valid = false;
		}
	}

	_validatePhone(): boolean {
		if (!this._phone) {
			this.error = 'Укажите телефон';
			return false;
		} else if (!this._phone.match(phoneRegex)) {
			this.error = 'Некорректный номер телефона';
			return false;
		}

		return true;
	}

	_validateEmail(): boolean {
		if (!this._email) {
			this.error = 'Укажите email';
			return false;
		} else if (!this._email.match(emailRegex)) {
			this.error = 'Некорректный email';
			return false;
		}

		return true;
	}

	reset() {
		this._email = '';
		this._phone = '';
		this.error = '';
		this.valid = false;
	}
}
