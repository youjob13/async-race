import apiCars, { apiEngine } from '../api/api';
import { carState } from '../state/carState';

export interface ICarServices {
  setEditMode: (id: number) => void;
  startEngine: (id: number) => Promise<number>;
  updateCarParams: (id: number, name: string, color: string) => Promise<void>;
  deleteCar: (id: number) => Promise<void>;
}

class CarServices implements ICarServices {
  private calcCarSpeed(result: { velocity: number; distance: number }): number {
    const { velocity, distance } = result;
    return distance / velocity;
  }

  startEngine = async (id: number): Promise<number> => {
    console.log(this);

    const result = await apiEngine.toggleEngine(id, 'started');
    const carSpeed = this.calcCarSpeed(result);
    console.log(id);
    console.log(carSpeed);
    return carSpeed;
  };

  setEditMode = (id: number): void => {
    console.log(id);

    carState.cars = carState.cars.map((car) => {
      if (car.id === id) {
        const carCopy = { ...car };
        carCopy.isEdit = true;
        return carCopy;
      }
      return car;
    });
    console.log(carState.cars);
  };

  updateCarParams = async (
    id: number,
    name: string,
    color: string
  ): Promise<void> => {
    const data: { name: string; color: string } = {
      name: '',
      color: '',
    };
    carState.cars = carState.cars.map((car) => {
      if (car.id === id) {
        const carCopy = { ...car };
        if (name !== '') {
          carCopy.name = name;
        }
        if (color !== '') {
          carCopy.color = color;
        }
        data.name = carCopy.name;
        data.color = carCopy.color;
        carCopy.isEdit = false;
        return carCopy;
      }
      return car;
    });
    await apiCars.updateCar(id, data);
  };

  deleteCar = async (id: number): Promise<void> => {
    console.log(id);

    await apiCars.deleteCar(id);
    carState.cars = carState.cars.filter((car) => car.id !== id);
  };
}

export default CarServices;
