export interface ICarItemState {
  id: number;
  name: string;
  color: string;
  isEdit?: boolean;
  drivingMode?: string;
  timeToFinish?: number;
}

export interface ICarState {
  cars: ICarItemState[];
  currentGaragePage: number;
}
