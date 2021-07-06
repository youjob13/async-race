import { createSelector } from 'reselect';
import {
  ICarsState,
  ICar,
  ICurrentWinner,
} from '../shared/interfaces/carState-model';

export const getCars = (state: ICarsState): ICar[] => state.cars;

export const getCurrentGaragePage = (state: ICarsState): number =>
  state.currentGaragePage;

export const getCarsNumber = (state: ICarsState): number => state.carsNumber;

export const getRaceStatus = (state: ICarsState): boolean =>
  state.isStartedRace;

export const getCurrentWinner = (state: ICarsState): ICurrentWinner | null =>
  state.currentWinner;

export const getCarsState = createSelector(
  [getCars, getCurrentGaragePage, getCarsNumber, getCurrentWinner],
  (cars, currentGaragePage, carsNumber, currentWinner) => ({
    newCars: cars,
    newGaragePage: currentGaragePage,
    newCarsNumber: carsNumber,
    newWinner: currentWinner,
  })
);

export const getCar = (state: ICarsState, id: number): ICar | undefined => {
  return state.cars.find((car) => car.id === id);
};
