import { Store } from 'redux';
import BaseControl from '../../../shared/templates/BaseControl/BaseControl';
import Input from '../../../shared/templates/Input/Input';
import Button from '../../../shared/templates/Button/Button';
import {
  generateNewCarTC,
  generateOneHundredRandomCarsTC,
  resetCarsPositionAndNullifyCurrentWinnerTC,
  startRaceTC,
} from '../../../store/carsSlice';
import {
  ICarForm,
  ICombineCarsState,
  ThunkDispatchType,
} from '../../../shared/interfaces/api-models';
import { getRaceStatusSelector } from '../../../store/carsSelectors';
import {
  Attribute,
  ButtonClass,
  DEFAULT_CAR_COLOR,
  DEFAULT_CAR_NAME,
  GarageClasses,
  Tag,
} from '../../../shared/variables';

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
      tagName: Tag.HEADER,
      classes: [GarageClasses.HEADER],
    });
    this.startRaceBtn = new Button(
      {
        tagName: ButtonClass,
        classes: [GarageClasses.BUTTON, ButtonClass],
        text: 'Start Race',
      },
      this.startRace
    );
    this.resetBtn = new Button(
      {
        tagName: ButtonClass,
        classes: [GarageClasses.BUTTON, ButtonClass],
        attributes: { disabled: Attribute.DISABLED },
        text: 'Reset',
      },
      this.resetCarsParamsAndReturnToDefaultPosition
    );
    this.generateCarForm = {
      name: DEFAULT_CAR_NAME,
      color: DEFAULT_CAR_COLOR,
    };

    this.store.subscribe(() => {
      const raceStatus = getRaceStatusSelector(
        this.store.getState().carReducer
      );

      if (!raceStatus) {
        this.resetBtn.node.removeAttribute(Attribute.DISABLED);
      } else {
        this.resetBtn.node.setAttribute(Attribute.DISABLED, Attribute.DISABLED);
      }
    });

    this.render();
  }

  private onGenerateRandomCarsButtonClick = (): void => {
    (this.store.dispatch as ThunkDispatchType<ICombineCarsState>)(
      // TODO: try recast
      generateOneHundredRandomCarsTC()
    );
  };

  private onGenerateCarButtonClick = (): void => {
    (this.store.dispatch as ThunkDispatchType<ICombineCarsState>)(
      generateNewCarTC({
        name: this.generateCarForm.name,
        color: this.generateCarForm.color,
      })
    );
  };

  private enterCarParams = (type: string, value: string): void => {
    this.generateCarForm[type] = value;
  };

  private startRace = (): void => {
    this.startRaceBtn.node.setAttribute(Attribute.DISABLED, Attribute.DISABLED);
    (this.store.dispatch as ThunkDispatchType<ICombineCarsState>)(
      startRaceTC()
    );
  };

  private resetCarsParamsAndReturnToDefaultPosition = (): void => {
    this.startRaceBtn.node.removeAttribute(Attribute.DISABLED);
    (this.store.dispatch as ThunkDispatchType<ICombineCarsState>)(
      resetCarsPositionAndNullifyCurrentWinnerTC()
    );
  };

  private render(): void {
    this.node.innerHTML = '';

    const garageGenerateWrapper = new BaseControl({
      tagName: Tag.DIV,
      classes: [GarageClasses.CONTROL],
    });

    const garageRaceWrapper = new BaseControl({
      tagName: Tag.DIV,
      classes: [GarageClasses.RACE],
    });

    const generateCarWrapper = new BaseControl({
      tagName: Tag.DIV,
      classes: [GarageClasses.GENERATE_CAR, GarageClasses.CAR_WRAPPER],
    });

    const garageGenerateControls = [
      new Input(
        {
          tagName: Tag.INPUT,
          classes: [
            GarageClasses.GENERATE_CAR_INPUT,
            GarageClasses.GENERATE_CAR_INPUT_NAME,
          ],
          attributes: { type: 'text', name: 'name' },
        },
        this.enterCarParams
      ),
      new Input(
        {
          tagName: Tag.INPUT,
          classes: [
            GarageClasses.GENERATE_CAR_INPUT,
            GarageClasses.GENERATE_CAR_INPUT_COLOR,
          ],
          attributes: { type: 'color', name: 'color' },
        },
        this.enterCarParams
      ),
      new Button(
        {
          tagName: Tag.BUTTON,
          classes: [GarageClasses.GENERATE_CAR_BUTTON, ButtonClass],
          text: 'Generate car',
        },
        this.onGenerateCarButtonClick
      ),
      new Button(
        {
          tagName: Tag.BUTTON,
          classes: [GarageClasses.GENERATE_CAR_BUTTON, ButtonClass],
          text: 'Generate 100 cars',
        },
        this.onGenerateRandomCarsButtonClick
      ),
    ];

    generateCarWrapper.node.append(
      ...garageGenerateControls.map((control) => control.node)
    );

    const buttonsWrapper = new BaseControl({
      tagName: Tag.DIV,
      classes: [GarageClasses.BUTTONS_WRAPPER],
    });

    buttonsWrapper.node.append(this.startRaceBtn.node, this.resetBtn.node);

    const currentPage = new BaseControl({
      tagName: Tag.OUTPUT,
      classes: [GarageClasses.CURRENT_PAGE],
      text: `#Page: ${this.currentPage}`,
    });

    garageRaceWrapper.node.append(buttonsWrapper.node, currentPage.node);

    const carsNumberOutput = new BaseControl({
      tagName: Tag.OUTPUT,
      classes: [GarageClasses.CARS_NUMBER],
      text: `Cars in garage: ${this.carsNumber.toString()}`,
    });

    garageGenerateWrapper.node.append(
      generateCarWrapper.node,
      carsNumberOutput.node
    );

    this.node.append(garageRaceWrapper.node, garageGenerateWrapper.node);
  }
}

export default GarageHeader;
