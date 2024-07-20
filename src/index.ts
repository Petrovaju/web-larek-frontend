import { EventEmitter } from './components/base/events';
import { CDN_URL, API_URL } from './utils/constants';
import './scss/styles.scss';
import { ApiProductsModel } from './components/model/ApiProductsModel';
import { AppState } from './components/model/AppState';
import { ProductView } from './components/view/ProductView';
import { ensureElement } from './utils/utils';
import { IProduct } from './types';
import { Modal } from './components/view/Modal';
import { CartModel } from './components/model/CartModel';
import { CartView } from './components/view/CartView';
import { PageView } from './components/view/PageView';
import { AddressView, IAdressState } from './components/view/AddressView';
import { ContactsView, IContactsState } from './components/view/ContactsView';
import { SuccessView } from './components/view/SuccessView';
import { ApiOrderModel } from './components/model/ApiOrderModel';

const addressTemplate = ensureElement<HTMLTemplateElement>('#order');

const cartItemTemplate = ensureElement<HTMLTemplateElement>('#card-basket');

const productCatalogTemplate =
	ensureElement<HTMLTemplateElement>('#card-catalog');
const productPreviewTemplate =
	ensureElement<HTMLTemplateElement>('#card-preview');
const contactsTemplate = ensureElement<HTMLTemplateElement>('#contacts');
const successTemplate = ensureElement<HTMLTemplateElement>('#success');
const modalContainer = ensureElement<HTMLElement>('#modal-container');
const cartTemplate = ensureElement<HTMLTemplateElement>('#basket');

const events = new EventEmitter();
const apiProductsModel = new ApiProductsModel(CDN_URL, API_URL);
const apiOrderModel = new ApiOrderModel(API_URL);
const cartModel = new CartModel();
const appState = new AppState(events);
const modal = new Modal(modalContainer);
const pageView = new PageView(document.body, events);
const successView = new SuccessView(successTemplate, {
	onClick: () => {
		events.emit('modal:close');
	},
});
const contactsView = new ContactsView(contactsTemplate, events, {
	onClick: (evt: Event) => {
		evt.preventDefault();
		apiOrderModel
			.postOrder(cartModel)
			.then(() => {
				events.emit('order:success');
			})
			.catch((error) => console.log(error));
	},
});
const addressView = new AddressView(
	addressTemplate,
	{
		onClick: () => {
			events.emit('contacts:open');
		},
	},
	events
);
const cartView = new CartView(cartTemplate, {
	onClick: () => {
		events.emit('address:open');
	},
});

events.on('products:receive', () => {
	pageView.catalog = appState.products.map<HTMLElement>((product: IProduct) => {
		const productView = new ProductView(productCatalogTemplate, {
			onClick: () => {
				events.emit('product:select', product);
			},
		});

		return productView.render(product);
	});
});

events.on('modalProduct:open', (product: IProduct) => {
	const cardPreview = new ProductView(productPreviewTemplate, {
		onClick: () => {
			events.emit('product:addToCart', product);
			events.emit('modal:close');
		},
	});
	modal.content = cardPreview.render(product);
	events.emit('modal:open');
});

events.on('product:select', (product: IProduct) => {
	appState.setPreview(product);
});

events.on('product:addToCart', (product: IProduct) => {
	cartModel.addProduct(product);
	pageView.counter = cartModel.getItemsCount();
});

events.on('product:deleteFromCart', (product: IProduct) => {
	cartModel.deleteProduct(product);
	pageView.counter = cartModel.getItemsCount();
	cartView.total = cartModel.getItemsTotal();
	cartView.list = cartModel.products.map<HTMLElement>((product: IProduct) => {
		const view = new ProductView(cartItemTemplate, {
			onClick: () => {
				events.emit('product:deleteFromCart', product);
			},
		});
		return view.render(product);
	});
});

events.on('cart:open', () => {
	cartView.list = cartModel.products.map<HTMLElement>((product: IProduct) => {
		const view = new ProductView(cartItemTemplate, {
			onClick: () => {
				events.emit('product:deleteFromCart', product);
			},
		});
		return view.render(product);
	});
	cartView.total = cartModel.getItemsTotal();
	modal.content = cartView.render({});
	events.emit('modal:open');
});

events.on('address:change', (adressState: IAdressState) => {
	cartModel.address = adressState.address;
	cartModel.paymentMethod = adressState.paymentMethod;
	addressView.validate();
});

events.on('contacts:change', (contactsState: IContactsState) => {
	cartModel.email = contactsState.email;
	cartModel.phoneNumber = contactsState.phone;
	contactsView.validate();
});

events.on('forms:reset', () => {
	addressView.reset();
	contactsView.reset();
});

events.on('order:success', () => {
	successView.total = cartModel.getItemsTotal();
	cartModel.resetItems();
	pageView.counter = cartModel.getItemsCount();
	events.emit('forms:reset');
	modal.content = successView.render({});
});

events.on('contacts:open', () => {
	modal.content = contactsView.render({});
});

events.on('address:open', () => {
	modal.content = addressView.render({});
});

events.on('modal:open', () => {
	modal.open();
});

events.on('modal:close', () => {
	modal.close();
});

apiProductsModel
	.getProductList()
	.then((data: IProduct[]) => {
		appState.products = data;
	})
	.catch((error) => console.log(error));
