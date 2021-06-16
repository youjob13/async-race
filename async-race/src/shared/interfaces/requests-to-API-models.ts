import { ICar } from './carState-model';
import { IWinner } from './winnersState-models';

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
}

export interface IEngineAPIRequest extends IAPIRequest {
  toggleEngine: (
    id: number,
    status: string
  ) => Promise<{ velocity: number; distance: number }>;
  switchEngineMode: (id: number, status: string) => Promise<boolean>;
}

export enum Sort {
  'id',
  'wins',
  'time',
}

export interface IWinnerAPIRequest extends IAPIRequest {
  createWinner: (data: IWinner) => Promise<IWinner>;
  getWinner: (id: number) => Promise<IWinner | undefined>;
  updateWinner: (data: IWinner) => Promise<IWinner>;
  getWinners: (
    page?: number,
    limit?: number,
    sort?: 'id' | 'wins' | 'time', // TODO: enum
    order?: 'ASC' | 'DESC' // TODO: enum
  ) => Promise<{ winners: IWinner[]; totalWinnersNumber: number }>;
}
