import { IGarageService } from '../services/GarageService';
import { IObserver } from '../shared/Observer';
import Garage from './Garage';
// import newCarObserver from '../..';

interface IGarageContainer {
  render: () => HTMLElement;
}

class GarageContainer implements IGarageContainer {
  constructor(
    private garageService: IGarageService,
    private newCarObserver: IObserver
  ) {}

  private editCarParams = (id: number, type: string, value: string): void => {
    this.garageService.updateCarParams(id, type, value);
    this.newCarObserver.broadcast();
  };

  private onDeleteCarBtnClick = (id: number): void => {
    this.garageService.deleteCar(id);
    this.newCarObserver.broadcast();
  };

  private onGenerateCarBtnClick = (): void => {
    this.garageService.generateNewCar();
    this.newCarObserver.broadcast();
  };

  private handleInput = (type: string, value: string): void => {
    this.garageService.updateGenerateCarForm(type, value);
  };

  render(): HTMLElement {
    const cars = this.garageService.getCars();
    return new Garage(
      { tagName: 'main', classes: ['garage'] },
      cars,
      this.handleInput,
      this.onGenerateCarBtnClick,
      this.onDeleteCarBtnClick,
      this.editCarParams
    ).render();
  }
}

export default GarageContainer;
