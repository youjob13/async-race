import { ICar } from './carState-model';

export type WinnerRequest = { id: number; wins: number; time: number };

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

export interface IWinnerAPIRequest extends IAPIRequest {
  createWinner: (data: WinnerRequest) => Promise<WinnerRequest>;
  getWinner: (id: number) => Promise<WinnerRequest | undefined>;
  updateWinner: (data: WinnerRequest) => Promise<WinnerRequest>;
}