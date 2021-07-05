import { createSlice } from '@reduxjs/toolkit';
import {
  IWinner,
  IWinnersState,
} from '../shared/interfaces/winnersState-models';
import {
  ICombineWinnersState,
  ThunkActionType,
} from '../shared/interfaces/api-models';
import { apiWinner } from '../shared/api/api';
import { BASE_URL, LIMIT_WINNERS_ON_PAGE } from '../shared/variables';

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
      const { newSortingOrder, newSortingType } = action.payload;
      return {
        ...state,
        sortingOrder: newSortingOrder,
        sortingType: newSortingType || state.sortingType,
      };
    },
    setAllWinners: (state: IWinnersState, action) => {
      const { res, totalWinnersNumber, currentWinnersPage } = action.payload;
      return {
        ...state,
        winners: [...res],
        currentWinnersPage,
        winnersNumber: totalWinnersNumber,
      };
    },
    deleteWinner: (state: IWinnersState, action) => {
      return {
        ...state,
        winners: state.winners.filter((winner) => winner.id !== action.payload),
      };
    },
  },
});

export default winnersSlice.reducer;

export const { setAllWinners, deleteWinner, changeSortOrder } =
  winnersSlice.actions;

export const extendWinnersParamTC =
  (
    winners: IWinner[],
    totalWinnersNumber: number,
    currentWinnersPage?: number
  ): ThunkActionType<ICombineWinnersState> =>
  async (dispatch): Promise<void> => {
    const additionalWinnersParamsRequest = [];

    for (let i = 0; i < winners.length; i++) {
      const url = new URL(`${BASE_URL}/garage/${winners[i].id}`);

      additionalWinnersParamsRequest.push(
        fetch(`${url}`, {
          method: 'GET',
        })
      );
    }

    Promise.all(additionalWinnersParamsRequest).then(
      (additionalWinnersParams) => {
        const additionalWinnersParamsJSON = additionalWinnersParams.map(
          (winner) => winner.json()
        );

        Promise.all(additionalWinnersParamsJSON).then(
          (additionalWinnersParamsRes) => {
            const res = additionalWinnersParamsRes.map(
              (winnerAdditionalParam, index) => ({
                ...winners[index],
                ...winnerAdditionalParam,
              })
            );

            dispatch(
              setAllWinners({ res, totalWinnersNumber, currentWinnersPage })
            );
          }
        );
      }
    );
  };

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
      extendWinnersParamTC(winners, totalWinnersNumber, currentWinnersPage)
    );
  };

export const sortWinnersTableTC =
  (
    newSortingType: string | 'time' | 'wins' // TODO: enum
  ): ThunkActionType<ICombineWinnersState> =>
  async (dispatch, getState): Promise<void> => {
    const { currentWinnersPage, sortingOrder, sortingType } =
      getState().winnersReducer;
    let newSortingOrder;

    if (sortingType === newSortingType) {
      newSortingOrder = sortingOrder === 'ASC' ? 'DESC' : 'ASC';
      dispatch(changeSortOrder({ newSortingOrder, newSortingType }));
    } else {
      newSortingOrder = sortingOrder;
      dispatch(changeSortOrder({ newSortingOrder, newSortingType }));
    }

    dispatch(getAllWinnersTC(currentWinnersPage, LIMIT_WINNERS_ON_PAGE));
  };

export const toggleWinnersPageTC =
  (isIncrement: boolean): ThunkActionType<ICombineWinnersState> =>
  async (dispatch, getState): Promise<void> => {
    let { currentWinnersPage } = getState().winnersReducer;
    currentWinnersPage = isIncrement
      ? currentWinnersPage + 1
      : currentWinnersPage - 1;
    dispatch(getAllWinnersTC(currentWinnersPage, LIMIT_WINNERS_ON_PAGE));
  };

export const deleteWinnerTC =
  (id: number): ThunkActionType<ICombineWinnersState> =>
  async (dispatch): Promise<void> => {
    await apiWinner.deleteWinner(id);
    dispatch(deleteWinner(id));
  };
