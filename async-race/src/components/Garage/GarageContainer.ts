import { ICarServices } from '../services/CarServices';
import { IGarageService } from '../services/GarageService';
import { IObserver } from '../shared/Observer';
import { ICarItemState } from '../state/carState';
import Garage from './Garage';

interface IGarageContainer {
  render: () => HTMLElement;
}

class GarageContainer implements IGarageContainer {
  currentPage: number;

  cars: ICarItemState[];

  constructor(
    private garageService: IGarageService,
    private newCarObserver: IObserver,
    private carService: ICarServices
  ) {
    this.cars = this.garageService.getCars();
    this.currentPage = this.garageService.getCurrentGaragePage();
  }

  private onPrevPageBtnClick = async (): Promise<void> => {
    await this.garageService.prevPage();
    this.newCarObserver.broadcast();
  };

  private onNextPageBtnClick = async (): Promise<void> => {
    await this.garageService.nextPage();
    this.newCarObserver.broadcast();
  };

  private onGenerateRandomCarsBtnClick = async (): Promise<void> => {
    await this.garageService.generateRandomCars();
    this.newCarObserver.broadcast();
  };

  private onGenerateCarBtnClick = async (): Promise<void> => {
    await this.garageService.generateNewCar();
    this.newCarObserver.broadcast();
  };

  private handleInput = (type: string, value: string): void => {
    this.garageService.updateCarGenerationForm(type, value);
  };

  render(): HTMLElement {
    return new Garage(
      { tagName: 'main', classes: ['garage'] },
      this.cars,
      this.currentPage,
      this.handleInput,
      this.onGenerateCarBtnClick,
      this.onNextPageBtnClick,
      this.onPrevPageBtnClick,
      this.onGenerateRandomCarsBtnClick,
      this.carService,
      this.newCarObserver
    ).render();
  }
}

export default GarageContainer;
