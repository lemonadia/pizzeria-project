/* global Handlebars, dataSource */

export const select = { // w tej stałej mamy zapisane wszystkie ustawienia i selektory!
  templateOf: {    //obiekt
    menuProduct: '#template-menu-product', //własciwość menuProduct, która zawiera selektor do szablonu produktu
    cartProduct: '#template-cart-product', // CODE ADDED

  },
  containerOf: {
    menu: '#product-list', // <div id="product-list" class="product-list container"></div>
    cart: '#cart',
  },
  all: {
    menuProducts: '#product-list > .product',
    menuProductsActive: '#product-list > .product.active',
    formInputs: 'input, select',
  },
  menuProduct: {
    clickable: '.product__header',
    form: '.product__order',
    priceElem: '.product__total-price .price',
    imageWrapper: '.product__images',
    amountWidget: '.widget-amount',
    cartButton: '[href="#add-to-cart"]',  // <a class="btn-primary" href="#add-to-cart">Add to cart</a>
  },
  widgets: {
    amount: {
      input: 'input.amount',
      linkDecrease: 'a[href="#less"]',
      linkIncrease: 'a[href="#more"]',
    },
  },
  // CODE ADDED START
cart: {
  productList: '.cart__order-summary',
  toggleTrigger: '.cart__summary',
  totalNumber: `.cart__total-number`,
  totalPrice: '.cart__total-price strong, .cart__order-total .cart__order-price-sum strong',
  subtotalPrice: '.cart__order-subtotal .cart__order-price-sum strong',
  deliveryFee: '.cart__order-delivery .cart__order-price-sum strong',
  form: '.cart__order',
  formSubmit: '.cart__order [type="submit"]',
  phone: '[name="phone"]',
  address: '[name="address"]',
},
cartProduct: {
  amountWidget: '.widget-amount',
  price: '.cart__product-price',
  edit: '[href="#edit"]',
  remove: '[href="#remove"]',
},
// CODE ADDED END
};

export const classNames = {
  menuProduct: {
    wrapperActive: 'active',
    imageVisible: 'active',
  },
  // CODE ADDED START
cart: {
  wrapperActive: 'active',
},
// CODE ADDED END
};

export const settings = {
  amountWidget: {
    defaultValue: 1,
    defaultMin: 1,
    defaultMax: 9,
  },
  cart: {
    defaultDeliveryFee: 20,
  },

  db: {
url: '//localhost:3131',
product: 'product',
order: 'order',
},

};

export const templates = {
  menuProduct: Handlebars.compile(document.querySelector(select.templateOf.menuProduct).innerHTML), // obiekt templates, którym metoda menuProduct jest tworzona za pomocą biblioteki Handlebars
  cartProduct: Handlebars.compile(document.querySelector(select.templateOf.cartProduct).innerHTML),

};
