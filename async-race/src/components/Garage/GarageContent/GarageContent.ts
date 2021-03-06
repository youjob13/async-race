import { Store } from 'redux';
import BaseControl from '../../../shared/templates/BaseControl/BaseControl';
import Car from './Car/Car';
import { ICar } from '../../../shared/interfaces/carState-model';
import {
  COUNT_CARS_ON_PAGE,
  GarageClasses,
  Tag,
} from '../../../shared/variables';

const EMPTY_GARAGE_CONTENT = 'Garage is empty!';

const garageContentPropsToBaseControl = {
  tagName: Tag.DIV,
  classes: [GarageClasses.INNER],
};

class GarageContent extends BaseControl<HTMLElement> {
  constructor(private readonly store: Store, private readonly cars: ICar[]) {
    super(garageContentPropsToBaseControl);
    this.render();
  }

  private render(): void {
    if (!this.cars.length) {
      this.node.textContent = EMPTY_GARAGE_CONTENT;
    } else {
      this.cars.forEach((car, index) => {
        if (index < COUNT_CARS_ON_PAGE) {
          const carItem = new Car(car, this.store);
          this.node.append(carItem.node);
        }
      });
    }
  }
}

export default GarageContent;
