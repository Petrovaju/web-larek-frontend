import { IProduct } from '../../types';

import { IEvents } from '../base/events';

export class CatalogModel {
	protected _products: IProduct[];

	constructor(protected events: IEvents) {
		this._products = [];
	}

	set products(products: IProduct[]) {
		this._products = products;
		this.events.emit('products:receive');
	}

	get products(): IProduct[] {
		return this._products;
	}
}
