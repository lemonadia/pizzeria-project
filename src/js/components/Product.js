import {
  select,
  classNames,
  templates
} from '../settings.js';
import {
  utils
} from '../utils.js';
import {
  AmountWidget
} from './AmountWidget.js';


export class Product {
  constructor(id, data) { // constructor to funkcja
    const thisProduct = this;

    thisProduct.id = id; //zapisujemy właściwość instancji w konstuktorze
    thisProduct.data = data;

    thisProduct.renderInMenu();
    thisProduct.getElements();
    thisProduct.initAccordion();
    thisProduct.initOrderForm();
    thisProduct.initAmountWidget(); //kl
    thisProduct.processOrder();

    //  console.log('++++new Product:', thisProduct);


  }
  renderInMenu() { // metoda, ktra bedzie renderowac (tworzyc) produkty na stronie
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

  getElements() {
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

  initAccordion() {
    const thisProduct = this;

    /* find the clickable trigger (the element that should react to clicking)*/
    //  const clickableTrigger = thisProduct.element.querySelector(select.menuProduct.clickable);

    /* START: click event listener to trigger */
    thisProduct.accordionTrigger.addEventListener('click', function() {

      /* prevent default action for event */
      event.preventDefault();

      /* toggle active class on element of thisProduct */
      thisProduct.element.classList.add('active');

      /* find all active products */
      const activeProducts = document.querySelectorAll(select.all.menuProductsActive);

      /* START LOOP: for each active product */
      for (let activeProduct of activeProducts) {

        /* START: if the active product isn't the element of thisProduct */
        if (activeProduct !== thisProduct.element) {

          /* remove class active for the active product */
          activeProduct.classList.remove('active');

          /* END: if the active product isn't the element of thisProduct */
        }

        /* END LOOP: for each active product */
      }

      /* END: click event listener to trigger */
    })
  }


  initOrderForm() {
    const thisProduct = this;

    thisProduct.form.addEventListener('submit', function(event) {
      event.preventDefault();
      thisProduct.processOrder();
    });

    for (let input of thisProduct.formInputs) {
      input.addEventListener('change', function() {
        thisProduct.processOrder();
      });
    }

    thisProduct.cartButton.addEventListener('click', function(event) {
      event.preventDefault();
      thisProduct.processOrder();
      thisProduct.addToCart();
    });


  } //zakonczenie metody initOrderForm




  processOrder() {
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
    for (let paramId in thisProduct.data.params) {

      /* [DONE] save the element in thisProduct.data.params with key paramId as const param */
      const param = thisProduct.data.params[paramId]; // paraId

      /* START LOOP: for each optionId in param.options */
      for (let optionId in param.options) {

        /*  [DONE] save the element in param.options with key optionId as const option */
        const option = param.options[optionId] //optionId
        //console.log('!!!!!option: ', option);

        const optionSelected = formData.hasOwnProperty(paramId) && formData[paramId].indexOf(optionId) > -1;

        /* [DONE] START IF: if option is selected and option is not default */
        if (optionSelected && !option.default) { //jeżeli oopcjaSelected i opcja nie jest DOMYŚLNA

          /* [DONE] add price of option to variable price */
          price += option.price; // price = price + option.price, czyli dodajemy cene opcji do ceny produktu

          /* [DONE]END IF: if option is selected and option is not default */
          /* START ELSE IF: if option is not selected and option is default */
        } else if (!optionSelected && option.default) {
          /* deduct price of option from price */
          price -= option.price; //odejmujemy
          /* [DONE] END ELSE IF: if option is not selected and option is default */
        }


        /*IMAGES*/

        const foundElements = imageElements.querySelectorAll('.' + paramId + '-' + optionId);

        if (optionSelected) {
          if (!thisProduct.params[paramId]) {
            thisProduct.params[paramId] = {
              label: param.label,
              options: {},
            };
          }
          thisProduct.params[paramId].options[optionId] = option.label;

          for (let element of foundElements) {
            element.classList.add(classNames.menuProduct.imageVisible);
          }
        } else {
          for (let element of foundElements) {
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

    //console.log("thisProduct.params: ", thisProduct.params);
  }

  initAmountWidget() { // tworzy instację klasy AmountWidget i zapisuje ją we właściwości produktu
    const thisProduct = this;

    thisProduct.amountWidget = new AmountWidget(thisProduct.amountWidgetElem);
    thisProduct.amountWidgetElem.addEventListener('updated', function() {
      thisProduct.processOrder();
    });
  }

  addToCart() {
    const thisProduct = this;

    thisProduct.name = thisProduct.data.name;
    thisProduct.amount = thisProduct.amountWidget.value;

    //app.cart.add(thisProduct);

    const event = new CustomEvent('add-to-cart', {
      bubbles: true,
      detail: {
        product: thisProduct,
      },
    });
    thisProduct.element.dispatchEvent(event);
  }

}
