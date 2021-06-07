import apiCars from '../api/api';
import {
  carNameRandomGenerator,
  colorRandomGenerator,
} from '../shared/functions/valueRandomGenerator';
import { carState, ICarItemState } from '../state/carState';

export interface IGarageService {
  getCars: () => ICarItemState[];
  getCurrentGaragePage: () => number;
  generateNewCar: () => void;
  generateRandomCars: () => void;
  updateCarGenerationForm: (type: string, value: string) => void;
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

  generateNewCar = async (): Promise<void> => {
    const newCar = await apiCars.createCar(<ICarItemState>(
      (<unknown>{ ...this.generateCarForm })
    ));
    carState.cars.unshift(newCar); // TODO: action creator
    this.clearGenerateCarForm();
  };

  getCars = (): ICarItemState[] => {
    return carState.cars;
  };

  updateCarGenerationForm(type: string, value: string): void {
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
