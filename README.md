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

В проекте используется архитектурный стиль MVP(Model-View-Presenter). Данная архитектура разделяет слои ответсвенности между классами данных (Model) и отображений (View), координация между которыми происходит посредством контроллера-презентера (Presenter).

Слой данных (Model) - отвечает за загрузку данных по API и данными пользовательского ввода. Так-же в моделях хранится сама бизнес логика приложения.

Слой отображения (View) - отвечает за отображение пользовательского интерфейса.

EventEmitter (Presenter) - связывает интерфейсы и модели данных при срабатывании событий.

## Описание базовых классов

### 1. Класс Api

Описывает реализацию взаимодействия приложения с сервером по HTTP протоколу.
Имеет атрибут конфигурации, в котором хранится путь к серверу, базовые заголовки запроса.
Имеет атрибуты:

```ts
baseUrl: string; // базовый путь к серверу
options: RequestInit; // настройки HTTP запроса
```

Имеет методы:

```ts
handleResponse: (response: Response) => Promise<object>; // логика обработки ответа сервера
get: (uri: string) => Promise<object>; // отправка гет-запроса
post: (uri: string, data: object, method: ApiPostMethods = 'POST') =>
	Promise<object>; // отправка пост-запроса
```

### 2. Класс EventEmitter (Presenter)

Координирует взаимодействие слоев данных и отображения, использует брокер событий.
Имеет атрибуты:

```ts
events: Map<EventName, Set<Subscriber>>; // Список зарегестрированных событий
```

Имеет методы:

```ts
on<T extends object>(eventName: EventName, callback: (event: T) => void) // регистрация обработчика события
emit<T extends object>(eventName: string, data?: T) // отправка события с данными
trigger<T extends object>(eventName: string, context?: Partial<T>) // создает коллбэк, отправляющий событие при вызове
off(eventName: EventName, callback: Subscriber) // снятие регистрации обработчика события
onAll(callback: (event: EmitterEvent) => void) // начать слушать зарегестрированные события
offAll: () // сбросить регистрацию всех событий
```

## Описания классов слоя данных (Model)

### 1. Класс CartModel

Отвечает за работу с информацией о товарах, которые пользователь добавил в корзину. Реализует интерфейс ICart

Имеет следующие атрибуты:

```ts
protected _products: IProduct[]      // атрибут, используемый для хранения списка товаров

```

Класс имеет следующие методы:

```ts
new() => CartModel // инициализация объекта с пустым списком заказов
products => IProducts // геттер списка товаров в корзине
addProduct: (product: IProduct) => void    // добавление продукта в корзину
deleteProduct: (product: IProduct) => void // удаление продукта из корзины
getItemsCount: () => number                // возвращает количество заказов в корзине
getItemsTotal: () => number                // итоговая сумма покупки
resetItems() => void // удаление всех товаров из корзины
```

### 2. Класс ApiProductsModel

Этот класс наследуется от класса [Api](### 1. Класс Api) и отвечает за взаимодействие со товарами на сервере
Имеет методы:

```ts
getProductList(): Promise<IProduct[]> // получить список товаров с сервера
getProduct(id: string): Promise<IProduct> // получить информацию по конкретному товару
```

### 3. Класс ApiOrderModel

Этот класс наследуется от класса [Api](### 1. Класс Api) и отвечает за оформление заказа на сервере

```ts
postOrder(productsData: ICart,
		addressData: IAddressState,
		contactsData: IContactsState): Promise<object> // отправить данные по заказу на сервер
_mapModelToBodyObject(productsData: ICart,
		addressData: IAddressState,
		contactsData: IContactsState): object // формирует тело запроса на основании моделей корзины, адреса и контактов
```

### 4. Класс CatalogModel

Этот класс отвечает за хранение списка всех доступных товаров

Имеет следующие атрибуты:

```ts
protected _products: IProduct[]      // атрибут, используемый для хранения списка товаров
protected events: IEvents // брокер для отправки событий
```

```ts
new(events: IEvents) => CatalogModel // инициализация объекта с пустым списком товаров
set products(products: IProduct[]) // установка первоначального списка товаров
products => IProducts // геттер каталога товаров
```

### 5. Класс AddressModel

Этот класс отвечает за работу с данными адреса доставки и способа платежа. Реализует интерфейс IAddressState

Имеет следующие атрибуты:

```ts
	protected _paymentMethod: string; // тип оплаты
	protected _address: string; // адрес доставки
	protected valid: boolean; // валидны ли данные в модели
	protected error: string; // описание ошибки валидации
```

```ts
new() => AddressModel // инициализация объекта
set address(address: string) => void // установка значения адреса доставки
address => string // геттер значения адреса доставки
set paymentMethod(paymentMethod: string) => void // установка значения типа оплаты
paymentMethod => string // геттер значения типа оплаты
validate => void // метод валидации, валидирует и устанваливает ошибку валидации и атрибут валидности
reset => void // сброс данных модели
_validatePaymentMethod(): boolean // проверка данных метода платежа, при невалидных данные возвращает false и устанваливает сообщение ошибки
_validateAddress(): boolean // проверка данных адреса, при невалидных данные возвращает false и устанваливает сообщение ошибки
```

### 6. Класс ContactsModel

Этот класс отвечает за работу с данными номера телефона и емейла. Реализует интерфейс IContactsState

Имеет следующие атрибуты:

```ts
	protected _email: string; // атрибут емейла
	protected _phone: string; // атрибут номера телефона
	protected valid: boolean; // валидны ли данные модели
	protected error: string; // текст ошибки валидации
```

```ts
new() => ContactsModel // инициализация объекта
set email(email: string) => void // установка значения емейла
email => string // геттер емейла
set phone(phone: string) => void // установка значения номера телефона
phone => string // геттер номера телефона
validate() => void // метод валидации, валидирует и устанваливает ошибку валидации и атрибут валидности
reset() => void // сброс данных модели
_validatePhone() boolean // проверка данных номера телефона, при невалидных данные возвращает false и устанваливает сообщение ошибки
_validateEmail(): boolean // проверка данных емейла, при невалидных данные возвращает false и устанваливает сообщение ошибки
```

## Классы отображения (View)

### 1. Класс BaseView (абстрактный)

Базовый класс отображения, от которого будут наследоваться остальные классы.

Имеет следующие атрибуты:

```ts
element: HTMLElement; // HTML элемент для отображения
```

Класс имеет следующие методы:

```ts
new(element: HTMLElement) // инициализирует объект и сохраняет ссылку на HTML элемент для дальнейше работы с ним
render(data: object): HTMLElement // рендер, вызывается когда надо обновить отображение с данными

```

### 2. Класс ProductView

Используется для отображения информации о товаре, наследуется от BaseView.
Класс имеет следующие атрибуты:

```ts
protected _category?: HTMLElement; //элемент отображения категории
protected _title: HTMLElement; // элемент отображения названия
protected _image?: HTMLImageElement; // отображение картинки
protected _description?: HTMLElement; // отображение описания
protected _price: HTMLElement; // цена
protected _button?: HTMLButtonElement; // кнопка
protected _categoryColor = <Record<string, string>> // сопоставление категории товара по цвету
```

Класс имеет следующие методы:

```ts
new(template: HTMLTemplateElement, action?: IProductViewAction) // принимает шаблон и клонирует ноду для фактической работы с ней. Устанавливает HTML элементы согласно разметке и при передаче экшена регистрирует листенер либо на кнопке, если в шаблоне есть кнопка, либо на сам элемент товара
set title(title: string) // установка названия товара для отображения
set image(path: string) // установка картинки товара для отображения
set price(price: string) // установка цены товара для отображения
set category(category: string) // установка категории товара для отображения
set description(description: string) // установка описания товара для отображения
set buttonText(buttonText: string) // установка текста кнопки
```

### 3. Класс CartView

Используется для отображения наполнения корзины, наследуется от BaseView.
Класс имеет следующие атрибуты:

```ts
protected _list: HTMLElement; // элемент для отображения списка товаров в корзине
protected _button: HTMLButtonElement; // кнопка "оформить"
protected _total: HTMLElement; // элемент для отображения стоимости корзины
```

Класс имеет следующие методы:

```ts
new(template: HTMLTemplateElement, action: ICartAction) // принимает шаблон и клонирует ноду для фактической работы с ней. Устанавливает HTML элементы согласно разметке и регистрирует листенер на кнопке
set list(items: HTMLElement[]) // установка элементов списка товаров в корзине
set total(total: number) // установка суммы всех товаров в корзине
```

### 4. Класс AddressView

Используется для отображения формы ввода адреса и способа оплаты, наследуется от BaseView.
Класс имеет следующие атрибуты:

```ts
protected _paymentMethodCard: HTMLElement; // элемент выбора метода оплаты картой
protected _paymentMethodCash: HTMLElement; // элемент выбора метода оплаты наличными
protected _address: HTMLInputElement; // инпут ввода адреса
protected _button: HTMLButtonElement; //  кнопка "далее"
protected _events: IEvents; // брокер событий
protected _errorContainer: HTMLElement; // элемент для отображения информации по ошибке формы
element: HTMLFormElement; // уточнение что элемент вьюхи именно форма
```

Класс имеет следующие методы:

```ts
new(template: HTMLTemplateElement, action: IAddressAction, events: IEvents) // принимает шаблон и клонирует ноду для фактической работы с ней. Устанавливает HTML элементы согласно разметке и регистрирует листенер на кнопке
set address(address: string) // установка значения и состояния ввода адреса
set valid(valid: boolean) // установка активности кнопки формы
set error(errorText: string) // установка текста ошибки формы
reset() // сброс данных формы
```

### 5. Класс ContactsView

Используется для отображения формы ввода электронной почты и номера телефона, наследуется от BaseView.
Класс имеет следующие атрибуты:

```ts
protected _emailInput: HTMLInputElement; // инпут ввода емейла
protected _phoneInput: HTMLInputElement; // инпут ввода номера телефона
protected _state: IContactsState; // состояние формы
protected _button: HTMLButtonElement; // кнопка "далее"
element: HTMLFormElement; // уточнение что элемент вьюхи именно форма
```

Класс имеет следующие методы:

```ts
new(template: HTMLTemplateElement, events: IEvents, action: IContactsAction) // принимает шаблон и клонирует ноду для фактической работы с ней. Устанавливает HTML элементы согласно разметке и регистрирует листенер на кнопке
set valid(valid: boolean) // установка активности кнопки формы
set error(errorText: string) // установка текста ошибки формы
reset() // сброс данных формы
```

### 6. Класс SuccessView

Используется для отрисовки информации об успешном заказе, наследуется от BaseView.

Класс имеет следующие атрибуты:

```ts
protected _total: HTMLElement; // элемент отображения суммы оформленного заказа
protected _button: HTMLButtonElement; // кнопка "за следующими покупками"
```

Класс имеет следующие методы:

```ts
new(template: HTMLTemplateElement, action: ISuccessViewActio) // принимает шаблон и клонирует ноду для фактической работы с ней. Устанавливает HTML элементы согласно разметке и регистрирует листенер на кнопке
set total(total: number) // установка суммы заказа
```

### 7. Класс PageView

Используется для работы с основной страницей сайта, наследуется от BaseView.
Класс имеет следующие атрибуты:

```ts
protected _counter: HTMLElement; // элемент для отображения количества товаров в корзине
protected _catalog: HTMLElement; // список товаров
protected _cart: HTMLElement; // элемент для отображения иконки корзины
protected _wrapper: HTMLElement; // элемент "затемения" страницы при открытом модальном окне
```

Класс имеет следующие методы:

```ts
new(template: HTMLTemplateElement, action: ISuccessViewAction) // принимает шаблон и клонирует ноду для фактической работы с ней. Устанавливает HTML элементы согласно разметке и регистрирует листенер на кнопке
set counter(counter: number) // количество товаров в корзине
set catalog(items: HTMLElement[]) // список товаров
set locked(isLocked: boolean) // установка "затемнения" страницы
```

Используется для работы с основной страницей сайта, наследуется от BaseView.
Класс имеет следующие атрибуты:

```ts
protected _counter: HTMLElement; // элемент для отображения количества товаров в корзине
protected _catalog: HTMLElement; // список товаров
protected _cart: HTMLElement; // элемент для отображения иконки корзины
protected _wrapper: HTMLElement; // элемент "затемения" страницы при открытом модальном окне
```

Класс имеет следующие методы:

```ts
new(template: HTMLTemplateElement, action: ISuccessViewAction) // принимает шаблон и клонирует ноду для фактической работы с ней. Устанавливает HTML элементы согласно разметке и регистрирует листенер на кнопке
set counter(counter: number) // количество товаров в корзине
set catalog(items: HTMLElement[]) // список товаров
set locked(isLocked: boolean) // установка "затемнения" страницы
```

### 8. Класс Modal

Используется для отображения модальных окон, наследуется от BaseView.

Класс имеет следующие атрибуты:

```ts
protected closeButton: HTMLButtonElement; // кнопка закрытия модального окна
protected _content: HTMLElement; // контент для отображения внутри модального окна
protected _events: IEvents; // брокер для отправки событий
```

Класс имеет следующие методы:

```ts
new(container: HTMLElement, events: IEvents) // принимает ноду для фактической работы с ней. Устанавливает HTML элементы согласно разметке и регистрирует брокер для отправки событий
set content(value: HTMLElement) // установка контента для отображения
open() // открыть окно
close() // закрыть окно
render(): HTMLElement // отрисовка окна с контентом
```

### 9. Класс CartItemView

Используется для отображения элемента списка корзины, наследуется от BaseView.

Класс имеет следующие атрибуты:

```ts
	protected _indexElement: HTMLSpanElement; // элемент нумерации элемента списка корзины
	protected _titleElement: HTMLElement; // элемент названия элемента списка корзины
	protected _priceElement: HTMLElement; // элемент отображения цены элемента списка корзины
	protected _buttonElement: HTMLButtonElement; // кнопка оформить
```

Класс имеет следующие методы:

```ts
new(template: HTMLTemplateElement, action: ICartItemAction, idx: number) // принимает шаблон и клонирует ноду для фактической работы с ней. Устанавливает HTML элементы согласно разметке и регистрирует листенер на кнопке. Фиксирует нумерацию элемента в списке
set price(price: number) // установка цены элемента списка корзины
set title(title: string) // установка названия элемента списка корзины
```
