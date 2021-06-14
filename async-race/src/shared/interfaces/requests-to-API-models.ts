import { ICar } from './carState-model';

export type WinnerRequest = { id: number; wins: number; time: number };

export type CreateCarRequest = { name: string; color: string };

export interface IAPIRequest {
  baseURL: string;
}

export interface ICarsAPIRequest extends IAPIRequest {
  getAllCars: (
    page?: number,
    limit?: number
  ) => Promise<{ res: ICar[]; totalCarsNumber: number | null }>;
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
