import './garage.scss';
import { IPropsToBaseControl } from '../shared/interfaces/api';
import { IPage } from '../shared/interfaces/page-model';
import { ICarItemState } from '../state/carState';
import BaseControl from '../shared/BaseControl/BaseControl';
import Car from '../Car/Car';

class Garage extends BaseControl<HTMLElement> implements IPage {
  constructor(
    propsToBaseControl: IPropsToBaseControl,
    private cars: ICarItemState[]
  ) {
    super(propsToBaseControl);
  }

  render(): HTMLElement {
    this.node.append('hello garage');

    this.cars.forEach((car) => {
      const carItem = new Car(
        { tagName: 'div', classes: ['garage__car'] },
        car
      ).render();
      this.node.append(carItem);
    });
    return this.node;
  }
}

export default Garage;
