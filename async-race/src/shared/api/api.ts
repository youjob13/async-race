import { ICar } from '../interfaces/carState-model';
import {
  CreateCarRequest,
  ICarsAPIRequest,
  IEngineAPIRequest,
  IWinnerAPIRequest,
  GetAllCars,
  IWinnerAPIResponse,
  IEngineAPIResponse,
} from '../interfaces/requests-to-API-models';
import {
  AdditionalAPIURL,
  BASE_URL,
  ContentType,
  EngineSearchParams,
  RequestMethod,
  RESPONSE_HEADER,
  ResponseError,
  WinnerSearchParams,
  WinnersSorting,
  WinnersSortingOrder,
} from '../variables';
import { IWinner } from '../interfaces/winnersState-models';

export const apiWinner: IWinnerAPIRequest = {
  baseURL: `${BASE_URL}/${AdditionalAPIURL.WINNERS}`,

  async createWinner(data: IWinner): Promise<IWinner> {
    try {
      const url = new URL(`${this.baseURL}`);

      const response = await fetch(`${url}`, {
        method: RequestMethod.POST,
        headers: {
          'Content-Type': ContentType.APPLICATION_JSON,
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
        method: RequestMethod.PUT,
        headers: {
          'Content-Type': ContentType.APPLICATION_JSON,
        },
        body: JSON.stringify({ wins: data.wins, time: data.time }),
      });
      return await response.json();
    } catch (error) {
      throw new Error(error);
    }
  },

  async deleteWinner(id: number): Promise<void> {
    try {
      const url = new URL(`${this.baseURL}/${id}`);
      await fetch(`${url}`, {
        method: RequestMethod.DELETE,
      });
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
      if (error.toString() === ResponseError.NOT_FOUND) {
        return undefined;
      }

      throw new Error(error);
    }
  },

  async getWinners(
    page?: number,
    limit?: number,
    sort?: WinnersSorting,
    order?: WinnersSortingOrder
  ): Promise<IWinnerAPIResponse> {
    try {
      const url = new URL(`${this.baseURL}`);

      url.searchParams.append(WinnerSearchParams.PAGE, `${page}`);
      url.searchParams.append(WinnerSearchParams.LIMIT, `${limit}`);
      url.searchParams.append(WinnerSearchParams.SORT, `${sort}`);
      url.searchParams.append(WinnerSearchParams.ORDER, `${order}`);

      const response = await fetch(`${url}`);
      const winners = await response.json();

      return {
        winners,
        totalWinnersNumber: Number(response.headers.get(RESPONSE_HEADER)),
      };
    } catch (error) {
      throw new Error(error);
    }
  },
};

export const apiEngine: IEngineAPIRequest = {
  baseURL: `${BASE_URL}/${AdditionalAPIURL.ENGINE}`,

  async toggleEngine(id: number, status: string): Promise<IEngineAPIResponse> {
    try {
      const url = new URL(`${this.baseURL}`);
      url.searchParams.append(EngineSearchParams.ID, `${id}`);
      url.searchParams.append(EngineSearchParams.STATUS, `${status}`);

      const response = await fetch(`${url}`);
      return await response.json();
    } catch (error) {
      throw new Error(error);
    }
  },

  async switchEngineMode(id: number, status: string): Promise<boolean> {
    try {
      const url = new URL(`${this.baseURL}`);
      url.searchParams.append(EngineSearchParams.ID, `${id}`);
      url.searchParams.append(EngineSearchParams.STATUS, `${status}`);

      const response = await fetch(`${url}`);

      if (response.status === 500) {
        throw new Error(ResponseError.ENGINE_IS_BROKEN);
      }

      return await response.json();
    } catch (error) {
      if (error.toString() === `Error: ${ResponseError.ENGINE_IS_BROKEN}`) {
        return false;
      }

      throw new Error(error);
    }
  },
};

export const apiCars: ICarsAPIRequest = {
  baseURL: `${BASE_URL}/${AdditionalAPIURL.GARAGE}`,

  async getAllCars(page?: number, limit?: number): Promise<GetAllCars> {
    try {
      const url = new URL(this.baseURL);

      url.searchParams.append(WinnerSearchParams.PAGE, `${page}`);
      url.searchParams.append(WinnerSearchParams.LIMIT, `${limit}`);

      const response = await fetch(`${url}`);
      const cars = await response.json();

      return {
        cars,
        totalCarsNumber: Number(response.headers.get(RESPONSE_HEADER)),
      };
    } catch (error) {
      throw new Error(error);
    }
  },

  async createCar(data: CreateCarRequest): Promise<ICar> {
    try {
      const url = new URL(this.baseURL);
      const response = await fetch(`${url}`, {
        method: RequestMethod.POST,
        headers: {
          'Content-Type': ContentType.APPLICATION_JSON,
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
        method: RequestMethod.DELETE,
      });
    } catch (error) {
      throw new Error(error);
    }
  },

  async getCar(id: number): Promise<ICar> {
    try {
      const url = new URL(`${this.baseURL}/${id}`);
      const response = await fetch(`${url}`, {
        method: RequestMethod.GET,
      });
      return await response.json();
    } catch (error) {
      throw new Error(error);
    }
  },

  async updateCar(data: ICar): Promise<ICar> {
    try {
      const url = new URL(`${this.baseURL}/${data.id}`);
      const response = await fetch(`${url}`, {
        method: RequestMethod.PUT,
        headers: {
          'Content-Type': ContentType.APPLICATION_JSON,
        },
        body: JSON.stringify(data),
      });
      return await response.json();
    } catch (error) {
      throw new Error(error);
    }
  },
};
