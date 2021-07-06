import { Store } from 'redux';
import { getCar } from '../../../../store/carsSelectors';
import './car.scss';
import {
  IBaseControl,
  ICarForm,
  ICombineCarsState,
  ICombineWinnersState,
} from '../../../../shared/interfaces/api-models';
import BaseControl from '../../../../shared/templates/BaseControl/BaseControl';
import Button from '../../../../shared/templates/Button/Button';
import Input from '../../../../shared/templates/Input/Input';
import { ICar } from '../../../../shared/interfaces/carState-model';
import {
  deleteCarTC,
  setEditCarMode,
  startCarEngineTC,
  stopCarEngineTC,
  updateCarParamsTC,
} from '../../../../store/carsSlice';
import getCarSVG from '../../../../shared/carSVG';
import { deleteWinnerTC } from '../../../../store/winnersSlice';
import dispatchThunk from '../../../../shared/helperFunctions/dispatchThunk';
import {
  Attribute,
  ButtonClass,
  CarClasses,
  DrivingMode,
  EmptyString,
  GarageClasses,
  INDEX_EDIT_BUTTON,
  ONE_SECOND,
  Tag,
} from '../../../../shared/variables';

const START_ENGINE_BUTTON_TEXT = 'Start';
const STOP_ENGINE_BUTTON_TEXT = 'Stop';
const DELETE_CAR_BUTTON_TEXT = 'Delete';
const CONFIRM_EDIT_BUTTON_TEXT = 'Confirm';
const EDIT_BUTTON_TEXT = 'Edit';

const carPropsToBaseControl = {
  tagName: Tag.DIV,
  classes: [CarClasses.GARAGE_CAR, CarClasses.CAR],
};
const roadProps = {
  tagName: Tag.DIV,
  classes: [CarClasses.ROAD],
};
const carImgWrapperProps = {
  tagName: Tag.DIV,
  classes: [CarClasses.IMAGE_WRAPPER],
};
const startEngineButtonProps = {
  tagName: Tag.BUTTON,
  classes: [CarClasses.START_ENGINE, ButtonClass],
  text: START_ENGINE_BUTTON_TEXT,
};
const stopEngineButtonProps = {
  tagName: Tag.BUTTON,
  classes: [CarClasses.STOP_ENGINE, ButtonClass],
  text: STOP_ENGINE_BUTTON_TEXT,
};
const controlWrapperProps = {
  tagName: Tag.DIV,
  classes: [CarClasses.BUTTONS],
};
const removeCarButtonProps = {
  tagName: Tag.BUTTON,
  classes: [CarClasses.DELETE, ButtonClass],
  text: DELETE_CAR_BUTTON_TEXT,
};
const carParamsUpdateFormProps = {
  tagName: Tag.DIV,
  classes: [CarClasses.UPDATE_FORM],
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
const confirmEditButtonProps = {
  tagName: Tag.BUTTON,
  classes: [CarClasses.EDIT_CONFIRM, ButtonClass],
  text: CONFIRM_EDIT_BUTTON_TEXT,
};
const editCarButtonProps = {
  tagName: Tag.BUTTON,
  classes: [CarClasses.EDIT, ButtonClass],
  text: EDIT_BUTTON_TEXT,
};
const carContentProps = {
  tagName: Tag.DIV,
  classes: [CarClasses.CONTENT],
};

class Car extends BaseControl<HTMLElement> {
  private readonly carImgWrapper: IBaseControl<HTMLElement>;

  private readonly road: IBaseControl<HTMLElement>;

  private readonly startEngineBtn: Button;

  private readonly stopEngineBtn: Button;

  private readonly carParamsUpdateForm: ICarForm;

  private requestAnimId: number;

  constructor(private car: ICar, private readonly store: Store) {
    super(carPropsToBaseControl);
    this.road = new BaseControl(roadProps);
    this.carImgWrapper = new BaseControl(carImgWrapperProps);
    this.startEngineBtn = new Button(
      startEngineButtonProps,
      this.turnOnCarEngine
    );
    this.stopEngineBtn = new Button(
      stopEngineButtonProps,
      this.turnOffCarEngine
    );
    this.carParamsUpdateForm = {
      name: EmptyString,
      color: EmptyString,
    };
    this.requestAnimId = 0;

    this.store.subscribe(() => {
      const updatedCar = getCar(this.store.getState().carReducer, this.car.id);

      if (!updatedCar) return;

      if (JSON.stringify(updatedCar) !== JSON.stringify(this.car)) {
        if (updatedCar.wins !== this.car.wins) {
          this.car = { ...updatedCar };
          return;
        }

        this.car = { ...updatedCar };

        if (updatedCar.drivingMode === DrivingMode.BREAKING) {
          return;
        }

        if (
          updatedCar.drivingMode === DrivingMode.STARTED &&
          this.car.timeToFinish
        ) {
          this.startCarMove();
        } else if (updatedCar) {
          this.resetCarPosition();
          this.render();
        }
      }
    });

    this.render();
  }

  private removeCar = (): void => {
    dispatchThunk<ICombineCarsState>(this.store, deleteCarTC(this.car.id));
    dispatchThunk<ICombineWinnersState>(
      this.store,
      deleteWinnerTC(this.car.id)
    );
  };

  private enterCarParam = (type: string, value: string): void => {
    this.carParamsUpdateForm[type] = value;
  };

  private confirmEdit = (): void => {
    const carName =
      this.carParamsUpdateForm.name !== EmptyString
        ? this.carParamsUpdateForm.name
        : this.car.name;

    const carColor =
      this.carParamsUpdateForm.color !== EmptyString
        ? this.carParamsUpdateForm.color
        : this.car.color;

    const newCarParams = {
      id: this.car.id,
      name: carName,
      color: carColor,
    };

    dispatchThunk<ICombineCarsState>(
      this.store,
      updateCarParamsTC(newCarParams)
    );
  };

  private turnOnCarEngine = (): void => {
    this.startEngineBtn.node.setAttribute(
      Attribute.DISABLED,
      Attribute.DISABLED
    );
    dispatchThunk<ICombineCarsState>(this.store, startCarEngineTC(this.car.id));
  };

  private openCarEditForm = (): void => {
    this.store.dispatch(setEditCarMode(this.car.id));
  };

  private turnOffCarEngine = (): void => {
    dispatchThunk<ICombineCarsState>(
      this.store,
      stopCarEngineTC(this.car.id, DrivingMode.STOPPED)
    );
  };

  private resetCarPosition = (): void => {
    this.carImgWrapper.node.style.transform = `translateX(0)`;
    this.startEngineBtn.node.removeAttribute(Attribute.DISABLED);
  };

  private startCarMove = (): void => {
    this.stopEngineBtn.node.removeAttribute(Attribute.DISABLED);
    const timeToFinish = this.car.timeToFinish || 0;

    const roadLength =
      this.road.node.getBoundingClientRect().width -
      this.carImgWrapper.node.getBoundingClientRect().width;

    const speed = (roadLength / timeToFinish) * ONE_SECOND;

    const startTime = performance.now();

    this.requestAnimId = requestAnimationFrame(
      this.animateCarMove.bind(this, startTime, roadLength, speed)
    );
  };

  private animateCarMove = (
    startTime: number,
    roadLength: number,
    speed: number
  ) => {
    if (this.car.drivingMode === DrivingMode.BREAKING) {
      cancelAnimationFrame(this.requestAnimId);
      return;
    }
    if (this.car.drivingMode === DrivingMode.STOPPED) {
      this.resetCarPosition();
      cancelAnimationFrame(this.requestAnimId);
      return;
    }

    const carPosition = ((performance.now() - startTime) / ONE_SECOND) * speed;

    this.carImgWrapper.node.style.transform = `translateX(${carPosition}px)`;

    if (
      carPosition < roadLength &&
      this.car.drivingMode === DrivingMode.STARTED
    ) {
      requestAnimationFrame(
        this.animateCarMove.bind(this, startTime, roadLength, speed)
      );
    } else {
      cancelAnimationFrame(this.requestAnimId);
    }
  };

  render(): void {
    this.node.innerHTML = EmptyString;

    const controlWrapper = new BaseControl(controlWrapperProps);
    const carControlButtons = [
      new Button(removeCarButtonProps, this.removeCar),
      new Button(editCarButtonProps, this.openCarEditForm),
      this.startEngineBtn,
      this.stopEngineBtn,
    ];
    const carImg = getCarSVG(this.car.color);
    const carContent = new BaseControl(carContentProps);
    const textContent = new BaseControl({
      tagName: Tag.P,
      classes: [CarClasses.INFO],
      text: this.car.name,
    });

    if (this.car.isEdit) {
      carControlButtons[INDEX_EDIT_BUTTON].node.setAttribute(
        Attribute.DISABLED,
        Attribute.DISABLED
      );

      const carParamsUpdateFormWrapper = new BaseControl(
        carParamsUpdateFormProps
      );
      const carParamsUpdateForm = [
        new Input(inputNameProps, this.enterCarParam),
        new Input(inputColorProps, this.enterCarParam),
        new Button(confirmEditButtonProps, this.confirmEdit),
      ];

      carParamsUpdateFormWrapper.node.append(
        ...carParamsUpdateForm.map((control) => control.node)
      );
      controlWrapper.node.append(
        ...carControlButtons.map((button) => button.node),
        carParamsUpdateFormWrapper.node
      );
    }

    controlWrapper.node.append(
      ...carControlButtons.map((button) => button.node)
    );
    this.carImgWrapper.node.innerHTML = carImg;
    this.road.node.append(this.carImgWrapper.node);
    carContent.node.append(textContent.node, controlWrapper.node);
    this.node.append(carContent.node, this.road.node);
  }
}

export default Car;
