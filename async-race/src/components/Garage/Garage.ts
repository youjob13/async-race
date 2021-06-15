import './garage.scss';
import { ICarForm } from '../shared/interfaces/api-models';
import { IPage } from '../shared/interfaces/page-model';
import BaseControl from '../shared/BaseControl/BaseControl';
import Button from '../shared/Button/Button';
import Input from '../shared/Input/Input';
import Car from '../Car/Car';
import { ICarItemState } from '../shared/interfaces/carState-model';
import {
  generateNewCarTC,
  generateRandomCarsTC,
  toggleGaragePageAC,
} from '../../store/carReducer';

class Garage extends BaseControl<HTMLElement> implements IPage {
  private generateCarForm: ICarForm;

  cars: ICarItemState[];

  currentPage: number;

  constructor(private store: any) {
    super({ tagName: 'main', classes: ['garage'] });
    this.cars = [];
    this.currentPage = 1;
    this.generateCarForm = {
      name: 'Default Car',
      color: '#000',
    };
  }

  private onPrevPageBtnClick = (): void => {
    this.store.dispatch(toggleGaragePageAC(false));
  };

  private onNextPageBtnClick = (): void => {
    this.store.dispatch(toggleGaragePageAC(true));
  };

  private onGenerateRandomCarsBtnClick = (): void => {
    this.store.dispatch(generateRandomCarsTC());
  };

  private onGenerateCarBtnClick = (): void => {
    this.store.dispatch(
      generateNewCarTC({
        name: this.generateCarForm.name,
        color: this.generateCarForm.color,
      })
    );
  };

  private handleInput = (type: string, value: string): void => {
    this.generateCarForm[type] = value;
  };

  startRace = (): void => {};

  returnCarToDefaultPosition = (): void => {};

  render(): HTMLElement {
    const { cars, currentGaragePage } = this.store.getState();
    this.cars = cars;
    this.currentPage = currentGaragePage;

    const carsNumber = this.cars.length;
    const carsOnPage = 7;
    const pagesNumber = Math.ceil(carsNumber / carsOnPage);

    const garageHeader = new BaseControl({
      tagName: 'header',
      classes: ['garage__header'],
    });

    const garageGenerateWrapper = new BaseControl({
      tagName: 'div',
      classes: ['garage__control'],
    });

    const garageRaceWrapper = new BaseControl({
      tagName: 'div',
      classes: ['garage__race'],
    });

    const generateCarWrapper = new BaseControl({
      tagName: 'div',
      classes: ['garage__generate-car', 'generate-car__wrapper'],
    });

    const inputName = new Input(
      {
        tagName: 'input',
        classes: ['generate-car__input', 'generate-car__input_name'],
        attributes: { type: 'text', name: 'name' },
      },
      this.handleInput
    );

    const inputColor = new Input(
      {
        tagName: 'input',
        classes: ['generate-car__input', 'generate-car__input_color'],
        attributes: { type: 'color', name: 'color' },
      },
      this.handleInput
    );

    const generateCarBtn = new Button(
      {
        tagName: 'button',
        classes: ['generate-car__button', 'button'],
        text: 'Generate car',
      },
      this.onGenerateCarBtnClick
    );

    const generateRandomCarsBtn = new Button(
      {
        tagName: 'button',
        classes: ['generate-car__button', 'button'],
        text: 'Generate 100 cars',
      },
      this.onGenerateRandomCarsBtnClick
    );

    generateCarWrapper.node.append(
      inputName.node,
      inputColor.node,
      generateCarBtn.node,
      generateRandomCarsBtn.node
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

    const carsNumberOutput = new BaseControl({
      tagName: 'output',
      classes: ['garage__cars-number'],
      text: `Cars in garage: ${this.cars.length.toString()}`,
    });

    const currentPage = new BaseControl({
      tagName: 'output',
      classes: ['garage__current-page'],
      text: `#Page: ${this.currentPage}`,
    });

    garageGenerateWrapper.node.append(
      generateCarWrapper.node,
      carsNumberOutput.node
    );
    garageRaceWrapper.node.append(buttonsWrapper.node, currentPage.node);

    garageHeader.node.append(
      garageRaceWrapper.node,
      garageGenerateWrapper.node
    );

    const garageContent = new BaseControl({
      tagName: 'div',
      classes: ['garage__inner'],
    });

    const arrowsPagesWrapper = new BaseControl({
      tagName: 'div',
      classes: ['garage__pages'],
    });

    const leftArrow = new Button(
      {
        tagName: 'button',
        classes: ['arrow', 'arrow-left'],
        text: 'Prev',
      },
      this.onPrevPageBtnClick
    );

    const rightArrow = new Button(
      {
        tagName: 'button',
        classes: ['arrow', 'arrow-right'],
        text: 'Next',
      },
      this.onNextPageBtnClick
    );

    if (this.currentPage === 1)
      leftArrow.node.setAttribute('disabled', 'disabled');

    if (this.currentPage === pagesNumber)
      rightArrow.node.setAttribute('disabled', 'disabled');

    this.cars.forEach((car, index) => {
      if (
        (this.currentPage - 1) * carsOnPage <= index &&
        index < carsOnPage * this.currentPage
      ) {
        const carItem = new Car(car, this.store).render();
        garageContent.node.append(carItem);
      }
    });

    arrowsPagesWrapper.node.append(leftArrow.node, rightArrow.node);
    this.node.append(
      garageHeader.node,
      garageContent.node,
      arrowsPagesWrapper.node
    );
    return this.node;
  }
}

export default Garage;
