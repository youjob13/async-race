import { createSlice } from '@reduxjs/toolkit';
import { IWinnersState } from '../shared/interfaces/winnersState-models';
import {
  ICombineWinnersState,
  ThunkActionType,
} from '../shared/interfaces/api-models';
import { apiWinner } from '../shared/api/api';
import { COUNT_WINNERS_ON_PAGE } from '../shared/variables';

const winnersSlice = createSlice({
  name: 'winnersSlice',
  initialState: {
    winners: [],
    currentWinnersPage: 1,
    winnersNumber: 0,
    sortingOrder: 'ASC',
    sortingType: '',
  } as IWinnersState,
  reducers: {
    changeSortOrder: (state: IWinnersState, action) => {
      const { sortingOrder, sortingType } = action.payload;
      return {
        ...state,
        sortingOrder: sortingOrder === 'ASC' ? 'DESC' : 'ASC',
        sortingType,
      };
    },
    setAllWinners: (state: IWinnersState, action) => {
      const { winners, totalWinnersNumber, currentWinnersPage } =
        action.payload;
      return {
        ...state,
        winners: [...winners],
        currentWinnersPage,
        winnersNumber: totalWinnersNumber,
      };
    },
  },
});

export default winnersSlice.reducer;

export const { setAllWinners, changeSortOrder } = winnersSlice.actions;

export const getAllWinnersTC =
  (
    currentWinnersPage?: number,
    limit?: number
  ): ThunkActionType<ICombineWinnersState> =>
  async (dispatch, getState): Promise<void> => {
    const { sortingOrder, sortingType } = getState().winnersReducer;
    const { winners, totalWinnersNumber } = await apiWinner.getWinners(
      currentWinnersPage,
      limit,
      sortingType,
      sortingOrder
    );
    dispatch(
      setAllWinners({ winners, totalWinnersNumber, currentWinnersPage })
    );
  };

export const sortWinnersTableTC =
  (
    sortingType: 'time' | 'wins' // TODO: enum
  ): ThunkActionType<ICombineWinnersState> =>
  async (dispatch, getState): Promise<void> => {
    const { currentWinnersPage, sortingOrder } = getState().winnersReducer;

    dispatch(changeSortOrder({ sortingOrder, sortingType }));
    dispatch(getAllWinnersTC(currentWinnersPage, COUNT_WINNERS_ON_PAGE)); // TODO: limit in global const
  };
