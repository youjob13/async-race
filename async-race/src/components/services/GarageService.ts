import { carState, ICarItemState } from '../state/carState';

export interface IGarageService {
  getCars: () => ICarItemState[];
  getCurrentGaragePage: () => number;
  generateNewCar: () => void;
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

class GarageService {
  private cars: ICarItemState[];

  private currentGaragePage: number;

  private generateCarForm: ICarForm;

  constructor() {
    this.currentGaragePage = 1;
    this.generateCarForm = {
      name: '',
      color: '#000',
    };
    this.cars = [...carState.cars];
  }

  private clearGenerateCarForm(): void {
    this.generateCarForm.name = '';
    this.generateCarForm.color = '';
  }

  prevPage(): void {
    this.currentGaragePage--;
  }

  nextPage(): void {
    this.currentGaragePage++;
  }

  getCurrentGaragePage(): number {
    return this.currentGaragePage;
  }

  setEditMode(id: number): void {
    this.cars = this.cars.map((car) => {
      if (car.id === id) {
        const carCopy = { ...car };
        carCopy.isEdit = true;
        return carCopy;
      }
      return car;
    });
  }

  updateCarParams(id: number, name: string, color: string): void {
    this.cars = this.cars.map((car) => {
      if (car.id === id) {
        const carCopy = { ...car };
        if (name !== '') {
          carCopy.name = name;
        }
        if (color !== '') {
          carCopy.color = color;
        }
        carCopy.isEdit = false;
        return carCopy;
      }
      return car;
    });
  }

  deleteCar(id: number): void {
    this.cars = this.cars.filter((car) => car.id !== id);
  }

  generateNewCar(): void {
    const newCar = <ICarItemState>(<unknown>{ ...this.generateCarForm });
    newCar.id = Date.now();
    this.cars.unshift(newCar);
    this.clearGenerateCarForm();
  }

  updateGenerateCarForm(type: string, value: string): void {
    this.generateCarForm[type] = value;
  }

  getCars(): ICarItemState[] {
    return this.cars;
  }
}

export default GarageService;
