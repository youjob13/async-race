import { Store } from 'redux';
import BaseControl from '../../../shared/BaseControl/BaseControl';
import Input from '../../../shared/Input/Input';
import Button from '../../../shared/Button/Button';
import {
  generateNewCarTC,
  generateOneHundredRandomCarsTC,
  resetCarsPositionAndNullifyCurrentWinnerTC,
  startRaceTC,
} from '../../../store/carsSlice';
import {
  ICarForm,
  ICombineState,
  ThunkDispatchType,
} from '../../../shared/interfaces/api-models';

class GarageHeader extends BaseControl<HTMLElement> {
  private readonly generateCarForm: ICarForm;

  private startRaceBtn: Button;

  private resetBtn: Button;

  constructor(
    private store: Store,
    private currentPage: number,
    private carsNumber: number
  ) {
    super({
      tagName: 'header',
      classes: ['garage__header'],
    });
    this.startRaceBtn = new Button(
      {
        tagName: 'button',
        classes: ['garage__button', 'button'],
        text: 'Start Race',
      },
      this.startRace
    );
    this.resetBtn = new Button(
      {
        tagName: 'button',
        classes: ['garage__button', 'button'],
        attributes: { disabled: 'disabled' },
        text: 'Reset',
      },
      this.resetCarsParamsAndReturnToDefaultPosition
    );
    this.generateCarForm = {
      name: 'Default Car',
      color: '#000',
    };
    this.render();
  }

  private onGenerateRandomCarsBtnClick = (): void => {
    (this.store.dispatch as ThunkDispatchType<ICombineState>)(
      generateOneHundredRandomCarsTC()
    );
  };

  private onGenerateCarBtnClick = (): void => {
    (this.store.dispatch as ThunkDispatchType<ICombineState>)(
      generateNewCarTC({
        name: this.generateCarForm.name,
        color: this.generateCarForm.color,
      })
    );
  };

  private handleInput = (type: string, value: string): void => {
    this.generateCarForm[type] = value;
  };

  private startRace = (): void => {
    this.startRaceBtn.node.setAttribute('disabled', 'disabled');
    this.resetBtn.node.removeAttribute('disabled');
    (this.store.dispatch as ThunkDispatchType<ICombineState>)(startRaceTC());
  };

  private resetCarsParamsAndReturnToDefaultPosition = (): void => {
    this.startRaceBtn.node.removeAttribute('disabled');
    this.resetBtn.node.setAttribute('disabled', 'disabled');
    (this.store.dispatch as ThunkDispatchType<ICombineState>)(
      resetCarsPositionAndNullifyCurrentWinnerTC()
    );
  };

  private render(): void {
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

    buttonsWrapper.node.append(this.startRaceBtn.node, this.resetBtn.node);

    const carsNumberOutput = new BaseControl({
      tagName: 'output',
      classes: ['garage__cars-number'],
      text: `Cars in garage: ${this.carsNumber.toString()}`,
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

    this.node.append(garageRaceWrapper.node, garageGenerateWrapper.node);
  }
}

export default GarageHeader;
