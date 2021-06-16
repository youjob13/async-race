import { createSlice } from '@reduxjs/toolkit';
import { IWinnersState } from '../shared/interfaces/winnersState-models';
import {
  ICombineState,
  ThunkActionType,
} from '../shared/interfaces/api-models';
import { apiWinner } from '../shared/api/api';

const winnersSlice = createSlice({
  name: 'winnersSlice',
  initialState: {
    winners: [],
    currentWinnersPage: 1,
    winnersNumber: 0,
  } as IWinnersState,
  reducers: {
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

export const { setAllWinners } = winnersSlice.actions;

export const getAllWinnersTC =
  (
    currentGaragePage?: number,
    limit?: number,
    sort?: 'id' | 'wins' | 'time', // TODO: enum,
    order?: 'ASC' | 'DESC' // TODO: enum
  ): ThunkActionType<ICombineState> =>
  async (dispatch): Promise<void> => {
    const { winners, totalWinnersNumber } = await apiWinner.getWinners(
      currentGaragePage,
      limit,
      sort,
      order
    );

    dispatch(setAllWinners({ winners, totalWinnersNumber, currentGaragePage }));
  };
