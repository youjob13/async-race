import './garage.scss';
import { IPropsToBaseControl } from '../shared/interfaces/api';
import { IPage } from '../shared/interfaces/page-model';
import { ICarItemState } from '../state/carState';
import BaseControl from '../shared/BaseControl/BaseControl';
import Car from '../Car/Car';
import Button from '../shared/Button/Button';

class Garage extends BaseControl<HTMLElement> implements IPage {
  constructor(
    propsToBaseControl: IPropsToBaseControl,
    private cars: ICarItemState[]
  ) {
    super(propsToBaseControl);
  }

  startRace(): void {}

  returnCarToDefaultPosition(): void {}

  render(): HTMLElement {
    const garageHeader = new BaseControl({
      tagName: 'header',
      classes: ['garage__header'],
    });

    const startRaceBtn = new Button(
      {
        tagName: 'button',
        classes: ['garage__button', 'button'],
        text: 'Start Race',
      },
      this.startRace
    );

    const returnDefaultPositionBtn = new Button(
      {
        tagName: 'button',
        classes: ['garage__button', 'button'],
        text: 'return',
      },
      this.returnCarToDefaultPosition
    );

    const carsNumber = new BaseControl({
      tagName: 'p',
      classes: ['garage__cars-number'],
      text: this.cars.length.toString(),
    });

    garageHeader.node.append(
      startRaceBtn.node,
      returnDefaultPositionBtn.node,
      carsNumber.node
    );

    this.cars.forEach((car) => {
      const carItem = new Car(
        { tagName: 'div', classes: ['garage__car'] },
        car
      ).render();
      this.node.append(carItem);
    });

    this.node.prepend(garageHeader.node);
    return this.node;
  }
}

export default Garage;
