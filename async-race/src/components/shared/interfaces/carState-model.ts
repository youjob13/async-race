// export interface IAction {
//   type: string;
//   [key: string]: any;
// }

export interface ICarItemState {
  id: number;
  name: string;
  color: string;
  isEdit?: boolean;
  drivingMode?: string;
}

export interface ICarState {
  cars: ICarItemState[];
  currentGaragePage: number;
}
