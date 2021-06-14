import { ICar } from '../interfaces/carState-model';
import {
  CreateCarRequest,
  WinnerRequest,
  ICarsAPIRequest,
  IEngineAPIRequest,
  IWinnerAPIRequest,
} from '../interfaces/requests-to-API-models';

export const apiWinner: IWinnerAPIRequest = {
  baseURL: 'http://127.0.0.1:3000/winners',

  async createWinner(data: {
    id: number;
    wins: number;
    time: number;
  }): Promise<{ id: number; wins: number; time: number }> {
    try {
      const url = new URL(`${this.baseURL}`);

      const response = await fetch(`${url}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      return await response.json();
    } catch (error) {
      throw new Error(error);
    }
  },

  async updateWinner(data: {
    id: number;
    wins: number;
    time: number;
  }): Promise<{ id: number; wins: number; time: number }> {
    try {
      const url = new URL(`${this.baseURL}/${data.id}`);
      const response = await fetch(`${url}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ wins: data.wins, time: data.time }),
      });
      return await response.json();
    } catch (error) {
      throw new Error(error);
    }
  },

  async getWinner(id: number): Promise<WinnerRequest | undefined> {
    try {
      const url = new URL(`${this.baseURL}/${id}`);
      const response = await fetch(`${url}`);
      if (response.status === 404) {
        throw new Error(response.statusText);
      }
      return await response.json();
    } catch (error) {
      if (error.toString() === 'Error: Not Found') {
        return undefined;
      }
      console.log(error);
      throw new Error(error);
    }
  },
};

export const apiEngine: IEngineAPIRequest = {
  baseURL: 'http://127.0.0.1:3000/engine',

  async toggleEngine(
    id: number,
    status: string
  ): Promise<{ velocity: number; distance: number }> {
    try {
      const url = new URL(`${this.baseURL}`);
      url.searchParams.append('id', `${id}`);
      url.searchParams.append('status', `${status}`);

      const response = await fetch(`${url}`);
      const res = await response.json();

      return res;
    } catch (error) {
      throw new Error(error);
    }
  },

  async switchEngineMode(id: number, status: string): Promise<boolean> {
    try {
      const url = new URL(`${this.baseURL}`);
      url.searchParams.append('id', `${id}`);
      url.searchParams.append('status', `${status}`);

      const response = await fetch(`${url}`);

      if (response.status === 500) {
        throw new Error('Engine is broken');
      }

      return await response.json();
    } catch (error) {
      if (error.toString() === 'Error: Engine is broken') {
        return false;
      }
      throw new Error(error);
    }
  },
};

export const apiCars: ICarsAPIRequest = {
  baseURL: 'http://127.0.0.1:3000/garage',

  async getAllCars(
    page?: number,
    limit?: number
  ): Promise<{ res: ICar[]; totalCarsNumber: number | null }> {
    try {
      const url = new URL(this.baseURL);
      url.searchParams.append('_page', `${page}`);
      url.searchParams.append('_limit', `${limit}`);
      const response = await fetch(`${url}`);
      const res = await response.json();
      return {
        res,
        totalCarsNumber: Number(response.headers.get('X-Total-Count')),
      };
    } catch (error) {
      throw new Error(error);
    }
  },

  async createCar(data: CreateCarRequest): Promise<ICar> {
    try {
      const url = new URL(this.baseURL);
      const response = await fetch(`${url}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json;charset=utf-8',
        },
        body: JSON.stringify(data),
      });
      // return response;
      const res = await response.json();
      return res;
    } catch (error) {
      throw new Error(error);
    }
  },

  async deleteCar(id: number): Promise<void> {
    try {
      const url = new URL(`${this.baseURL}/${id}`);
      await fetch(`${url}`, {
        method: 'DELETE',
      });
    } catch (error) {
      throw new Error(error);
    }
  },

  async updateCar(data: ICar): Promise<ICar> {
    try {
      const url = new URL(`${this.baseURL}/${data.id}`);
      const response = await fetch(`${url}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json;charset=utf-8',
        },
        body: JSON.stringify(data),
      });
      const res = await response.json();
      return res;
    } catch (error) {
      throw new Error(error);
    }
  },
};
