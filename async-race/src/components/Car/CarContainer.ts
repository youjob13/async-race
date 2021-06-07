import { ICarForm } from '../services/GarageService';
import { IPropsToBaseControl } from '../shared/interfaces/api-models';
import { ICarItemState } from '../state/carState';
import Car from './Car';

class CarContainer {
  private updateValueCarForm: ICarForm;

  constructor(
    private propsToBaseControl: IPropsToBaseControl,
    private car: ICarItemState,
    private onDeleteCarBtnClick: (id: number) => void,
    private editCarParams: (id: number, name: string, color: string) => void,
    private setEditMode: (id: number) => void
  ) {
    this.updateValueCarForm = {
      name: '',
      color: '',
    };
  }

  private onConfirmEditBtnClick = (): void => {
    this.editCarParams(
      this.car.id,
      this.updateValueCarForm.name,
      this.updateValueCarForm.color
    );
  };

  private handleInput = (type: string, value: string): void => {
    this.updateValueCarForm[type] = value;
  };

  private onEditBtnClick = (): void => {
    this.setEditMode(this.car.id);
  };

  private onDeleteBtnClick = (): void => {
    this.onDeleteCarBtnClick(this.car.id);
  };

  render(): HTMLElement {
    return new Car(
      this.propsToBaseControl,
      this.car,
      this.onConfirmEditBtnClick,
      this.handleInput,
      this.onEditBtnClick,
      this.onDeleteBtnClick
    ).render();
  }
}

export default CarContainer;
