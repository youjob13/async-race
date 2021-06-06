import { IGarageService } from '../services/GarageService';
import { IObserver } from '../shared/Observer';
import Garage from './Garage';

interface IGarageContainer {
  render: () => HTMLElement;
}

class GarageContainer implements IGarageContainer {
  currentPage: number;

  constructor(
    private garageService: IGarageService,
    private newCarObserver: IObserver
  ) {
    this.currentPage = this.garageService.getCurrentGaragePage();
  }

  private onPrevPageBtnClick = (): void => {
    this.garageService.prevPage();
    this.newCarObserver.broadcast();
  };

  private onNextPageBtnClick = (): void => {
    this.garageService.nextPage();
    this.newCarObserver.broadcast();
  };

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

  private onGenerateRandomCarsBtnClick = (): void => {
    this.garageService.generateRandomCars();
    this.newCarObserver.broadcast();
  }

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
      this.currentPage,
      this.handleInput,
      this.onGenerateCarBtnClick,
      this.onDeleteCarBtnClick,
      this.editCarParams,
      this.setEditMode,
      this.onNextPageBtnClick,
      this.onPrevPageBtnClick,
      this.onGenerateRandomCarsBtnClick
    ).render();
  }
}

export default GarageContainer;
