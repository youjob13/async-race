import { IGarageService } from '../services/GarageService';
import Garage from './Garage';

interface IGarageContainer {
  render: () => HTMLElement;
}

class GarageContainer implements IGarageContainer {
  constructor(private garageService: IGarageService) {}

  render(): HTMLElement {
    const cars = this.garageService.getCars();
    return new Garage({ tagName: 'main', classes: ['garage'] }, cars).render();
  }
}

export default GarageContainer;
