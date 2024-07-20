import { IProduct } from '../../types';

export class CartModel {
	paymentMethod: string;
	address: string;
	phoneNumber: string;
	email: string;
	constructor(
		protected _products?: IProduct[],
		paymentMethod?: string,
		address?: string,
		phoneNumber?: string,
		email?: string
	) {
		this._products = [];
		this.paymentMethod = paymentMethod || '';
		this.address = address || '';
		this.phoneNumber = phoneNumber || '';
		this.email = email || '';
	}

	addProduct(product: IProduct) {
		if (
			!this._products.find((el) => {
				return el.id === product.id;
			})
		) {
			this._products.push(product);
		}
	}

	get products(): IProduct[] {
		return this._products;
	}

	deleteProduct(product: IProduct) {
		this._products = this._products.filter((el: IProduct) => {
			return el.id != product.id;
		});
	}

	getItemsCount(): number {
		return this._products.length;
	}

	getItemsTotal(): number {
		return this._products.reduce((acc, item) => acc + item.price, 0);
	}

    resetItems(){
        this._products = []
    }
}
