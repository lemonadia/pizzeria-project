import {select, templates} from '../settings.js';
import {AmountWidget} from './AmountWidget.js';
import {utils} from '../utils.js';
import {DatePicker} from './Datepicker.js';

export class Booking{
  constructor(bookingElem){
  const thisBooking = this;

    thisBooking.render(bookingElem);
    thisBooking.initWidgets();

  }

  render(bookingElem){
  const thisBooking = this;

  const generatedHTML = templates.bookingWidget();
  thisBooking.dom = {};

  thisBooking.dom.wrapper = bookingElem;
  thisBooking.dom.wrapper.appendChild(utils.createDOMFromHTML(generatedHTML));

  thisBooking.dom.peopleAmount = thisBooking.dom.wrapper.querySelector(select.booking.peopleAmount); // owe instancje klasy AmountWidget, którym jako argument przekazujemy odpowiednie właściwości z obiektu thisBooking.dom.
  thisBooking.dom.hoursAmount = thisBooking.dom.wrapper.querySelector(select.booking.hoursAmount);

  thisBooking.dom.datePicker = thisBooking.dom.wrapper.querySelector(select.widgets.datePicker.wrapper);

  }

  initWidgets(){
  const thisBooking = this;

  thisBooking.peopleAmount = new AmountWidget(thisBooking.dom.peopleAmount);
  thisBooking.hoursAmount = new AmountWidget(thisBooking.dom.hoursAmount);
  thisBooking.datePicker = new DatePicker(thisBooking.dom.datePicker);
  }
}
