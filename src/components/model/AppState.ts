import { IProduct } from '../../types';
import { IEvents } from '../base/events';

export class AppState {
	protected _products: IProduct[];

	selectedProduct: IProduct;

	constructor(protected events: IEvents) {
		this._products = [];
	}
	set products(products: IProduct[]) {
		this._products = products;
		this.events.emit('products:receive');
	}
	get products() {
		return this._products;
	}

	setPreview(product: IProduct) {
		this.selectedProduct = product;
		this.events.emit('modalProduct:open', product);
	}
}
