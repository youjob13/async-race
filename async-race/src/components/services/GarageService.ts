import { carState, ICarItemState } from '../state/carState';

export interface IGarageService {
  getCars: () => ICarItemState[];
  generateNewCar: () => void;
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

  generateNewCar(): void {
    let newCar = <ICarItemState>(<unknown>{ ...this.generateCarForm });
    newCar.id = 122;
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
