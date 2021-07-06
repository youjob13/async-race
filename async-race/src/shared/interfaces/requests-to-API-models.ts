import { ICar } from './carState-model';
import { IWinner } from './winnersState-models';
import { WinnersSorting, WinnersSortingOrder } from '../variables';

export interface IWinnerAPIResponse {
  winners: IWinner[];
  totalWinnersNumber: number;
}

export interface IEngineAPIResponse {
  velocity: number;
  distance: number;
}

export type CreateCarRequest = { name: string; color: string };

export type GetAllCars = { cars: ICar[]; totalCarsNumber: number | null };

export interface IAPIRequest {
  baseURL: string;
}

export interface ICarsAPIRequest extends IAPIRequest {
  getAllCars: (page?: number, limit?: number) => Promise<GetAllCars>;
  createCar: (data: CreateCarRequest) => Promise<ICar>;
  deleteCar: (id: number) => Promise<void>;
  updateCar: (data: ICar) => Promise<ICar>;
  getCar: (id: number) => Promise<ICar>;
}

export interface IEngineAPIRequest extends IAPIRequest {
  toggleEngine: (id: number, status: string) => Promise<IEngineAPIResponse>;
  switchEngineMode: (id: number, status: string) => Promise<boolean>;
}

export interface IWinnerAPIRequest extends IAPIRequest {
  createWinner: (data: IWinner) => Promise<IWinner>;
  getWinner: (id: number) => Promise<IWinner | undefined>;
  deleteWinner: (id: number) => Promise<void>;
  updateWinner: (data: IWinner) => Promise<IWinner>;
  getWinners: (
    page?: number,
    limit?: number,
    sort?: WinnersSorting,
    order?: WinnersSortingOrder
  ) => Promise<IWinnerAPIResponse>;
}
