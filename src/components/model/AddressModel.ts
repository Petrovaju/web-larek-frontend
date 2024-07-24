import { IAddressState } from '../../types';

export class AddressModel implements IAddressState {
	protected _paymentMethod: string;
	protected _address: string;
	protected valid: boolean;
	protected error: string;

	set address(address: string) {
		this._address = address;
	}

	get address(): string {
		return this._address;
	}

	set paymentMethod(paymentMethod: string) {
		this._paymentMethod = paymentMethod;
	}

	get paymentMethod(): string {
		return this._paymentMethod;
	}

	get selectedPaymentMethod(): string {
		return this._paymentMethod;
	}

	validate() {
		const paymentValidationResult = this._validatePaymentMethod();
		const adressValidationResult = this._validateAddress();

		if (paymentValidationResult === true && adressValidationResult === true) {
			this.error = '';
			this.valid = true;
		} else {
			this.valid = false;
		}
	}

	_validatePaymentMethod(): boolean {
		if (!this._paymentMethod) {
			this.error = 'Выберите способ оплаты';
			return false;
		}

		return true;
	}

	_validateAddress(): boolean {
		if (!this.address) {
			this.error = 'Укажите адрес';
			return false;
		}

		return true;
	}

	reset() {
		this._paymentMethod = '';
		this._address = '';
		this.error = '';
		this.valid = false;
	}
}
