/* global Handlebars, utils, dataSource */ // eslint-disable-line no-unused-vars

{
  'use strict';

  const select = {
    templateOf: {    //obiekt
      menuProduct: '#template-menu-product', //własciwość menuProduct, która zawiera selektor do szablonu produktu
    },
    containerOf: {
      menu: '#product-list',
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
      cartButton: '[href="#add-to-cart"]',
    },
    widgets: {
      amount: {
        input: 'input[name="amount"]',
        linkDecrease: 'a[href="#less"]',
        linkIncrease: 'a[href="#more"]',
      },
    },
  };

  const classNames = {
    menuProduct: {
      wrapperActive: 'active',
      imageVisible: 'active',
    },
  };

  const settings = {
    amountWidget: {
      defaultValue: 1,
      defaultMin: 1,
      defaultMax: 9,
    }
  };

  const templates = {
    menuProduct: Handlebars.compile(document.querySelector(select.templateOf.menuProduct).innerHTML), // obiekt templates, którym metoda menuProduct jest tworzona za pomocą biblioteki Handlebars
  };






  class Product{
    constructor(id, data){  // constructor to funkcja
      const thisProduct = this;

      thisProduct.id = id;          //zapisujemy właściwość instancji w konstuktorze
      thisProduct.data =data;

      thisProduct.renderInMenu();
      thisProduct.initAccordion();

      console.log('++++new Product:', thisProduct);


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


  initAccordion(){
    const thisProduct = this;

    /* find the clickable trigger (the element that should react to clicking)*/

    const clickableTrigger = thisProduct.element.querySelector(select.menuProduct.clickable);

    /* START: click event listener to trigger */

    clickableTrigger.addEventListener('click',function(){

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
}









  const app = {
    initMenu: function(){
      const thisApp = this;
      console.log('$$$$thisApp.data:', thisApp.data); //  w thisApp.data znajduje sie obiekt products, który zawiera poszczególne produkty

      for(let productData in thisApp.data.products){  // tworzymy pętle interująco po biekcie thisApp.data.products
         new Product(productData, thisApp.data.products[productData]); // tworzymy instancję dla każdego produktu (nie zapisujemy jej w const)
      }


      const testProduct = new Product();
      console.log('>>>>>testProduct:', testProduct);
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
  };



  app.init();
}
