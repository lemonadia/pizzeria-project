import {select, settings} from '../settings.js';
import {BaseWidget} from './BaseWidget.js';
import {utils} from '../utils.js';

export class DatePicker extends BaseWidget {
  constructor(wrapper) {
    super(wrapper, utils.dateToStr(new Date())); // utils.dateToStr przekształca obiekt daty na tekst w formacie rok-miesiąc-dzień, czyli np. '2019-12-31'.
    const thisWidget = this;

    thisWidget.dom.input = thisWidget.dom.wrapper.querySelector(select.widgets.datePicker.input);

    thisWidget.initPlugin();
  }

  initPlugin() {
    const thisWidget = this;
    
        thisWidget.minDate = new Date(thisWidget.value); //tworzy obiekt daty, którego wartość to "teraz"
        thisWidget.maxDate = utils.addDays(thisWidget.minDate, settings.datePicker.maxDaysInFuture); // uzyskanie daty przesuniętej o ileś dni

        flatpickr(thisWidget.dom.input, options);

    const options = { //tworze obiekt options, który zawiera opcje pluginu flatpickr
      defaultDate: thisWidget.minDate,
      minDate: thisWidget.minDate,
      maxDate: thisWidget.maxDate,
      disable: [
        function(date) {
          // return true to disable
          return (date.getDay() === 1);

        }
      ],
      locale: {
        "firstDayOfWeek": 1 // start week on Monday
      },
      onChange: function(selectedDates, dateStr, instance) {
        thisWidget.value = dateStr; //ustawiamy właściwości thisWidget.value na dateStr w momencie wykrycia zmiany wartości przez plugin
      }

    };

  }

  parseValue(newValue) {
    return newValue;
  }

  isValid() {
    return true;
  }

  renderValue() {
  //  const thisWidget = this;
  }

}
