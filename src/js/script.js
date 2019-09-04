/* global Handlebars, utils, dataSource */ // eslint-disable-line no-unused-vars

{
  'use strict';

  const select = { // w tej stałej mamy zapisane wszystkie ustawienia i selektory!
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

  const classNames = {
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

  const settings = {
    amountWidget: {
      defaultValue: 1,
      defaultMin: 1,
      defaultMax: 9,
    },
    cart: {
      defaultDeliveryFee: 20,
    },
  };

  const templates = {
    menuProduct: Handlebars.compile(document.querySelector(select.templateOf.menuProduct).innerHTML), // obiekt templates, którym metoda menuProduct jest tworzona za pomocą biblioteki Handlebars
    cartProduct: Handlebars.compile(document.querySelector(select.templateOf.cartProduct).innerHTML),

  };


  class Product{
    constructor(id, data){  // constructor to funkcja
      const thisProduct = this;

      thisProduct.id = id;          //zapisujemy właściwość instancji w konstuktorze
      thisProduct.data =data;

      thisProduct.renderInMenu();
      thisProduct.getElements();
      thisProduct.initAccordion();
      thisProduct.initOrderForm();
      thisProduct.initAmountWidget(); //kl
      thisProduct.processOrder();

    //  console.log('++++new Product:', thisProduct);


    }
    renderInMenu(){    // metoda, ktra bedzie renderowac (tworzyc) produkty na stronie
      const thisProduct = this;

      /* generate HTMl based on template */
      const generatedHTML = templates.menuProduct(thisProduct.data);

      /*create element using utils.createElementFromHtml*/
      thisProduct.element = utils.createDOMFromHTML(generatedHTML); // obiekt utils znajduje się w pliku functions.js

      /*find menu container*/
      const menuContainer = document.querySelector(select.containerOf.menu);

      /* add element to menu */
      menuContainer.appendChild(thisProduct.element); //dodajemy stworzony element do menu za pomoca metody appenChild
    }

// metoda służąca odnalezieniu elementów w kontenerze produktu

getElements(){
  const thisProduct = this;

  thisProduct.accordionTrigger = thisProduct.element.querySelector(select.menuProduct.clickable);
  thisProduct.form = thisProduct.element.querySelector(select.menuProduct.form);
  thisProduct.formInputs = thisProduct.form.querySelectorAll(select.all.formInputs);
  thisProduct.cartButton = thisProduct.element.querySelector(select.menuProduct.cartButton);
  thisProduct.priceElem = thisProduct.element.querySelector(select.menuProduct.priceElem);
  thisProduct.imageWrapper = thisProduct.element.querySelector(select.menuProduct.imageWrapper);
  thisProduct.amountWidget = thisProduct.element.querySelector(select.menuProduct.amountWidget);
  thisProduct.amountWidgetElem = thisProduct.element.querySelector(select.menuProduct.amountWidget);
}


//metoda, dzięki ktorej rozwijamy opcje produktu

  initAccordion(){
    const thisProduct = this;

    /* find the clickable trigger (the element that should react to clicking)*/
    const clickableTrigger = thisProduct.element.querySelector(select.menuProduct.clickable);

    /* START: click event listener to trigger */
    thisProduct.accordionTrigger.addEventListener('click',function(){

      /* prevent default action for event */
      event.preventDefault();

      /* toggle active class on element of thisProduct */
      thisProduct.element.classList.add('active');

      /* find all active products */
    const activeProducts = document.querySelectorAll(select.all.menuProductsActive);

      /* START LOOP: for each active product */
      for(let activeProduct of activeProducts){

        /* START: if the active product isn't the element of thisProduct */
        if(activeProduct !== thisProduct.element){

          /* remove class active for the active product */
          activeProduct.classList.remove('active');

        /* END: if the active product isn't the element of thisProduct */
      }

      /* END LOOP: for each active product */
    }

    /* END: click event listener to trigger */
  })
  }


  initOrderForm(){
    const thisProduct = this;

    thisProduct.form.addEventListener('submit', function(event){
       event.preventDefault();
       thisProduct.processOrder();
    });

    for(let input of thisProduct.formInputs){
      input.addEventListener('change', function(){
        thisProduct.processOrder();
      });
    }

    thisProduct.cartButton.addEventListener('click', function(event){
      event.preventDefault();
      thisProduct.processOrder();
      thisProduct.addToCart();
    });


  }//zakonczenie metody initOrderForm




  processOrder(){
    const thisProduct = this;

    /* [DONE] read all data from the form (using utils.serializeFormToObject) and save it to const formData */
        const formData = utils.serializeFormToObject(thisProduct.form);
    //    console.log('^^^formData', formData);

   thisProduct.params = {};

  /* [DONE] set variable price to equal thisProduct.data.price */

    let price = thisProduct.data.price;

  /*Images code*/
     const imageElements = thisProduct.imageWrapper;

  /* [DONE] START LOOP: for each paramId in thisProduct.data.params */
  for(let paramId in thisProduct.data.params){

    /* [DONE] save the element in thisProduct.data.params with key paramId as const param */
    const param = thisProduct.data.params[paramId]; // paraId

    /* START LOOP: for each optionId in param.options */
    for(let optionId in param.options){

      /*  [DONE] save the element in param.options with key optionId as const option */
      const option = param.options[optionId]  //optionId
      //console.log('!!!!!option: ', option);

      const optionSelected = formData.hasOwnProperty(paramId) && formData[paramId].indexOf(optionId) > -1;

      /* [DONE] START IF: if option is selected and option is not default */
      if(optionSelected && !option.default){ //jeżeli oopcjaSelected i opcja nie jest DOMYŚLNA

        /* [DONE] add price of option to variable price */
         price += option.price; // price = price + option.price, czyli dodajemy cene opcji do ceny produktu

      /* [DONE]END IF: if option is selected and option is not default */
      /* START ELSE IF: if option is not selected and option is default */
    } else if(!optionSelected && option.default){
        /* deduct price of option from price */
        price -= option.price; //odejmujemy
      /* [DONE] END ELSE IF: if option is not selected and option is default */
    }


    /*IMAGES*/

    const foundElements = imageElements.querySelectorAll('.' + paramId + '-' + optionId);

      if(optionSelected){
        if(!thisProduct.params[paramId]){
          thisProduct.params[paramId] = {
            label: param.label,
            options: {},
          };
        }
        thisProduct.params[paramId].options[optionId] = option.label;

          for(let element of foundElements){
            element.classList.add(classNames.menuProduct.imageVisible);
          }
    }else{
         for(let element of foundElements){
           element.classList.remove(classNames.menuProduct.imageVisible)
         }
    }
    /* [DONE] END LOOP: for each optionId in param.options */
  }
  /* END LOOP: for each paramId in thisProduct.data.params */
}
/* multiply price by amount */
thisProduct.priceSingle = price;
thisProduct.price = thisProduct.priceSingle * thisProduct.amountWidget.value;

/* set the contents of thisProduct.priceElem to be the value of variable price */
thisProduct.priceElem.innerHTML = thisProduct.price;

console.log("thisProduct.params: ", thisProduct.params);
}

initAmountWidget(){ // tworzy instację klasy AmountWidget i zapisuje ją we właściwości produktu
  const thisProduct = this;

  thisProduct.amountWidget = new AmountWidget(thisProduct.amountWidgetElem);
  thisProduct.amountWidgetElem.addEventListener('updated', function(event){
    thisProduct.processOrder();
  });
}

addToCart(){
  const thisProduct = this;

  thisProduct.name = thisProduct.data.name;
  thisProduct.amount = thisProduct.amountWidget.value;

  app.cart.add(thisProduct);


}

}


 class AmountWidget{
    constructor(element){
      const thisWidget = this;

      thisWidget.getElements(element);
      thisWidget.value = settings.amountWidget.defaultValue;
      thisWidget.setValue(thisWidget.input.value);
      thisWidget.initActions();

      console.log('AmountWidget: ', thisWidget);
      console.log('constructor arguments: ', element);
    }

  getElements(element){
     const thisWidget = this;

     thisWidget.element = element;
     thisWidget.input = thisWidget.element.querySelector(select.widgets.amount.input);
     thisWidget.linkDecrease = thisWidget.element.querySelector(select.widgets.amount.linkDecrease);
     thisWidget.linkIncrease = thisWidget.element.querySelector(select.widgets.amount.linkIncrease);
   }


 setValue(value){

   const thisWidget = this;

   const newValue = parseInt(value); //potrzebna do walidacje i sprawdzenia czy wartość tej stałej jest poprawna i mieści się w dopuszczalnym zakresie

   /* TODO: Add Validation*/



   if( newValue !== thisWidget.value && newValue >= settings.amountWidget.defaultMin && newValue <= settings.amountWidget.defaultMax ) {
           thisWidget.value = newValue;
           thisWidget.announce();
         }


   thisWidget.input.value = thisWidget.value;  // dzięki temu nowa wartość wyświetli się na stronie


 }

 initActions(){

   const thisWidget = this;

   thisWidget.input.addEventListener('change', function(event){
          thisWidget.setValue(thisWidget.input.value);
        });

   thisWidget.linkDecrease.addEventListener('click', function(event){
               event.preventDefault();
               thisWidget.setValue(thisWidget.value-1);
             });

  thisWidget.linkIncrease.addEventListener('click', function(event){
             event.preventDefault();
             thisWidget.setValue(thisWidget.value+1);


});
}

  announce(){
    const thisWidget = this;

    const event = new Event('updated');
    thisWidget.element.dispatchEvent(event);
  }



 }


class Cart{
  constructor(element){
    const thisCart = this;

    thisCart.products = []; // tablica, w której będziemy przechowywać produkty dodane do koszyka

    thisCart.getElements(element);
    thisCart.initActions();

    console.log('%%% new Cart ', thisCart);
  }

  getElements(element){
    const thisCart = this;

    thisCart.dom = {}; // NOWOŚĆ - > obiekt przechowujący wszystkie el DOM wyszukane w komponencie koszyka

    thisCart.dom.wrapper = element;
    thisCart.dom.toggleTrigger = thisCart.dom.wrapper.querySelector(select.cart.toggleTrigger);
    thisCart.dom.productList = thisCart.dom.wrapper.querySelector(select.cart.productList);

  }

  initActions(){
    const thisCart = this;

    thisCart.dom.toggleTrigger.addEventListener('click', function(event){
      thisCart.dom.wrapper.classList.toggle(classNames.cart.wrapperActive);
  });
  }


  add(menuProduct){
     const thisCart = this;

     const generatedHTML = templates.cartProduct(app.productData);

    const generatedDOM = utils.createDOMFromHTML(generatedHTML);
  //  console.log('<<<<<generatedDOM:' generatedDOM);

    thisCart.dom.productList.appendChild(generatedDOM);

    console.log('adding product', menuProduct);

  }
}



  const app = {
    initMenu: function(){
      const thisApp = this;
      console.log('$$$$thisApp.data:', thisApp.data); //  w thisApp.data znajduje sie obiekt products, który zawiera poszczególne produkty

      for(let productData in thisApp.data.products){  // tworzymy pętle interująco po biekcie thisApp.data.products
         new Product(productData, thisApp.data.products[productData]); // tworzymy instancję dla każdego produktu (nie zapisujemy jej w const)
      }


    },

    initData: function(){
      const thisApp = this;

      thisApp.data = dataSource;
    },

    init: function(){
      const thisApp = this;
      console.log('*** App starting ***');
      console.log('thisApp:', thisApp);
      console.log('classNames:', classNames);
      console.log('settings:', settings);
      console.log('templates:', templates);

      thisApp.initData();
      thisApp.initMenu();


    },

    initCart: function(){
      const thisApp = this;

      const cartElem = document.querySelector(select.containerOf.cart); //przekazujemy metodzie initCart wrapper koszyka
      thisApp.cart = new Cart(cartElem); //instancja klasy Cart - mozemy ja wywolywac poza obiektem app za pomoca app.cart
    }
  };



  app.init();
  app.initCart();
}
