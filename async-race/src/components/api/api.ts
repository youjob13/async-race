import { ICar } from '../../shared/interfaces/carState-model';

type Data = { name: string; color: string };

interface IApi {
  baseURL: string;
  getAllCars: (
    page?: number,
    limit?: number
  ) => Promise<{ res: ICar[]; totalCarsNumber: number | null }>;
  createCar: (data: Data) => Promise<ICar>;
  deleteCar: (id: number) => Promise<void>;
  updateCar: (data: ICar) => Promise<ICar>;
}

export const apiEngine = {
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

      if (response.status === 200 || response.status === 500) {
        const res = await response.json();
        return res;
      }
      console.log(response);
      // if (response.status === 500) {
      //   return false;
      // }
      throw new Error(response.statusText);
    } catch (error) {
      throw new Error(error);
    }
  },
};

const apiCars: IApi = {
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

  async createCar(data: Data): Promise<ICar> {
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
export default apiCars;
