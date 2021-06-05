import { IGarageService } from '../services/GarageService';
import Garage from './Garage';

interface IGarageContainer {
  render: () => HTMLElement;
}

class GarageContainer implements IGarageContainer {
  constructor(private garageService: IGarageService) {}

  private onGenerateCarBtnClick = (): void => {
    this.garageService.generateNewCar();
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
      this.onGenerateCarBtnClick
    ).render();
  }
}

export default GarageContainer;
