import { ICar } from './carState-model';

export interface IUpdateWinners {
  id: number;
  newWinsCount: number;
}

export interface ISetRaceWinner {
  carName: string;
  time: number;
}

export interface IToggleEngineMode {
  id: number;
  status: string;
  timeToFinish?: number;
}

export type IStartRace = number[];

export type CarID = number;

export interface CarParams {
  id: number;
  name: string;
  color: string;
}

export interface ISetAllCars {
  cars: ICar[];
  totalCarsNumber: number | null;
  currentGaragePage: number | undefined;
}
