import { ICarServices } from '../services/CarServices';
import { ICarForm } from '../services/GarageService';
import { IPropsToBaseControl } from '../shared/interfaces/api-models';
import { IObserver } from '../shared/Observer';
import { ICarItemState } from '../state/carState';
import Car from './Car';

class CarContainer {
  private updateValueCarForm: ICarForm;

  constructor(
    private propsToBaseControl: IPropsToBaseControl,
    private car: ICarItemState,
    private carService: ICarServices,
    private newCarObserver: IObserver
  ) {
    this.updateValueCarForm = {
      name: '',
      color: '',
    };
  }

  private stopCarEngine = async (): Promise<void> => {
    return this.carService.stopEngine(this.car.id);
  };

  private showDriveMode = async (): Promise<boolean> => {
    return this.carService.switchEngineMode(this.car.id);
  };

  private onStartEngineBtnClick = async (): Promise<number> => {
    return this.carService.startEngine(this.car.id);
  };

  private onEditBtnClick = (): void => {
    this.carService.setEditMode(this.car.id);
    this.newCarObserver.broadcast();
  };

  private onConfirmEditBtnClick = async (): Promise<void> => {
    await this.carService.updateCarParams(
      this.car.id,
      this.updateValueCarForm.name,
      this.updateValueCarForm.color
    );
    this.newCarObserver.broadcast();
  };

  private handleInput = (type: string, value: string): void => {
    this.updateValueCarForm[type] = value;
  };

  private onDeleteBtnClick = async (): Promise<void> => {
    await this.carService.deleteCar(this.car.id);
    this.newCarObserver.broadcast();
  };

  render(): HTMLElement {
    return new Car(
      this.propsToBaseControl,
      this.car,
      this.onConfirmEditBtnClick,
      this.handleInput,
      this.onEditBtnClick,
      this.onDeleteBtnClick,
      this.onStartEngineBtnClick,
      this.showDriveMode,
      this.stopCarEngine
    ).render();
  }
}

export default CarContainer;
