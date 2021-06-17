import { ICar } from '../interfaces/carState-model';
import {
  CreateCarRequest,
  ICarsAPIRequest,
  IEngineAPIRequest,
  IWinnerAPIRequest,
  GetAllCars,
} from '../interfaces/requests-to-API-models';
import { BASE_URL } from '../variables';
import { IWinner } from '../interfaces/winnersState-models';

export const apiWinner: IWinnerAPIRequest = {
  baseURL: `${BASE_URL}/winners`,

  async createWinner(data: IWinner): Promise<IWinner> {
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

  async updateWinner(data: IWinner): Promise<IWinner> {
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

  async getWinner(id: number): Promise<IWinner | undefined> {
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
      throw new Error(error);
    }
  },

  async getWinners(
    page?: number,
    limit?: number,
    sort?: string | 'id' | 'wins' | 'time',
    order?: string | 'DESC' | 'ASC' // TODO: enum
  ): Promise<{ winners: IWinner[]; totalWinnersNumber: number }> {
    try {
      const url = new URL(`${this.baseURL}`);
      url.searchParams.append('_page', `${page}`);
      url.searchParams.append('_limit', `${limit}`);
      url.searchParams.append('_sort', `${sort}`);
      url.searchParams.append('_order', `${order}`);

      const response = await fetch(`${url}`);
      const winners = await response.json();
      return {
        winners,
        totalWinnersNumber: Number(response.headers.get('X-Total-Count')),
      };
    } catch (error) {
      throw new Error(error);
    }
  },
};

export const apiEngine: IEngineAPIRequest = {
  baseURL: `${BASE_URL}/engine`,

  async toggleEngine(
    id: number,
    status: string
  ): Promise<{ velocity: number; distance: number }> {
    try {
      const url = new URL(`${this.baseURL}`);
      url.searchParams.append('id', `${id}`);
      url.searchParams.append('status', `${status}`);

      const response = await fetch(`${url}`);
      return await response.json();
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
  baseURL: `${BASE_URL}/garage`,

  async getAllCars(page?: number, limit?: number): Promise<GetAllCars> {
    try {
      const url = new URL(this.baseURL);
      url.searchParams.append('_page', `${page}`);
      url.searchParams.append('_limit', `${limit}`);
      const response = await fetch(`${url}`);
      const cars = await response.json();
      return {
        cars,
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
      return await response.json();
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
      return await response.json();
    } catch (error) {
      throw new Error(error);
    }
  },
};
