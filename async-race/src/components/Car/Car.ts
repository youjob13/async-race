import { Store } from 'redux';
import { AnyAction, CombinedState, ThunkDispatch } from '@reduxjs/toolkit';
import { getCarSelector } from '../../store/carsSelectors';
import './car.scss';
import {
  IBaseControl,
  ICarForm,
  ICombineState,
  ThunkDispatchType,
} from '../../shared/interfaces/api-models';
import BaseControl from '../../shared/BaseControl/BaseControl';
import Button from '../../shared/Button/Button';
import Input from '../../shared/Input/Input';
import { ICar, ICarsState } from '../../shared/interfaces/carState-model';
import {
  deleteCarTC,
  setEditCarMode,
  startCarEngineTC,
  stopCarEngineTC,
  updateCarParamsTC,
} from '../../store/carsSlice';

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
    (this.store.dispatch as ThunkDispatchType<ICombineState>)(
      updateCarParamsTC(newCarParams)
    );
  };

  private onStartEngineBtnClick = (): void => {
    this.startEngineBtn.node.setAttribute('disabled', 'disabled');
    (this.store.dispatch as ThunkDispatchType<ICombineState>)(
      startCarEngineTC(this.car.id)
    );
  };

  private onEditBtnClick = (): void => {
    this.store.dispatch(setEditCarMode(this.car.id));
  };

  private onStopEngineBtnClick = (): void => {
    (this.store.dispatch as ThunkDispatchType<ICombineState>)(
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

    const carImg = `<svg version="1.0" xmlns="http://www.w3.org/2000/svg"
        width="80px" height="100%" viewBox="0 0 1280.000000 720.000000"
        preserveAspectRatio="xMidYMid meet">
      <g transform="translate(0.000000,720.000000) scale(0.100000,-0.100000)"
      fill="${this.car.color}" stroke="none">
      <path d="M5775 5093 c-16 -8 -37 -22 -46 -29 -12 -11 -21 -11 -47 -2 -27 11
      -35 10 -59 -8 -36 -25 -100 -152 -115 -226 -11 -54 -11 -59 11 -81 12 -14 37
      -33 56 -43 25 -13 33 -24 33 -44 -2 -59 19 -78 218 -195 l156 -92 -36 -22
      c-131 -81 -100 -239 62 -313 34 -16 89 -31 122 -35 33 -3 60 -9 60 -14 0 -16
      -128 -18 -1166 -23 l-1060 -6 -32 45 c-37 53 -39 61 -12 70 71 23 102 245 55
      403 -17 58 -105 196 -134 211 -11 6 -49 11 -84 11 -49 0 -70 -5 -90 -20 -41
      -32 -94 -149 -102 -223 -7 -61 4 -161 20 -201 8 -17 5 -18 -41 -12 -88 13 -85
      5 -54 109 53 179 110 491 93 508 -6 6 -38 13 -72 16 l-61 6 0 38 c0 37 -1 38
      -46 45 -73 11 -122 0 -160 -37 -42 -40 -65 -96 -109 -256 -52 -190 -90 -322
      -95 -327 -3 -2 -84 -12 -180 -20 -96 -9 -218 -23 -270 -32 -98 -15 -480 -97
      -539 -116 -24 -7 -39 -7 -55 1 -18 10 -63 5 -241 -28 -644 -118 -1096 -181
      -1305 -181 -76 0 -141 -4 -144 -8 -2 -4 2 -46 11 -92 12 -72 13 -114 3 -270
      -6 -102 -15 -223 -21 -269 l-10 -85 -105 -160 -105 -160 6 -80 c25 -312 51
      -456 111 -611 61 -156 61 -161 25 -215 -17 -24 -27 -48 -22 -53 23 -23 257
      -57 556 -82 278 -23 373 -19 383 17 4 15 14 18 71 17 115 -2 118 -4 155 -94
      218 -529 819 -780 1350 -564 217 88 420 275 525 482 l34 67 52 0 c96 0 145
      -11 145 -31 0 -18 41 -19 1433 -19 787 0 2042 3 2788 7 1309 6 1356 7 1351 25
      -4 17 4 18 124 18 l129 -1 45 -71 c84 -133 226 -266 370 -346 273 -153 631
      -167 925 -37 78 35 206 120 277 184 65 59 167 190 204 262 l24 49 140 0 c136
      0 140 -1 140 -21 l0 -21 518 4 c391 3 522 7 540 16 17 10 22 22 22 52 0 21 -4
      41 -10 45 -5 3 -39 8 -75 12 -73 7 -74 8 -53 87 11 41 15 45 49 51 20 4 45 13
      56 20 16 12 13 14 -34 21 l-52 7 5 61 c8 87 7 86 61 86 69 0 176 19 191 34 25
      24 35 183 28 441 -7 265 -15 356 -41 445 -32 107 -206 245 -438 347 -682 301
      -2088 506 -3914 573 -266 10 -273 10 -309 35 -50 34 -123 55 -214 62 -69 5
      -84 10 -185 68 -469 266 -1334 683 -1575 760 -30 9 -60 23 -66 31 -14 17 -77
      44 -101 44 -10 -1 -31 -8 -48 -17z m-3825 -3229 c13 -13 13 -16 0 -24 -21 -14
      -81 -30 -111 -30 -42 0 -115 29 -140 57 l-24 25 130 -7 c91 -5 134 -11 145
      -21z m858 -35 c56 0 63 -2 42 -10 -30 -13 -119 -4 -134 12 -8 9 -6 10 7 5 10
      -3 49 -6 85 -7z m7250 -19 c77 -24 202 -26 282 -5 66 17 72 11 67 -61 -5 -71
      -45 -136 -105 -171 -39 -23 -59 -28 -112 -28 -89 1 -157 41 -196 118 -21 40
      -29 119 -15 145 7 12 13 22 14 22 1 0 31 -9 65 -20z m-7890 -80 c77 -24 216
      -27 287 -5 27 8 52 12 57 9 4 -3 8 -24 8 -46 0 -131 -94 -228 -223 -228 -122
      0 -229 125 -211 248 3 23 9 42 13 42 3 0 35 -9 69 -20z"/>
      </g>
    </svg>`;

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
