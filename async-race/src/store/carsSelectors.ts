// import { createSelector } from 'reselect';
import { ICarItemState, ICarState } from '../shared/interfaces/carState-model';

export const getCarsSelector = (state: ICarState): ICarItemState[] =>
  state.cars;

// export const getCarsSelector = createSelector(getCars, (cars) => cars);

export const getCurrentGaragePageSelector = (state: ICarState): number =>
  state.currentGaragePage;

export const getCarSelector = (
  state: ICarState,
  id: number
): ICarItemState | undefined => {
  return state.cars.find((car) => car.id === id); // TODO: rewrite without undefined
};

export const startEngine = (
  state: ICarState,
  id: number
): ICarItemState | undefined => {
  return state.cars.find((car) => car.id === id); // TODO: rewrite without undefined
};
