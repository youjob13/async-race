import {
  IWinner,
  IWinnersState,
} from '../shared/interfaces/winnersState-models';

export const getWinnersSelector = (state: IWinnersState): IWinner[] =>
  state.winners;

export const getCurrentWinnersPageSelector = (state: IWinnersState): number =>
  state.currentWinnersPage;

export const getWinnersNumberSelector = (state: IWinnersState): number =>
  state.winnersNumber;
