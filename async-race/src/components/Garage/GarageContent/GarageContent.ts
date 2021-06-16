import { Store } from 'redux';
import BaseControl from '../../../shared/BaseControl/BaseControl';
import Car from './Car/Car';
import { ICar } from '../../../shared/interfaces/carState-model';
import { COUNT_CARS_ON_PAGE } from '../../../shared/variables';

class GarageContent extends BaseControl<HTMLElement> {
  constructor(private store: Store, private cars: ICar[]) {
    super({
      tagName: 'div',
      classes: ['garage__inner'],
    });
    this.render();
  }

  private render(): void {
    if (!this.cars.length) {
      this.node.textContent = 'Garage is empty!';
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
