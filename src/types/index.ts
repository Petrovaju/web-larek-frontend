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
	addProduct: (product: IProduct) => void;
	deleteProduct: (product: IProduct) => void;
	setPaymentMethod: (paymentMethod: string) => void;
	setAddress: (address: string) => void;
	setPhoneNumber: (phoneNumber: string) => void;
    getItemsTotal: () => number;
    getItemsCount: () => number;
    isValid: () => boolean;
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

export interface IAppState{
    catalog: IProduct[];
    basket: string[];
    preview: string;
    cart: ICart;
}