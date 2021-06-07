import { apiEngine } from './../api/api';
import apiCars from '../api/api';
import {
  carNameRandomGenerator,
  colorRandomGenerator,
} from '../shared/functions/valueRandomGenerator';
import { carState, ICarItemState } from '../state/carState';

export interface IGarageService {
  startCarEngine: (id: number) => Promise<number>;
  getCars: () => ICarItemState[];
  getCurrentGaragePage: () => number;
  generateNewCar: () => void;
  generateRandomCars: () => void;
  updateCarParams: (id: number, name: string, color: string) => void;
  deleteCar: (id: number) => void;
  setEditMode: (id: number) => void;
  updateGenerateCarForm: (type: string, value: string) => void;
  prevPage: () => void;
  nextPage: () => void;
}

export interface ICarForm {
  [key: string]: string;
}

class GarageService implements IGarageService {
  private currentGaragePage: number;

  private generateCarForm: ICarForm;

  constructor() {
    this.currentGaragePage = 1;
    this.generateCarForm = {
      name: '',
      color: '#000',
    };
  }

  private clearGenerateCarForm(): void {
    this.generateCarForm.name = '';
    this.generateCarForm.color = '';
  }

  private calcCarSpeed(result: { velocity: number; distance: number }): number {
    let { velocity, distance } = result;
    return distance / velocity;
  }

  startCarEngine = async (id: number): Promise<number> => {
    let result = await apiEngine.toggleEngine(id, 'started');
    let carSpeed = this.calcCarSpeed(result);
    console.log(id);
    console.log(carSpeed);
    return carSpeed;
  };

  generateRandomCars = async (): Promise<void> => {
    for (let i = 0; i < 5; i++) {
      const newRandomCar = {
        name: carNameRandomGenerator(),
        color: colorRandomGenerator(),
      };
      const newCar = await apiCars.createCar(
        <ICarItemState>(<unknown>newRandomCar)
      );
      carState.cars.unshift(newCar);
    }
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
    await apiCars.deleteCar(id);
    carState.cars = carState.cars.filter((car) => car.id !== id);
  };

  generateNewCar = async (): Promise<void> => {
    const newCar = await apiCars.createCar(<ICarItemState>(
      (<unknown>{ ...this.generateCarForm })
    ));
    console.log(newCar);

    // newCar.id = Date.now();
    carState.cars.unshift(newCar); // TODO: action creator
    this.clearGenerateCarForm();
  };

  setEditMode = (id: number): void => {
    carState.cars = carState.cars.map((car) => {
      if (car.id === id) {
        const carCopy = { ...car };
        carCopy.isEdit = true;
        return carCopy;
      }
      return car;
    });
  };

  getCars = (): ICarItemState[] => {
    return carState.cars;
  };

  updateGenerateCarForm(type: string, value: string): void {
    this.generateCarForm[type] = value;
  }

  getCurrentGaragePage(): number {
    return this.currentGaragePage;
  }

  prevPage(): void {
    this.currentGaragePage--;
  }

  nextPage(): void {
    this.currentGaragePage++;
  }
}

export default GarageService;
