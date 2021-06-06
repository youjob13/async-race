import { IGarageService } from '../services/GarageService';
import { IObserver } from '../shared/Observer';
import Garage from './Garage';

interface IGarageContainer {
  render: () => HTMLElement;
}

class GarageContainer implements IGarageContainer {
  constructor(
    private garageService: IGarageService,
    private newCarObserver: IObserver
  ) {}

  private editCarParams = (id: number, name: string, color: string): void => {
    this.garageService.updateCarParams(id, name, color);
    this.newCarObserver.broadcast();
  };

  private setEditMode = (id: number): void => {
    this.garageService.setEditMode(id);
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
      this.editCarParams,
      this.setEditMode
    ).render();
  }
}

export default GarageContainer;
