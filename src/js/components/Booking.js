import {
  select,
  templates,
  classNames,
  settings
} from '../settings.js';
import {
  AmountWidget
} from './AmountWidget.js';
import {
  utils
} from '../utils.js';
import {
  DatePicker
} from './DatePicker.js';
import {
  HourPicker
} from './HourPicker.js';

export class Booking {
  constructor(bookingElem) {
    const thisBooking = this;

    thisBooking.render(bookingElem);
    thisBooking.initWidgets();
    thisBooking.getData();
    thisBooking.tablePicker();



  }

  render(bookingElem) {
    const thisBooking = this;

    const generatedHTML = templates.bookingWidget();
    thisBooking.dom = {};

    thisBooking.dom.wrapper = bookingElem;
    thisBooking.dom.wrapper.appendChild(utils.createDOMFromHTML(generatedHTML));

    thisBooking.dom.peopleAmount = thisBooking.dom.wrapper.querySelector(select.booking.peopleAmount); // owe instancje klasy AmountWidget, którym jako argument przekazujemy odpowiednie właściwości z obiektu thisBooking.dom.
    thisBooking.dom.hoursAmount = thisBooking.dom.wrapper.querySelector(select.booking.hoursAmount);

    thisBooking.dom.datePicker = thisBooking.dom.wrapper.querySelector(select.widgets.datePicker.wrapper);
    thisBooking.dom.hourPicker = thisBooking.dom.wrapper.querySelector(select.widgets.hourPicker.wrapper);

    thisBooking.dom.tables = thisBooking.dom.wrapper.querySelectorAll(select.booking.tables);
  }

  initWidgets() {
    const thisBooking = this;

    thisBooking.peopleAmount = new AmountWidget(thisBooking.dom.peopleAmount);
    thisBooking.hoursAmount = new AmountWidget(thisBooking.dom.hoursAmount);
    thisBooking.datePicker = new DatePicker(thisBooking.dom.datePicker);
    thisBooking.hourPicker = new HourPicker(thisBooking.dom.hourPicker);

    thisBooking.dom.wrapper.addEventListener('updated', function() {
      thisBooking.updateDOM();
    });




  }

  getData() {
    const thisBooking = this;

    // obiedkt startEndDates, który zawiera daty minDate i maxDate, ustawione w widgecie wyboru dary
    const startEndDates = {};
    startEndDates[settings.db.dateStartParamKey] = utils.dateToStr(thisBooking.datePicker.minDate);
    startEndDates[settings.db.dateEndParamKey] = utils.dateToStr(thisBooking.datePicker.maxDate);

    // obiekt endDate, który zawiera tylko datę końcową
    const endDate = {};
    endDate[settings.db.dateEndParamKey] = startEndDates[settings.db.dateEndParamKey];

    const params = {
      booking: utils.queryParams(startEndDates),
      eventsCurrent: settings.db.notRepeatParam + '&' + utils.queryParams(startEndDates),
      eventsRepeat: settings.db.repeatParam + '&' + utils.queryParams(endDate),
    };
    console.log('getData params', params);

    const urls = {
      booking: settings.db.url + '/' + settings.db.booking + '?' + params.booking,
      eventsCurrent: settings.db.url + '/' + settings.db.event + '?' + params.eventsCurrent,
      eventsRepeat: settings.db.url + '/' + settings.db.event + '?' + params.eventsRepeat,
    };

    console.log('getData urls', urls);

    Promise.all([ // wysyłamy zapytania pod te trzy adresy,
        fetch(urls.booking),
        fetch(urls.eventsCurrent),
        fetch(urls.eventsRepeat),
      ])

      //używamy Promise.all, aby sparsować odpowiedzi wszystkich trzech zapytań.
      .then(function([bookingsResponse, eventsCurrentResponse, eventsRepeatResponse]) {
        return Promise.all([
          bookingsResponse.json(),
          eventsCurrentResponse.json(),
          eventsRepeatResponse.json(),
        ]);
      })
      //Po przetworzeniu odpowiedzi z API na obiekty, przekazujemy je do metody thisBooking.parseData,
      .then(function([bookings, eventsCurrent, eventsRepeat]) {
        thisBooking.parseData(bookings, eventsCurrent, eventsRepeat);
      });
  }



  parseData(bookings, eventsCurrent, eventsRepeat) {
    const thisBooking = this;

    thisBooking.booked = {};

    for (let eventCurrent of eventsCurrent) {
      thisBooking.makeBooked(eventCurrent.date, eventCurrent.hour, eventCurrent.duration, eventCurrent.table);
      //console.log('eventCurrent: ', eventCurrent);
    }

    for (let booking of bookings) {
      thisBooking.makeBooked(booking.date, booking.hour, booking.duration, booking.table);
    }


    // dla pojedynczego wydarzenia cyklicznego musisz wielokrotnie uruchomić metodę makeBooked
    // – raz dla każdego dnia z zakresu dat zdefiniowanego dla date-pickera.
    for (let eventRepeat of eventsRepeat) {

      const minDate = utils.dateToStr(thisBooking.datePicker.minDate);
      const days = [];

      for (let i = 0; i < settings.datePicker.maxDaysInFuture; i++) {

        let nextDay = utils.addDays(minDate, i); //dodajemy dzień do daty minimalnej
        let nextDate = utils.dateToStr(nextDay); //wyświetlamy date za pomoca dateToStr

        days.push(nextDate); //dodaje nextDate do tabilcy days (push)

        for (let day of days) {
          eventRepeat.date = day;
        }

        thisBooking.makeBooked(eventRepeat.date, eventRepeat.hour, eventRepeat.duration, eventRepeat.table);
      }

    }

    console.log('thisBooking.booked: ', thisBooking.booked);
    thisBooking.updateDOM();
  }

  makeBooked(date, hour, duration, table) {
    const thisBooking = this;
    hour = utils.hourToNumber(hour);
    //console.log('date: ', date, 'hour: ', hour, 'duration: ', duration, "table: ", table);

    if (typeof thisBooking.booked[date] == 'undefined') {
      thisBooking.booked[date] = {};
    }

    if (typeof thisBooking.booked[date][hour] == 'undefined') {
      thisBooking.booked[date][hour] = [];
    }

    thisBooking.booked[date][hour].push(table);
  }


  updateDOM() {
    const thisBooking = this;

    //aktualne wartości dla daty i godziny:
    thisBooking.date = thisBooking.datePicker.value;
    thisBooking.hour = utils.hourToNumber(thisBooking.hourPicker.value);

    for (let table of thisBooking.dom.tables) {

      const tableNr = table.getAttribute('data-table');

      if (thisBooking.booked[thisBooking.date] && thisBooking.booked[thisBooking.date][thisBooking.hour] && thisBooking.booked[thisBooking.date][thisBooking.hour].indexOf(tableNr)) {
        table.classList.add(classNames.booking.tableBooked);
        //console.log('table: ', table)
      } else {
        table.classList.remove(classNames.booking.tableBooked);
      }
    }
  }
  tablePicker() {
    const thisBooking = this;
    thisBooking.table = [];

    for (let table of thisBooking.dom.tables) {
      table.addEventListener('click', function(event) {
        event.preventDefault();
        table.classList.toggle(classNames.booking.tableSelected);


        if(table.classList.contains(classNames.booking.tableSelected)){
          thisBooking.table.push( parseInt(table.getAttribute('data-table')) );
          console.log('thisBooking.table: ', thisBooking.table);
        }



      })

      thisBooking.dom.datePicker.addEventListener('updated', function() {
        table.classList.remove(classNames.booking.tableSelected);
      });

      thisBooking.dom.hourPicker.addEventListener('updated', function() {
        table.classList.remove(classNames.booking.tableSelected);
      });

    }
  }

}
