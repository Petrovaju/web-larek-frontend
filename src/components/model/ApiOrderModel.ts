import { IAddressState, ICart, IContactsState, IProduct } from '../../types';
import { Api } from '../base/api';

export class ApiOrderModel extends Api {
	constructor(baseUrl: string, options?: RequestInit) {
		super(baseUrl, options);
	}

	postOrder(
		productsData: ICart,
		addressData: IAddressState,
		contactsData: IContactsState
	): Promise<object> {
		const bodyObject = this._mapModelsToBodyObject(
			productsData,
			addressData,
			contactsData
		);
		return this.post(`/order`, bodyObject).then((response: object) => response);
	}

	_mapModelsToBodyObject(
		productsData: ICart,
		addressData: IAddressState,
		contactsData: IContactsState
	): object {
		return {
			payment: addressData.paymentMethod,
			email: contactsData.email,
			phone: contactsData.phone,
			address: addressData.address,
			total: productsData.getItemsTotal(),
			items: productsData.products.map<string>((product: IProduct) => {
				return product.id;
			}),
		};
	}
}
