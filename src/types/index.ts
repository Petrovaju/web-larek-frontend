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
	total: number;
	paymentMethod: string;
	address: string;
	phoneNumber: string;
	addProduct: (product: IProduct) => void;
	deleteProduct: (product: IProduct) => void;
	setPaymentMethod: (paymentMethod: string) => void;
	setAddress: (address: string) => void;
	setPhoneNumber: (phoneNumber: string) => void;
}

export interface IView {
	element: HTMLElement;
	render: (view: unknown) => HTMLElement;
}

export interface IViewConstructor {
	new: (view: IView) => IView;
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
