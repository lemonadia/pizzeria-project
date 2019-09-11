/*klasa BaseWidget jest wzorcem dla każdego widgetu, używanego przez nas w tym projekcie.
 Wykorzystamy do tego dziedziczenie klas.
 będzie wygodniej, jak każdy z widgetów na stronie będzie w ten sam sposób przechowywał
swoją wartość i informował, kiedy wartość się zmienia */

export class BaseWidget {  /*9.4*/
  constructor(wrapperElement, initialValue) {
    const thisWidget = this;

    thisWidget.dom = {};

    thisWidget.dom.wrapper = wrapperElement;
    thisWidget.correctValue = initialValue; //ustawienie początkowej wartości
  }

  get value() {
    const thisWidget = this;

    return thisWidget.correctValue;
  }
  
//Setter zostanie wywołany, kiedy właściwości value zostanie przypisana jakaś wartość – np. za pomocą widget.value = 5;.
//Przypisywana wartość – w tym przykładzie 5 – zostanie przekazana setterowi jako pierwszy argument, który nazwaliśmy assignedValue.

  set value(assignedValue) {
    const thisWidget = this;

    const newValue = thisWidget.parseValue(assignedValue);
    // blok if sprawdza, czy warsoć jest inna od dotychczasowej

    if (newValue != thisWidget.correctValue && thisWidget.isValid(newValue)) {
      thisWidget.correctValue = newValue; //jeżeli warunek jest spełniony nowa wartość zapisywana jest w  correctValue
      thisWidget.announce(); //  i uruchamiana jest metoda announce, która wywała event o zmianie warsoći
    }

    thisWidget.renderValue(); // wywołujemy metodę renderującą (wyświetlającą) wartość naszego widgetu
  }

  parseValue(newValue) {
    return parseInt(newValue);
  }

  isValid(newValue) {
    return !isNaN(newValue);
  }

  renderValue() {
    const thisWidget = this;

    console.log('widget value:', thisWidget.value);
  }

  announce() {
    const thisWidget = this;

    const event = new CustomEvent('updated', {
      bubbles: true
    });

    thisWidget.dom.wrapper.dispatchEvent(event);
  }

}
