import './garage.scss';
import { IPropsToBaseControl } from '../shared/interfaces/api';
import { IPage } from '../shared/interfaces/page-model';
import { ICarItemState } from '../state/carState';
import BaseControl from '../shared/BaseControl/BaseControl';
import Button from '../shared/Button/Button';
import Input from '../shared/Input/Input';
import CarContainer from '../Car/CarContainer';

class Garage extends BaseControl<HTMLElement> implements IPage {
  constructor(
    propsToBaseControl: IPropsToBaseControl,
    private cars: ICarItemState[],
    private currentPage: number,
    private handleInput: (type: string, value: string) => void,
    private onGenerateCarBtnClick: () => void,
    private onDeleteCarBtnClick: (id: number) => void,
    private editCarParams: (id: number, type: string, value: string) => void,
    private setEditMode: (id: number) => void,
    private onNextPageBtnClick: () => void,
    private onPrevPageBtnClick: () => void,
    private onGenerateRandomCarsBtnClick: () => void
  ) {
    super(propsToBaseControl);
  }

  startRace = (): void => {};

  returnCarToDefaultPosition = (): void => {};

  render(): HTMLElement {
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

    const carsNumber = this.cars.length;
    const carsOnPage = 7;
    const pagesNumber = Math.ceil(carsNumber / carsOnPage);

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

    this.currentPage === 1 &&
      leftArrow.node.setAttribute('disabled', 'disabled');

    this.currentPage === pagesNumber &&
      rightArrow.node.setAttribute('disabled', 'disabled');

    this.cars.forEach((car, index) => {
      if (
        (this.currentPage - 1) * carsOnPage <= index &&
        index < carsOnPage * this.currentPage
      ) {
        const carItem = new CarContainer(
          { tagName: 'div', classes: ['garage__car', 'car'] },
          car,
          this.onDeleteCarBtnClick,
          this.editCarParams,
          this.setEditMode
        ).render();
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
