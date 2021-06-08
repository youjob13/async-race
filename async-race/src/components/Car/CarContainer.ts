// import {
//   deleteCarTC,
//   updateCarParamsTC,
//   setEditModeAC,
//   startCarEngineTC,
// } from './../store';
// import { ICarServices } from '../services/CarServices';
// import { ICarForm, IPropsToBaseControl } from '../shared/interfaces/api-models';
// import { ICarItemState } from '../state/carState';
// import Car from './Car';

// class CarContainer {
//   private updateValueCarForm: ICarForm;

//   constructor(
//     private propsToBaseControl: IPropsToBaseControl,
//     private car: ICarItemState,
//     private carService: ICarServices,
//     private store: any
//   ) {
//     this.updateValueCarForm = {
//       name: '',
//       color: '',
//     };
//   }

//   private stopCarEngine = async (): Promise<void> => {
//     return this.carService.stopEngine(this.car.id);
//   };

//   private showDriveMode = async (): Promise<boolean> => {
//     return this.carService.switchEngineMode(this.car.id);
//   };

//   private onStartEngineBtnClick = async (): Promise<void> => {
//     this.store.dispatch(startCarEngineTC(this.car.id));
//     // return this.carService.startEngine(this.car.id);
//   };

//   private onEditBtnClick = (): void => {
//     this.store.dispatch(setEditModeAC(this.car.id));
//   };

//   private onConfirmEditBtnClick = (): void => {
//     const newCarParams = {
//       name:
//         this.updateValueCarForm.name !== ''
//           ? this.updateValueCarForm.name
//           : this.car.name,
//       color:
//         this.updateValueCarForm.color !== ''
//           ? this.updateValueCarForm.color
//           : this.car.color,
//     };
//     this.store.dispatch(updateCarParamsTC(this.car.id, newCarParams));
//   };

//   private handleInput = (type: string, value: string): void => {
//     this.updateValueCarForm[type] = value;
//   };

//   private onDeleteBtnClick = async (): Promise<void> => {
//     this.store.dispatch(deleteCarTC(this.car.id));
//   };

//   render(): HTMLElement {
//     return new Car(
//       this.propsToBaseControl,
//       this.car,
//       this.store,
//       this.carService,
//       this.onConfirmEditBtnClick,
//       this.handleInput,
//       this.onDeleteBtnClick,
//     ).render();
//   }
// }

// export default CarContainer;
