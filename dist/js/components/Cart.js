import {select, settings, classNames, templates} from '../settings.js';
import {utils} from '../utils.js';
import {CartProduct} from './CartProduct.js';

export class Cart{
  constructor(element){
    const thisCart = this;

    thisCart.products = []; // tablica, w której będziemy przechowywać produkty dodane do koszyka
    thisCart.deliveryFee = settings.cart.defaultDeliveryFee;

    thisCart.getElements(element);
    thisCart.initActions();

    // console.log('%%% new Cart ', thisCart);
  }

  getElements(element){
  const thisCart = this;

  thisCart.dom = {}; // NOWOŚĆ - > obiekt przechowujący wszystkie el DOM wyszukane w komponencie koszyka

  thisCart.dom.wrapper = element;
  thisCart.dom.toggleTrigger = thisCart.dom.wrapper.querySelector(select.cart.toggleTrigger);
  thisCart.dom.productList = thisCart.dom.wrapper.querySelector(select.cart.productList);
  thisCart.dom.form = thisCart.dom.wrapper.querySelector(select.cart.form);
  thisCart.dom.phone = thisCart.dom.wrapper.querySelector(select.cart.phone);
  thisCart.dom.address = thisCart.dom.wrapper.querySelector(select.cart.address);
  thisCart.renderTotalsKeys = ['totalNumber', 'totalPrice', 'subtotalPrice', 'deliveryFee'];


for(let key of thisCart.renderTotalsKeys){
thisCart.dom[key] = thisCart.dom.wrapper.querySelectorAll(select.cart[key]);
}
}

  initActions(){
  const thisCart = this;

  thisCart.dom.toggleTrigger.addEventListener('click', function(){
    thisCart.dom.wrapper.classList.toggle(classNames.cart.wrapperActive);
    });

   thisCart.dom.productList.addEventListener('updated', function(){
      thisCart.update();
   });

   thisCart.dom.productList.addEventListener('remove', function(event){
      thisCart.remove(event.detail.cartProduct);
    });

    thisCart.dom.form.addEventListener('submit', function(event){
      event.preventDefault();
      thisCart.sendOrder();
      })

}

  sendOrder(){

  const thisCart = this;

  const url = settings.db.url + '/' + settings.db.order;

  const payload = {
    totalPrice: thisCart.totalPrice,
    phone: thisCart.phone,
    address: thisCart.address,
    totalNumber: thisCart.totalNumber,
    subtotalPrice: thisCart.subtotalPrice,
    deliveryFee: thisCart.deliveryFee,
    products: []
  };

  for(let product of thisCart.products){
    payload.products = product.getData();
  }

  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  };

  fetch(url, options)
    .then(function(response){
      return response.json();
    }).then(function(parsedResponse){
      console.log('parsedResponse', parsedResponse)
    });
}

  add(menuProduct){
   const thisCart = this;

   const generatedHTML = templates.cartProduct(menuProduct);

  const generatedDOM = utils.createDOMFromHTML(generatedHTML);
//  console.log('<<<<<generatedDOM:' generatedDOM);

  thisCart.dom.productList.appendChild(generatedDOM);
  //console.log('adding product', menuProduct);

  thisCart.products.push(new CartProduct(menuProduct, generatedDOM));
  //console.log('+++thisCart.products', thisCart.products);

  thisCart.update();

}

  update(){
   const thisCart = this;

   thisCart.totalNumber = 0;
   thisCart.subtotalPrice = 0;

   for(let thisCartProduct of thisCart.products){
      thisCart.subtotalPrice += thisCartProduct.price;
      thisCart.totalNumber += thisCartProduct.amount;
   }

   thisCart.totalPrice = thisCart.subtotalPrice + thisCart.deliveryFee;

  //console.log('totalNumber: ', thisCart.totalNumber, 'subtotalPrice: ', thisCart.subtotalPrice, 'thisCart.totalPrice: ', thisCart.totalPrice);

   for(let key of thisCart.renderTotalsKeys){
     for(let elem of thisCart.dom[key]){  // interujemy po kązdym elem z kolekcji, zapisanej wcześniej pod jednym z kluczy w thisCart.renderTotalsKeys.
                                          // Dla każdego z tych el ustawiamy właściwość koszyka, która ma ten sam klucz
       elem.innterHTML = thisCart[key];
     }
   }
  }


  remove(cartProduct){
      const thisCart = this;
      const index = thisCart.products.indexOf(cartProduct);
      thisCart.products.splice(index, 1);
      cartProduct.dom.wrapper.remove();
      thisCart.update();
    }
}
