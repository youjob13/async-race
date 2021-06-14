export interface ICar {
  id: number;
  name: string;
  color: string;
  isEdit?: boolean;
  drivingMode?: string;
  timeToFinish?: number;
  wins?: number;
}

export interface ICarsState {
  cars: ICar[];
  currentGaragePage: number;
  carsNumber: number;
  currentWinner: string | null;
}
