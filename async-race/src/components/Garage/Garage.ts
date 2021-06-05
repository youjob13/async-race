import './garage.scss';
import { IPropsToBaseControl } from '../shared/interfaces/api';
import { IPage } from '../shared/interfaces/page-model';
import { ICarItemState } from '../state/carState';
import BaseControl from '../shared/BaseControl/BaseControl';
import Car from '../Car/Car';
import Button from '../shared/Button/Button';
import Input from '../shared/Input/Input';

class Garage extends BaseControl<HTMLElement> implements IPage {
  constructor(
    propsToBaseControl: IPropsToBaseControl,
    private cars: ICarItemState[],
    private handleInput: (type: string, value: string) => void,
    private onGenerateCarBtnClick: () => void,
    private onDeleteCarBtnClick: (id: number) => void,
    private editCarParams: (id: number, type: string, value: string) => void
  ) {
    super(propsToBaseControl);
  }

  startRace = (): void => {};

  returnCarToDefaultPosition = (): void => {};

  createCar = (): void => {};

  render(): HTMLElement {
    const garageHeader = new BaseControl({
      tagName: 'header',
      classes: ['garage__header'],
    });

    const generateCarWrapper = new BaseControl({
      tagName: 'div',
      classes: ['garage__generate-car', 'generate-car__wrapper'],
    });

    const inputName = new Input(
      {
        tagName: 'input',
        classes: ['generate-car__input_name'],
        attributes: { type: 'text', name: 'name' },
      },
      this.handleInput
    );

    const inputColor = new Input(
      {
        tagName: 'input',
        classes: ['generate-car__input_name'],
        attributes: { type: 'color', name: 'color' },
      },
      this.handleInput
    );

    const generateCarBtn = new Button(
      {
        tagName: 'button',
        classes: ['generate__button'],
        text: 'Generate car',
      },
      this.onGenerateCarBtnClick
    );

    generateCarWrapper.node.append(
      inputName.node,
      inputColor.node,
      generateCarBtn.node
    );

    const buttonsWrapper = new BaseControl({
      tagName: 'div',
      classes: ['garage__buttons-wrapper'],
    });

    const startRaceBtn = new Button(
      {
        tagName: 'button',
        classes: ['garage__button', 'button'],
        text: 'Start Race',
      },
      this.startRace
    );

    const resetBtn = new Button(
      {
        tagName: 'button',
        classes: ['garage__button', 'button'],
        text: 'Reset',
      },
      this.returnCarToDefaultPosition
    );

    buttonsWrapper.node.append(startRaceBtn.node, resetBtn.node);

    const carsNumber = new BaseControl({
      tagName: 'p',
      classes: ['garage__cars-number'],
      text: this.cars.length.toString(),
    });

    garageHeader.node.append(
      generateCarWrapper.node,
      carsNumber.node,
      buttonsWrapper.node
    );

    const garageContent = new BaseControl({
      tagName: 'div',
      classes: ['garage__inner'],
    });

    this.cars.forEach((car) => {
      const carItem = new Car(
        { tagName: 'div', classes: ['garage__car', 'car'] },
        car,
        this.onDeleteCarBtnClick,
        this.editCarParams
      ).render();
      garageContent.node.append(carItem);
    });

    this.node.append(garageHeader.node, garageContent.node);
    return this.node;
  }
}

export default Garage;
