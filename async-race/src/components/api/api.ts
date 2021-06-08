import { ICarItemState } from '../state/carState';

type Data = { name: string; color: string };

interface IApi {
  baseURL: string;
  getAllCars: () => Promise<ICarItemState[]>;
  createCar: (data: Data) => Promise<ICarItemState>;
  deleteCar: (id: number) => Promise<void>;
  updateCar: (id: number, data: Data) => Promise<ICarItemState>;
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

  async switchEngineMode(id: number, status = 'drive'): Promise<boolean> {
    try {
      const url = new URL(`${this.baseURL}`);
      url.searchParams.append('id', `${id}`);
      url.searchParams.append('status', `${status}`);

      const response = await fetch(`${url}`);
      if (response.status === 200) {
        const res = await response.json();
        return res;
      }
      if (response.status === 500) {
        console.log('erroras');
        console.log(response);
        return false;
      }
      throw new Error(response.statusText);
    } catch (error) {
      throw new Error(error);
    }
  },
};

const apiCars: IApi = {
  baseURL: 'http://127.0.0.1:3000/garage',

  async getAllCars(): Promise<ICarItemState[]> {
    try {
      const url = new URL(this.baseURL);
      const response = await fetch(`${url}`);
      const res = await response.json();
      return res;
    } catch (error) {
      throw new Error(error);
    }
  },

  async createCar(data: Data): Promise<ICarItemState> {
    try {
      const url = new URL(this.baseURL);
      const response = await fetch(`${url}`, {
        method: 'POST',
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

  async updateCar(id: number, data: Data): Promise<ICarItemState> {
    try {
      const url = new URL(`${this.baseURL}/${id}`);
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
