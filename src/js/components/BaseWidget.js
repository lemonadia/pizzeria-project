


export class BaseWidget{
  constructor(wrapperElement, initialValue) {

    const thisWidget = this;

    thisWidget.dom.wrapper = wrapperElement;
    thisWidget.correctValue = initialValue; //ustawienie początkowej wartości

  }

  get value() {
    const thisWidget = this;

    return thisWidget.correctValue;
  }

  set value(assignedValue) {
    const thisWidget = this;

    const newValue = thisWidget.parseValue(assignedValue);

    // blok if sprawdza, czy warsoć jest inna od dotychczasowej

    if (newValue != thisWidget.correctValue && thisWidget.isValid(newValue)) {
      thisWidget.correntValue = newValue; //jeżeli warunek jest spełniony nowa wartość zapisywana jest w  correctValue
      thisWidget.announce(); // i uruchamiana jest metoda announce, która wywała event o zmianie warsoći
    }
    thisWidget.renderValue(); // wywołujemy metodę renderującą (wyświetlającą) wartość naszego widgetu
  }

  parseValue(newValue) {
    return parseInt(newValue);
  }

  isValid(newValue) {
    return !isNaN(newValue);
  }

  announce() {
    const thisWidget = this;

    const event = new CustomEvent('updated', {
      bubbles: true
    });
    thisWidget.dom.wrapper.dispatchEvent(event);
  }
}
