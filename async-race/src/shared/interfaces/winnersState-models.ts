import { WinnersSortingOrder } from '../variables';

export interface IWinner {
  id: number;
  wins: number;
  time: number;
  name?: string;
  color?: string;
}

export interface IWinnersState {
  winners: IWinner[];
  currentWinnersPage: number;
  winnersNumber: number;
  sortingOrder: WinnersSortingOrder;
  sortingType: string;
}
