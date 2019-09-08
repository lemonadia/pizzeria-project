import {Product} from './components/Product.js';
import {Cart} from './components/Cart.js';
import {select, settings, classNames} from './settings.js';

  const app = {
    initMenu: function(){
      const thisApp = this;
    //  console.log('$$$$thisApp.data:', thisApp.data); //  w thisApp.data znajduje sie obiekt products, który zawiera poszczególne produkty

      for(let productData in thisApp.data.products){  // tworzymy pętle interująco po biekcie thisApp.data.products
         new Product(thisApp.data.products[productData].id, thisApp.data.products[productData]); // tworzymy instancję dla każdego produktu (nie zapisujemy jej w const)
      }


    },

    initCart: function(){
      const thisApp = this;

      const cartElem = document.querySelector(select.containerOf.cart); //przekazujemy metodzie initCart wrapper koszyka
      thisApp.cart = new Cart(cartElem); //instancja klasy Cart - mozemy ja wywolywac poza obiektem app za pomoca app.cart

      thisApp.productList = document.querySelector(select.containerOf.menu);
      thisApp.productList.addEventListener('add-to-cart', function(event){
        app.cart.add(event.detail.product);
      });


    },

    initData: function(){
      const thisApp = this;

      thisApp.data = {};

      const url = settings.db.url + '/' + settings.db.product;

      fetch(url)
        .then(function(rawResponse){
          return rawResponse.json();
        })
        .then(function(parsedResponse){
          console.log('parsedResponse', parsedResponse);

          /* save parsedResponse as thisApp.data.products*/

          thisApp.data.products = parsedResponse;
          /*execute initMenu method*/

          thisApp.initMenu();

        });
        console.log('thisApp.data', JSON.stringify(thisApp.data));
    },

    init: function(){
      const thisApp = this;
    //  console.log('*** App starting ***');
    //  console.log('thisApp:', thisApp);
    //  console.log('classNames:', classNames);
    //  console.log('settings:', settings);
    //  console.log('templates:', templates);

      thisApp.initPages();
      thisApp.initData();
      thisApp.initCart();
    },

    initPages: function () {
      const thisApp = this;

      thisApp.pages = Array.from(document.querySelector(select.containerOf.pages).children);
      thisApp.navLinks = Array.from(document.querySelector(select.nav.links));

      thisApp.activatePage(thisApp.pages[0].id);

      for(let link of thisApp.navLinks){
        link.addEventListener('click', function(event) {
          const clickedElement = this;
          event.preventDefault();

          /* TODO: get page id from href */

          const href = clickedElement.getAttribute('href');
          const pageId = href.replace('#', '');

          /* TODO activate page */
          thisApp.activatePage(pageId);

        });
      }
    },

    activatePage: function(pageId){

      const  thisApp = this;

      for(let link of thisApp.navLinks){
        link.classList.toggle(classNames.nav.active, link.getAttribute('href') == '#' + pageId); // sprawdzamy, czy href danego linka jest równy id strony, którą mamy aktywować (z prefiksem w postaci #).
      }
      for(let link of thisApp.pages){
        link.classList.toggle(classNames.nav.active, link.getAttribute('id') == pageId);
      }
    }

  };

app.init();
