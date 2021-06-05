import { IPropsToBaseControl } from '../shared/interfaces/api';
import { IPage } from '../shared/interfaces/page-model';
import BaseControl from '../shared/BaseControl/BaseControl';

class Garage extends BaseControl<HTMLElement> implements IPage {
  constructor(propsToBaseControl: IPropsToBaseControl, private cars: any) {
    super(propsToBaseControl);
  }

  render(): HTMLElement {
    this.node.append('hello garage');

    this.cars.forEach((car: any) => {
      console.log(car);
      this.node.append((document.createElement('p').textContent = car.brand));
    });
    return this.node;
  }
}

export default Garage;
