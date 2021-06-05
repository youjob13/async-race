import { carState, ICarItemState } from '../state/carState';

export interface IGarageService {
  getCars: () => ICarItemState[];
  generateNewCar: () => void;
  updateCarParams: (id: number, type: string, value: string) => void;
  deleteCar: (id: number) => void;
  updateGenerateCarForm: (type: string, value: string) => void;
}

export interface IGenerateCarForm {
  [key: string]: string;
}

class GarageService {
  private cars: ICarItemState[];

  private generateCarForm: IGenerateCarForm;

  constructor() {
    this.generateCarForm = {
      name: '',
      color: '#000',
    };

    this.cars = carState.cars.map((car) => car);
  }

  private clearGenerateCarForm(): void {
    this.generateCarForm.name = '';
    this.generateCarForm.color = '';
  }

  updateCarParams(id: number, type: string, value: string): void {
    this.cars.forEach((car) => {
      if (car.id === id) {
        if (type !== '') {
          car.name = type;
        }
        if (value !== '') {
          car.color = value;
        }
      }
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
