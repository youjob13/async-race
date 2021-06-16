export interface IWinner {
  id: number;
  wins: number;
  time: number;
}

export interface IWinnersState {
  winners: IWinner[];
  currentWinnersPage: number;
  winnersNumber: number;
  sortingOrder: string | 'DESC' | 'ASC';
}
