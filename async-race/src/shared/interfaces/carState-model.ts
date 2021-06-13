export interface ICar {
  id: number;
  name: string;
  color: string;
  isEdit?: boolean;
  drivingMode?: string;
  timeToFinish?: number;
}

export interface ICarsState {
  cars: ICar[];
  currentGaragePage: number;
  carsNumber: number;
}
