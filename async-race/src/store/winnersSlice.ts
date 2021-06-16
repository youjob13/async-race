import { createSlice } from '@reduxjs/toolkit';
import { IWinnersState } from '../shared/interfaces/winnersState-models';
import {
  ICombineWinnersState,
  ThunkActionType,
} from '../shared/interfaces/api-models';
import { apiWinner } from '../shared/api/api';

const winnersSlice = createSlice({
  name: 'winnersSlice',
  initialState: {
    winners: [],
    currentWinnersPage: 1,
    winnersNumber: 0,
    sortingOrder: 'ASC',
  } as IWinnersState,
  reducers: {
    changeSortOrder: (state: IWinnersState, action) => {
      return {
        ...state,
        sortingOrder: action.payload === 'ASC' ? 'DESC' : 'ASC',
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
    currentGaragePage?: number,
    limit?: number,
    sort?: string | 'id' | 'wins' | 'time', // TODO: enum,
    order?: string | 'DESC' | 'ASC' // TODO: enum
  ): ThunkActionType<ICombineWinnersState> =>
  async (dispatch): Promise<void> => {
    const { winners, totalWinnersNumber } = await apiWinner.getWinners(
      currentGaragePage,
      limit,
      sort,
      order
    );

    dispatch(setAllWinners({ winners, totalWinnersNumber, currentGaragePage }));
  };

export const sortWinnersTableTC =
  (
    sortType: string // TODO: enum
  ): ThunkActionType<ICombineWinnersState> =>
  async (dispatch, getState): Promise<void> => {
    const { currentWinnersPage, sortingOrder } = getState().winnersReducer;
    dispatch(changeSortOrder(sortingOrder));
    dispatch(getAllWinnersTC(currentWinnersPage, 10, sortType, sortingOrder)); // TODO: limit in global const
  };
