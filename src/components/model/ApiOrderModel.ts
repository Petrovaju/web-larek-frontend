import { ICart, IProduct } from '../../types';
import { Api } from '../base/api';

export class ApiOrderModel extends Api {
	constructor(baseUrl: string, options?: RequestInit) {
		super(baseUrl, options);
	}

	postOrder(data: ICart): Promise<object> {
		const bodyObject = this._mapModelToBodyObject(data);
		return this.post(`/order`, bodyObject).then((response: object) => response);
	}

	_mapModelToBodyObject(data: ICart): object {
		return {
			payment: data.paymentMethod,
			email: data.email,
			phone: data.phoneNumber,
			address: data.address,
			total: data.getItemsTotal(),
			items: data.products.map<string>((product: IProduct) => {
				return product.id;
			}),
		};
	}
}
