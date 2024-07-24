import { IProduct, ICart } from '../../types';

export class CartModel implements ICart {
	protected _products: IProduct[];

	constructor() {
		this._products = [];
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

	resetItems() {
		this._products = [];
	}
}
