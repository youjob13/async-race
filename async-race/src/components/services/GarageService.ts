import { carState, ICarItemState } from '../state/carState';

export interface IGarageService {
  getCars: () => ICarItemState[];
}

class GarageService {
  private cars: ICarItemState[];

  constructor() {
    this.cars = [];
  }

  getCars(): ICarItemState[] {
    this.cars = carState.cars.map((car) => car);
    return this.cars;
  }
}

export default GarageService;
