import {
  select,
  settings
} from '../settings.js';
import {
  BaseWidget
} from './BaseWidget.js';


export class AmountWidget extends BaseWidget {
  constructor(wrapper) {
    super(wrapper, settings.amountWidget.defaultValue);

    const thisWidget = this;

    thisWidget.getElements();
    thisWidget.initActions();

    //    console.log('AmountWidget: ', thisWidget);
    //    console.log('constructor arguments: ', element);
  }

  getElements() {
    const thisWidget = this;

    thisWidget.dom.input = thisWidget.dom.wrapper.querySelector(select.widgets.amount.input);
    thisWidget.dom.linkDecrease = thisWidget.dom.wrapper.querySelector(select.widgets.amount.linkDecrease);
    thisWidget.dom.linkIncrease = thisWidget.dom.wrapper.querySelector(select.widgets.amount.linkIncrease);
  }


  initActions() {

    const thisWidget = this;

    thisWidget.dom.input.addEventListener('change', function() {
      thisWidget.value = thisWidget.dom.input.value;
    });

    thisWidget.dom.linkDecrease.addEventListener('click', function(event) {
      event.preventDefault();
      thisWidget.value--;
    });

    thisWidget.dom.linkIncrease.addEventListener('click', function(event) {
      event.preventDefault();
      thisWidget.value++;
    });
  }
// sprawdzas nie tylko, czy ustawiana wartość value jest liczbą,
//ale również czy mieści się w przedziale zdefiniowanym w settings.amountWidget.
  isValid(newValue) {
    return !isNaN(newValue) && newValue >= settings.amountWidget.defaultMin && newValue <= settings.amountWidget.defaultMax;
  }

  renderValue() {
    const thisWidget = this;

    thisWidget.dom.input.value = thisWidget.value;
  }

}

/* AmountWidget, tylko uzupełnia bądź nadpisuje domyślne działanie widgetu, zdefiniowane w BaseWidget.*/
