import { carState, ICarItemState } from '../state/carState';

export interface IGarageService {
  getCars: () => ICarItemState[];
  generateNewCar: () => void;
  updateCarParams: (id: number, name: string, color: string) => void;
  deleteCar: (id: number) => void;
  setEditMode: (id: number) => void;
  updateGenerateCarForm: (type: string, value: string) => void;
}

export interface ICarForm {
  [key: string]: string;
}

class GarageService {
  private cars: ICarItemState[];

  private generateCarForm: ICarForm;

  constructor() {
    this.generateCarForm = {
      name: '',
      color: '#000',
    };
    this.cars = [...carState.cars];
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

  private clearGenerateCarForm(): void {
    this.generateCarForm.name = '';
    this.generateCarForm.color = '';
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
