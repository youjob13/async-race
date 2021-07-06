import { IWinnersState } from '../shared/interfaces/winnersState-models';

export const getWinnersNumber = (state: IWinnersState): number =>
  state.winnersNumber;

export const getWinnersSortOrder = (state: IWinnersState): string =>
  state.sortingOrder;

export const getWinnersPage = (state: IWinnersState): number =>
  state.currentWinnersPage;
