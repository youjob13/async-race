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
  sortingOrder: string | 'DESC' | 'ASC';
  sortingType: string;
}
