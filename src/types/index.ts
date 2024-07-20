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
	paymentMethod: string;
	address: string;
	phoneNumber: string;
	email: string;
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
