import { EventEmitter } from './components/base/events';
import { CDN_URL, API_URL } from './utils/constants';
import './scss/styles.scss';
import { ApiProductsModel } from './components/model/ApiProductsModel';
import { CatalogModel } from './components/model/CatalogModel';
import { ProductView } from './components/view/ProductView';
import { ensureElement } from './utils/utils';
import { IFormInputChangeEvent, IProduct } from './types';
import { Modal } from './components/view/Modal';
import { CartModel } from './components/model/CartModel';
import { CartView } from './components/view/CartView';
import { PageView } from './components/view/PageView';
import { AddressView } from './components/view/AddressView';
import { ContactsView } from './components/view/ContactsView';
import { SuccessView } from './components/view/SuccessView';
import { ApiOrderModel } from './components/model/ApiOrderModel';
import { CartItemView } from './components/view/CarItemView';
import { AddressModel } from './components/model/AddressModel';
import { ContactsModel } from './components/model/ContactsModel';

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
const addressModel = new AddressModel();
const contactsModel = new ContactsModel();
const cartModel = new CartModel();
const catalogState = new CatalogModel(events);
const modal = new Modal(modalContainer, events);
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
			.postOrder(cartModel, addressModel, contactsModel)
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

// Отрисовка каталога
events.on('products:receive', () => {
	pageView.catalog = catalogState.products.map<HTMLElement>((product: IProduct) => {
		const productView = new ProductView(productCatalogTemplate, {
			onClick: () => {
				events.emit('product:select', product);
			},
		});

		return productView.render(product);
	});
});

events.on('modalProduct:open', (product: IProduct) => {
	if (
		cartModel.products.find((p: IProduct) => {
			return p.id === product.id;
		})
	) {
		const cardPreview = new ProductView(productPreviewTemplate, {
			onClick: () => {
				events.emit('product:deleteFromCart', product);
				events.emit('modal:close');
			},
		});

		cardPreview.buttonText = 'Убрать из корзины';
		modal.content = cardPreview.render(product);
	} else {
		const cardPreview = new ProductView(productPreviewTemplate, {
			onClick: () => {
				events.emit('product:addToCart', product);
				events.emit('modal:close');
			},
		});

		modal.content = cardPreview.render(product);
	}

	events.emit('modal:open');
});

events.on('product:select', (product: IProduct) => {
	events.emit('modalProduct:open', product);
});

events.on('product:addToCart', (product: IProduct) => {
	cartModel.addProduct(product);
	pageView.counter = cartModel.getItemsCount();
});

events.on('product:deleteFromCart', (product: IProduct) => {
	cartModel.deleteProduct(product);
	pageView.counter = cartModel.getItemsCount();
	cartView.total = cartModel.getItemsTotal();
	cartView.list = cartModel.products.map<HTMLElement>(
		(product: IProduct, idx: number) => {
			const view = new CartItemView(
				cartItemTemplate,
				{
					onClick: () => {
						events.emit('product:deleteFromCart', product);
					},
				},
				idx + 1
			);
			return view.render(product);
		}
	);
});

events.on('cart:open', () => {
	cartView.list = cartModel.products.map<HTMLElement>(
		(product: IProduct, idx: number) => {
			const view = new CartItemView(
				cartItemTemplate,
				{
					onClick: () => {
						events.emit('product:deleteFromCart', product);
					},
				},
				idx + 1
			);
			return view.render(product);
		}
	);
	cartView.total = cartModel.getItemsTotal();
	modal.content = cartView.render({});
	events.emit('modal:open');
});

events.on('address:change', () => {
	addressModel.validate();
	addressView.render(addressModel);
});

events.on('contacts:change', () => {
	contactsModel.validate();
	contactsView.render(contactsModel);
});

events.on('forms:reset', () => {
	addressModel.reset();
	contactsModel.reset();
	contactsView.reset();
	addressView.reset();
	console.log(addressModel);
	console.log(contactsModel);
	console.log(contactsView);
	console.log(addressView);
});

events.on('order:success', () => {
	successView.total = cartModel.getItemsTotal();
	cartModel.resetItems();
	pageView.counter = cartModel.getItemsCount();
	modal.content = successView.render({});
	events.emit('forms:reset');
});

events.on('contacts:open', () => {
	modal.content = contactsView.render({});
});

events.on('address:open', () => {
	modal.content = addressView.render({});
});

events.on('modal:open', () => {
	modal.open();
	pageView.locked = true;
});

events.on('modal:close', () => {
	modal.close();
	pageView.locked = false;
});

events.on('paymentMethod:byCardSelected', () => {
	addressModel.paymentMethod = 'card';
	events.emit('address:change');
});

events.on('paymentMethod:byCashSelected', () => {
	addressModel.paymentMethod = 'cash';
	events.emit('address:change');
});

events.on('addressForm.addressInput:change', (evt: IFormInputChangeEvent) => {
	addressModel.address = evt.value;
	events.emit('address:change');
});

events.on('contactsForm.emailInput:change', (evt: IFormInputChangeEvent) => {
	contactsModel.email = evt.value;
	events.emit('contacts:change');
});

events.on('contactsForm.phoneInput:change', (evt: IFormInputChangeEvent) => {
	contactsModel.phone = evt.value;
	events.emit('contacts:change');
});

apiProductsModel
	.getProductList()
	.then((data: IProduct[]) => {
		catalogState.products = data;
	})
	.catch((error) => console.log(error));
