import { ICarItemState } from '../state/carState';

type Data = { name: string; color: string };

interface IApi {
  baseURL: string;
  getCars: () => Promise<ICarItemState[]>;
  createCar: (data: Data) => Promise<ICarItemState>;
  deleteCar: (id: number) => Promise<void>;
  updateCar: (id: number, data: Data) => Promise<ICarItemState>;
}

const api: IApi = {
  baseURL: 'http://127.0.0.1:3000',

  async getCars(): Promise<ICarItemState[]> {
    try {
      const url = new URL(`${this.baseURL}/garage`);
      const response = await fetch(`${url}`);
      const res = await response.json();
      return res;
    } catch (error) {
      throw new Error(error);
    }
  },

  async createCar(data: Data): Promise<ICarItemState> {
    try {
      const url = new URL(`${this.baseURL}/garage`);
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
      const url = new URL(`${this.baseURL}/garage/${id}`);
      await fetch(`${url}`, {
        method: 'DELETE',
      });
    } catch (error) {
      throw new Error(error);
    }
  },

  async updateCar(id: number, data: Data): Promise<ICarItemState> {
    try {
      const url = new URL(`${this.baseURL}/garage/${id}`);
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
export default api;
