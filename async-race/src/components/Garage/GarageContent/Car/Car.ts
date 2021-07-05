import { Store } from 'redux';
import { AnyAction, CombinedState, ThunkDispatch } from '@reduxjs/toolkit';
import { getCarSelector } from '../../../../store/carsSelectors';
import './car.scss';
import {
  IBaseControl,
  ICarForm,
  ICombineCarsState,
  ThunkDispatchType,
} from '../../../../shared/interfaces/api-models';
import BaseControl from '../../../../shared/templates/BaseControl/BaseControl';
import Button from '../../../../shared/templates/Button/Button';
import Input from '../../../../shared/templates/Input/Input';
import { ICar, ICarsState } from '../../../../shared/interfaces/carState-model';
import {
  deleteCarTC,
  setEditCarMode,
  startCarEngineTC,
  stopCarEngineTC,
  updateCarParamsTC,
} from '../../../../store/carsSlice';
import getCarSVG from '../../../../shared/carSVG';
import { deleteWinnerTC } from '../../../../store/winnersSlice';
import { IWinnersState } from '../../../../shared/interfaces/winnersState-models';

class Car extends BaseControl<HTMLElement> {
  private carImgWrapper: IBaseControl<HTMLElement>;

  private road: IBaseControl<HTMLElement>;

  private startEngineBtn: Button;

  private stopEngineBtn: Button;

  private updateValueCarForm: ICarForm;

  private requestAnimId: number;

  constructor(private car: ICar, private store: Store) {
    super({ tagName: 'div', classes: ['garage__car', 'car'] });
    this.road = new BaseControl({
      tagName: 'div',
      classes: ['car__road'],
    });
    this.carImgWrapper = new BaseControl({
      tagName: 'div',
      classes: ['car__img-wrapper'],
    });
    this.startEngineBtn = new Button(
      {
        tagName: 'button',
        classes: ['car__start-engine', 'button'],
        text: 'Start',
      },
      this.onStartEngineBtnClick
    );
    this.stopEngineBtn = new Button(
      {
        tagName: 'button',
        classes: ['car__start-engine', 'button'],
        text: 'Stop',
      },
      this.onStopEngineBtnClick
    );
    this.updateValueCarForm = {
      name: '',
      color: '',
    };
    this.requestAnimId = 0;

    this.store.subscribe(() => {
      const updatedCar = getCarSelector(
        this.store.getState().carReducer,
        this.car.id
      );

      if (!updatedCar) return;

      if (JSON.stringify(updatedCar) !== JSON.stringify(this.car)) {
        if (updatedCar.wins !== this.car.wins) {
          this.car = { ...updatedCar };
          return;
        } // TODO: rewrite

        this.car = { ...updatedCar };
        if (updatedCar.drivingMode === 'started') {
          // this.car = { ...updatedCar };
          if (this.car.timeToFinish) {
            this.startEngine();
          }
        } else if (updatedCar.drivingMode === 'breaking') {
          // this.car = { ...updatedCar };
        } else if (updatedCar) {
          this.resetCarPosition(); // TODO: rewrite
          this.render();
        }
      }
    });

    this.render();
  }

  private onDeleteBtnClick = (): void => {
    (
      this.store.dispatch as ThunkDispatch<
        CombinedState<{ carReducer: ICarsState }>,
        unknown,
        AnyAction
      >
    )(deleteCarTC(this.car.id));
    (
      this.store.dispatch as ThunkDispatch<
        CombinedState<{ winnersReducer: IWinnersState }>,
        unknown,
        AnyAction
      >
    )(deleteWinnerTC(this.car.id));
  };

  private handleInput = (type: string, value: string): void => {
    this.updateValueCarForm[type] = value;
  };

  private onConfirmEditBtnClick = (): void => {
    const newCarParams = {
      id: this.car.id,
      name:
        this.updateValueCarForm.name !== ''
          ? this.updateValueCarForm.name
          : this.car.name,
      color:
        this.updateValueCarForm.color !== ''
          ? this.updateValueCarForm.color
          : this.car.color,
    };
    (this.store.dispatch as ThunkDispatchType<ICombineCarsState>)(
      updateCarParamsTC(newCarParams)
    );
  };

  private onStartEngineBtnClick = (): void => {
    this.startEngineBtn.node.setAttribute('disabled', 'disabled');
    (this.store.dispatch as ThunkDispatchType<ICombineCarsState>)(
      startCarEngineTC(this.car.id)
    );
  };

  private onEditBtnClick = (): void => {
    this.store.dispatch(setEditCarMode(this.car.id));
  };

  private onStopEngineBtnClick = (): void => {
    (this.store.dispatch as ThunkDispatchType<ICombineCarsState>)(
      stopCarEngineTC(this.car.id, 'stopped')
    );
  };

  private resetCarPosition = (): void => {
    this.carImgWrapper.node.style.transform = `translateX(0)`;
    this.startEngineBtn.node.removeAttribute('disabled');
  };

  private startEngine = (): void => {
    this.stopEngineBtn.node.removeAttribute('disabled');
    const timeToFinish = this.car.timeToFinish || 0;

    const roadLength =
      this.road.node.getBoundingClientRect().width -
      this.carImgWrapper.node.getBoundingClientRect().width;

    const speed = (roadLength / timeToFinish) * 1000;

    const startTime = performance.now();

    this.requestAnimId = window.requestAnimationFrame(
      this.animateCarMove.bind(this, startTime, roadLength, speed)
    );
  };

  private animateCarMove = (
    startTime: number,
    roadLength: number,
    speed: number
  ) => {
    if (this.car.drivingMode === 'breaking') {
      window.cancelAnimationFrame(this.requestAnimId);
      return;
    }
    if (this.car.drivingMode === 'stopped') {
      this.resetCarPosition();
      window.cancelAnimationFrame(this.requestAnimId);
      return;
    }

    const carPosition = ((performance.now() - startTime) / 1000) * speed;

    this.carImgWrapper.node.style.transform = `translateX(${carPosition}px)`;

    if (carPosition < roadLength && this.car.drivingMode === 'started') {
      window.requestAnimationFrame(
        this.animateCarMove.bind(this, startTime, roadLength, speed)
      );
    } else {
      window.cancelAnimationFrame(this.requestAnimId);
    }
  };

  render(): void {
    this.node.innerHTML = '';

    const buttonsWrapper = new BaseControl({
      tagName: 'div',
      classes: ['car__buttons'],
    });

    const deleteCarBtn = new Button(
      {
        tagName: 'button',
        classes: ['car__delete', 'button'],
        text: 'Delete',
      },
      this.onDeleteBtnClick
    );

    if (this.car.isEdit) {
      const updateCarParamsWrapper = new BaseControl({
        tagName: 'div',
        classes: ['car__update-params-wrapper'],
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
          classes: ['generate-car__input', 'generate-car__input_name'],
          attributes: { type: 'color', name: 'color' },
        },
        this.handleInput
      );

      const confirmEditBtn = new Button(
        {
          tagName: 'button',
          classes: ['car__edit_confirm', 'button'],
          text: 'Confirm',
        },
        this.onConfirmEditBtnClick
      );

      updateCarParamsWrapper.node.append(
        inputName.node,
        inputColor.node,
        confirmEditBtn.node
      );
      buttonsWrapper.node.append(
        deleteCarBtn.node,
        updateCarParamsWrapper.node,
        this.startEngineBtn.node,
        this.stopEngineBtn.node
      );
    } else {
      const editCarBtn = new Button(
        {
          tagName: 'button',
          classes: ['car__edit', 'button'],
          text: 'Edit',
        },
        this.onEditBtnClick
      );
      buttonsWrapper.node.append(
        deleteCarBtn.node,
        editCarBtn.node,
        this.startEngineBtn.node,
        this.stopEngineBtn.node
      );
    }

    const carImg = getCarSVG(this.car.color);

    this.carImgWrapper.node.innerHTML = carImg;
    this.road.node.append(this.carImgWrapper.node);

    const carContent = new BaseControl({
      tagName: 'div',
      classes: ['car__content'],
    });

    const textContent = new BaseControl({
      tagName: 'p',
      classes: ['car__info'],
      text: this.car.name,
    });

    carContent.node.append(textContent.node, buttonsWrapper.node);

    this.node.append(carContent.node, this.road.node);
  }
}

export default Car;
