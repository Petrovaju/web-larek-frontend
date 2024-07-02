# Проектная работа "Веб-ларек"

Реализация интернет-магазина "Web Ларёк".

- Используемый стек: HTML, SCSS, TS.
- Для сборки используется Webpack.
- Подключен линтер ESLint.

Структура проекта:

- src/ — исходные файлы проекта
- src/components/ — папка с JS компонентами
- src/components/base/ — папка с базовым кодом

Важные файлы:

- src/pages/index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами
- src/index.ts — точка входа приложения
- src/styles/styles.scss — корневой файл стилей
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами

## Установка и запуск

Для установки и запуска проекта необходимо выполнить команды

```
npm install
npm run start
```

или

```
yarn
yarn start
```

## Сборка

```
npm run build
```

или

```
yarn build
```

## Архитектура

![UML-диаграмма](/UML.jpg)

## Базовый код

### 1. Класс ListView<T>

Используется для отображения списка с произвольным типом данных. Реализует методы для создания верстки и ее отображения.
Класс является дженериком и может отображать любую коллекцию.
Констркутор принимает интерфейс и класс отображения для него, имеет следующие методы:

```
+render(T[]): HTMLElement - отображает коллекцию

```

### 2. Класс ModalView<T>

Используется для отрисовки модального окна с произвольным содержимым.
Констркутор принимает интерфейс и класс отображения для него, имеет следующие методы:

```
+render(T): HTMLElement - отображает модальное окно

```

## Модель данных

### 1. Класс Product

Используется для манипуляций с данными карточки продукта.

Класс имеет следующие атрибуты:

```
+id: string - уникальный идентификатор продукта
+title: string - название продукта
+description: string - описание продукта
+price: number - цена
+category: string - категория

```

### 2. Класс Cart

Используется для заполнения данных клиента и работы с корзиной товаров.

Класс имеет следующие атрибуты:

```
+products: [] Product - список выбранных продуктов в корзине
+total: number - итоговая сумма покупки
+paymentMethod: enum | string - метод оплаты
+address: string - адрес доставки
+phoneNumber: string - номер телефона клиента
+email:string - электронная почта клиента

```

Класс имеет следующие методы:

```
+addProduct(Product): void - добавление продукта в корзину
+deleteProduct(Product): void - удаление продукта из корзины
+setPaymentMethod(string): void - изменение способа оплаты
+setAddress(string): void - ввод адреса доставки
+setPhoneNumber(string): void - ввод номера телефона
+setEmail(string): void - ввод электронной почты

```

## Классы отображения

### 1. Класс ProductView

Используется для отображения информации о товаре.

Класс имеет следующие атрибуты:

```
+element: HTMLElement - HTML-элемент, который будет наполняться информацией о товаре

```

Класс имеет следующие методы:

```
+render(IProduct): HTMLElement - отрисовка заполненного информацией HTML-элемента
_createColumn(unknown): HTMLElement - приватный метод для создания колонки в верстке

```

### 2. Класс CartView

Используется для отображения наполнения корзины.

Класс имеет следующие атрибуты:

```
+element: HTMLElement - HTML-элемент, который будет наполняться информацией о корзине

```

Класс имеет следующие методы:

```
+render(ICart): HTMLElement - отрисовка корзины с заказом

```

## Ключевые типы данных

```
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

```
