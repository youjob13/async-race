import { IWinnersState } from '../shared/interfaces/winnersState-models';

// export const getWinnersSelector = (state: IWinnersState): IWinner[] =>
//   state.winners;

export const getCurrentWinnersPageSelector = (state: IWinnersState): number =>
  state.currentWinnersPage;

export const getWinnersNumberSelector = (state: IWinnersState): number =>
  state.winnersNumber;

export const getWinnersSortOrderSelector = (state: IWinnersState): string =>
  state.sortingOrder;

// export const getWinnersSortTypeSelector = (state: IWinnersState): string =>
//   state.sortingType;
