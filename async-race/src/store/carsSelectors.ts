import { createSelector } from 'reselect';
import {
  ICarsState,
  ICar,
  ICurrentWinner,
} from '../shared/interfaces/carState-model';

export const getCarsSelector = (state: ICarsState): ICar[] => state.cars;

export const getCurrentGaragePageSelector = (state: ICarsState): number =>
  state.currentGaragePage;

export const getCarsNumberSelector = (state: ICarsState): number =>
  state.carsNumber;

export const getCarsStateSelector = createSelector(
  getCarsSelector,
  getCurrentGaragePageSelector,
  (cars, currentGaragePage) => ({
    newCars: cars,
    newCurrentGaragePage: currentGaragePage,
  })
);

export const getCurrentWinnerSelector = (
  state: ICarsState
): ICurrentWinner | null => state.currentWinner;

export const getCarSelector = (
  state: ICarsState,
  id: number
): ICar | undefined => {
  return state.cars.find((car) => car.id === id); // TODO: rewrite without undefined
};
