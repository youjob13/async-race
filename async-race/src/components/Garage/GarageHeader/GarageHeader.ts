import { Store } from 'redux';
import BaseControl from '../../../shared/templates/BaseControl/BaseControl';
import Input from '../../../shared/templates/Input/Input';
import Button from '../../../shared/templates/Button/Button';
import {
  generateNewCarTC,
  generateOneHundredRandomCarsTC,
  resetRaceDataTC,
  startRaceTC,
} from '../../../store/carsSlice';
import {
  ICarForm,
  ICombineCarsState,
} from '../../../shared/interfaces/api-models';
import { getRaceStatus } from '../../../store/carsSelectors';
import {
  Attribute,
  ButtonClass,
  DEFAULT_CAR_COLOR,
  DEFAULT_CAR_NAME,
  EmptyString,
  GarageClasses,
  Tag,
} from '../../../shared/variables';
import dispatchThunk from '../../../shared/helperFunctions/dispatchThunk';

const START_RACE_BUTTON_TEXT = 'Start Race';
const RESET_BUTTON_TEXT = 'Reset';
const GENERATE_CAR_BUTTON_TEXT = 'Generate car';
const GENERATE_RANDOM_CARS_BUTTON_TEXT = 'Generate 100 cars';

const garageHeaderPropsToBaseControl = {
  tagName: Tag.HEADER,
  classes: [GarageClasses.HEADER],
};
const startRaceButtonProps = {
  tagName: ButtonClass,
  classes: [GarageClasses.BUTTON, ButtonClass],
  text: START_RACE_BUTTON_TEXT,
};
const resetButtonProps = {
  tagName: ButtonClass,
  classes: [GarageClasses.BUTTON, ButtonClass],
  attributes: { disabled: Attribute.DISABLED },
  text: RESET_BUTTON_TEXT,
};
const generateFormWrapperProps = {
  tagName: Tag.DIV,
  classes: [GarageClasses.CONTROL],
};
const raceBlockWrapperProps = {
  tagName: Tag.DIV,
  classes: [GarageClasses.RACE],
};
const carGenerateWrapperProps = {
  tagName: Tag.DIV,
  classes: [GarageClasses.GENERATE_CAR, GarageClasses.CAR_WRAPPER],
};
const inputNameProps = {
  tagName: Tag.INPUT,
  classes: [
    GarageClasses.GENERATE_CAR_INPUT,
    GarageClasses.GENERATE_CAR_INPUT_NAME,
  ],
  attributes: { type: 'text', name: 'name' },
};
const inputColorProps = {
  tagName: Tag.INPUT,
  classes: [
    GarageClasses.GENERATE_CAR_INPUT,
    GarageClasses.GENERATE_CAR_INPUT_COLOR,
  ],
  attributes: { type: 'color', name: 'color' },
};
const buttonGenerateCarProps = {
  tagName: Tag.BUTTON,
  classes: [GarageClasses.GENERATE_CAR_BUTTON, ButtonClass],
  text: GENERATE_CAR_BUTTON_TEXT,
};
const generateRandomCarsProps = {
  tagName: Tag.BUTTON,
  classes: [GarageClasses.GENERATE_CAR_BUTTON, ButtonClass],
  text: GENERATE_RANDOM_CARS_BUTTON_TEXT,
};
const raceControlWrapperProps = {
  tagName: Tag.DIV,
  classes: [GarageClasses.BUTTONS_WRAPPER],
};

class GarageHeader extends BaseControl<HTMLElement> {
  private readonly carGeneratedForm: ICarForm;

  private readonly startRaceBtn: Button;

  private readonly resetBtn: Button;

  constructor(
    private readonly store: Store,
    private readonly currentPage: number,
    private readonly carsNumber: number
  ) {
    super(garageHeaderPropsToBaseControl);
    this.startRaceBtn = new Button(startRaceButtonProps, this.startRace);
    this.resetBtn = new Button(
      resetButtonProps,
      this.resetCarsParamsAndReturnToDefaultPosition
    );
    this.carGeneratedForm = {
      name: DEFAULT_CAR_NAME,
      color: DEFAULT_CAR_COLOR,
    };

    this.store.subscribe(() => {
      const raceStatus = getRaceStatus(this.store.getState().carReducer);

      if (!raceStatus) {
        this.resetBtn.node.removeAttribute(Attribute.DISABLED);
      } else {
        this.resetBtn.node.setAttribute(Attribute.DISABLED, Attribute.DISABLED);
      }
    });

    this.render();
  }

  private generateRandomCars = (): void => {
    dispatchThunk<ICombineCarsState>(
      this.store,
      generateOneHundredRandomCarsTC()
    );
  };

  private generateCar = (): void => {
    const carParams = {
      name: this.carGeneratedForm.name,
      color: this.carGeneratedForm.color,
    };

    dispatchThunk<ICombineCarsState>(this.store, generateNewCarTC(carParams));
  };

  private enterCarParams = (type: string, value: string): void => {
    this.carGeneratedForm[type] = value; // TODO: think about [key: string]: string
  };

  private startRace = (): void => {
    this.startRaceBtn.node.setAttribute(Attribute.DISABLED, Attribute.DISABLED);
    dispatchThunk<ICombineCarsState>(this.store, startRaceTC());
  };

  private resetCarsParamsAndReturnToDefaultPosition = (): void => {
    this.startRaceBtn.node.removeAttribute(Attribute.DISABLED);
    dispatchThunk<ICombineCarsState>(this.store, resetRaceDataTC());
  };

  private render(): void {
    this.node.innerHTML = EmptyString;

    const generateFormWrapper = new BaseControl(generateFormWrapperProps);
    const raceBlockWrapper = new BaseControl(raceBlockWrapperProps);
    const carGenerateWrapper = new BaseControl(carGenerateWrapperProps);
    const garageGenerateControls = [
      new Input(inputNameProps, this.enterCarParams),
      new Input(inputColorProps, this.enterCarParams),
      new Button(buttonGenerateCarProps, this.generateCar),
      new Button(generateRandomCarsProps, this.generateRandomCars),
    ];
    const raceControlWrapper = new BaseControl(raceControlWrapperProps);
    const pageOutput = new BaseControl({
      tagName: Tag.OUTPUT,
      classes: [GarageClasses.CURRENT_PAGE],
      text: `#Page: ${this.currentPage}`,
    });
    const carsNumberOutput = new BaseControl({
      tagName: Tag.OUTPUT,
      classes: [GarageClasses.CARS_NUMBER],
      text: `Cars in garage: ${this.carsNumber.toString()}`,
    });

    carGenerateWrapper.node.append(
      ...garageGenerateControls.map((control) => control.node)
    );
    raceControlWrapper.node.append(this.startRaceBtn.node, this.resetBtn.node);
    raceBlockWrapper.node.append(raceControlWrapper.node, pageOutput.node);
    generateFormWrapper.node.append(
      carGenerateWrapper.node,
      carsNumberOutput.node
    );
    this.node.append(raceBlockWrapper.node, generateFormWrapper.node);
  }
}

export default GarageHeader;
