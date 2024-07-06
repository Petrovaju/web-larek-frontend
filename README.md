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
- src/scss/styles.scss — корневой файл стилей
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

# Архитектура

## Базовый код

В проекте используется архитектурный стиль MVB(Model-View-Broker). Данная архитектура разделяет слои ответсвенности между классами данных (Model) и отображений (View), координация между которыми происходит посредством брокера (Broker), который, в свою очередь, слушает события из этих двух слоев.

Слой данных (Model) - отвечает за загрузку данных по API и данными пользовательского ввода. Так-же в моделях хранится сама бизнес логика приложения.

Слой отображения (View) - отвечает за отображение пользовательского интерфейса.

EventEmitter (Broker) - связывает слой отображения и слой данных при срабатывании зарегестрированных событий.

## Описание базовых классов

### 1. Интерфейс IAppState 
Описывает общую структуру приложения, которая содержит информацию о состоянии всех компонентов приложения.

```ts
catalog: IProduct[]; // Список товаров: полученный с сервера
cart: ICart;         // Состояние текущей корзины
```
### 2. Интерфейс IApi
Описывает реализацию взаимодействия приложения с сервером по HTTP протоколу.
Имеет атрибут конфигурации, в котором хрfнится путь к серверу, базовые заголовки запроса
Имеет методы:
```ts
get: (resource: string, data: object) => Promise<object>
put: (resource: string, data: object) => Promise<object>
patch: (resource: string, data: object) => Promise<object>
post: (resource: string, data: object) => Promise<object>
delete: (resource: string, data: object) => Promise<object>
```

### 3. Интерфейс IEvent

Описывает интерфейс события.
Имеет методы:
```ts
on: (event: string, callback: (data: T) => void) => void
emit: (event: string, data?: T) => void
trigger: (event: string, context?: Partial) => (data: T) => void
```

### 4. Класс EventEmitter
Реализует интерфейс IEvent и является брокером приложения. Координирует взаимодействие слоев данных и отображения
Имеет атрибуты:
```ts
events: string[] // Список зарегестрированных событий
```
Имеет методы:
```ts
on: (event: string, callback: (data: T) => void) => void // регистрация обработчика события
emit: (event: string, data?: T) => void // отправка события с данными
trigger: (event: string, context?: Partial) => (data: T) => void // создает коллбэк, отправляющий событие при вызове
off: (event: string) => void // снятие регистрации обработчика события
onAll: () => void // начать слушать зарегестрированные события
offAll: () => // сбросить регистрацию всех событий
```


## Описания классов слоя данных

### 1. Интерфейс IProduct

Содержит информацию о товаре, которая приходит с сервера. Методов для взаимодействия пользователя с товаром не предусмотрено функциональными требованиями.

Интерфейс описывает следующие атрибуты:

```ts
id: string          // уникальный идентификатор продукта
title: string       // название продукта
description: string // описание продукта
price: number       // цена
category: string    // категория

```

### 2. Интерфейс ICart

Используется для заполнения данных клиента и работы с корзиной товаров.

Интерфейс описывает следующие атрибуты:

```ts
products: IProduct[]  // список выбранных продуктов в корзине
paymentMethod: string // метод оплаты
address: string       // адрес доставки
phoneNumber: string   // номер телефона клиента
email:string          // электронная почта клиента

```

Интерфейс описывает следующие методы:

```ts
addProduct: (product: IProduct) => void    // добавление продукта в корзину
deleteProduct: (product: IProduct) => void // удаление продукта из корзины
setPaymentMethod: (method: string) => void // изменение способа оплаты
setAddress: (address: string) => void      // ввод адреса доставки
setPhoneNumber: (number: string) => void   // ввод номера телефона
setEmail: (email: string) => void          // ввод электронной почты
getItemsCount: () => number                // возвращает количество заказов в корзине
getItemsTotal: () => number                // итоговая сумма покупки
isValid: () => boolean                     // проверяет, валидны ли данные корзины
```

### 3. Класс ApiProductsModel

Этот класс реализует интерфейс [IApi](### 2. Интерфейс IApi) и отвечает за взаимодействие со товарами на сервере
Имеет метод:
```ts
getProductList: () => IProduct[] // получить список товаров с сервера
getProduct(uuid: string) => IProduct // получить информацию по конкретному товару
```

### 4. Класс ApiOrderModel

Этот класс реализует интерфейс [IApi](### 2. Интерфейс IApi) и отвечает за оформление заказа на сервере
```ts
postOrder: () => object // отправить данные по заказу на сервер
```

### 5. Класс ProductListModel

Этот класс реализует интерфейс [IProduct[]](### 1. Интерфейс IProduct) и отвечает за хранение полученного с сервера списка товаров

### 6. Класс ProductModel

Этот класс реализует интерфейс [IProduct](### 1. Интерфейс IProduct) и отвечает за хранение полученного с сервера товара


## Классы отображения

### 1. Класс ProductView

Используется для отображения информации о товаре в модальном окне.
Класс имеет следующие атрибуты:
```ts
element: HTMLElement // HTML-элемент, который будет наполняться информацией о товаре
```
Класс имеет следующие методы:
```ts
render(IProduct): HTMLElement // отрисовка заполненного информацией HTML-элемента
createColumn(unknown): HTMLElement // приватный метод для создания колонки в верстке
```

### 2. Класс CartView

Используется для отображения наполнения корзины.
Класс имеет следующие атрибуты:
```ts
element: HTMLElement // HTML-элемент, который будет наполняться информацией о корзине
```
Класс имеет следующие методы:
```ts
render(ICart): HTMLElement // отрисовка корзины с заказом
```

### 3. Класс ProductCartView

Используется для отображения информации о товаре в списке на странице.
Класс имеет следующие атрибуты:
```ts
element: HTMLElement // HTML-элемент, который будет наполняться информацией о товаре
variant: string // значение, по которомму идет ветвление для отображения в списке на главной странице или в корзине
```
Класс имеет следующие методы:
```ts
render(IProduct): HTMLElement // отрисовка заполненного информацией HTML-элемента
```

### 4. Класс AddressView

Используется для отрисовки формы адреса и типа оплаты.
Класс имеет следующие атрибуты:
```ts
element: HTMLElement // HTML-элемент, который будет наполняться информацией о товаре
```
Класс имеет следующие методы:
```ts
render(IProduct): HTMLElement // отрисовка заполненного информацией HTML-элемента
```

### 5. Класс ContactsView

Используется для отрисовки формы номера телефона и электронной почты.
Класс имеет следующие атрибуты:
```ts
element: HTMLElement // HTML-элемент, который будет наполняться информацией о товаре
```
Класс имеет следующие методы:
```ts
render(IProduct): HTMLElement // отрисовка заполненного информацией HTML-элемента
```

### 6. Класс SuccessOrderView

Используется для отрисовки информации об успешном заказе.
Класс имеет следующие атрибуты:
```ts
element: HTMLElement // HTML-элемент, который будет наполняться информацией о товаре
```
Класс имеет следующие методы:
```ts
render(IProduct): HTMLElement // отрисовка заполненного информацией HTML-элемента
```

### 7. Класс Modal

Используется для отображения модальных окон.
Класс имеет следующие атрибуты:
```ts
element: HTMLElement // HTML-элемент, который будет наполняться информацией о товаре
```
Класс имеет следующие методы:
```ts
render(IProduct): HTMLElement // отрисовка заполненного информацией HTML-элемента
open: () => void // открытие модального окна
close: () => void // закрытие модального окна
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
