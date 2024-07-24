export interface IProduct {
	id: string;
	title: string;
	description: string;
	price: number;
	category: string;
	image: string;
}

export interface ICart {
	products: IProduct[];
	addProduct: (product: IProduct) => void;
	deleteProduct: (product: IProduct) => void;
	getItemsTotal: () => number;
	getItemsCount: () => number;
}

export interface IApiOrder {
	sendOrder: (cart: ICart) => Promise<void>;
}

export interface IApiProductList {
	load: () => Promise<IProduct[]>;
}

export interface IApiProduct {
	load: () => Promise<IProduct>;
}

export interface IFormInputChangeEvent {
	value: string;
}

export interface IAddressState {
	paymentMethod: string;
	address: string;
}

export interface IContactsState {
	email: string;
	phone: string;
}
