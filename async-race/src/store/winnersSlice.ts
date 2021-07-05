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
import {
  EmptyString,
  FIRST_PAGE,
  INITIAL_WINNERS_NUMBER,
  LIMIT_WINNERS_ON_PAGE,
  SliceName,
  WinnersSorting,
  WinnersSortingOrder,
} from '../shared/variables';
import prepareRequestForWinners from '../shared/helperFunctions/prepareRequestForWinners';

const winnersSlice = createSlice({
  name: SliceName.WINNERS_SLICE,
  initialState: {
    winners: [],
    currentWinnersPage: FIRST_PAGE,
    winnersNumber: INITIAL_WINNERS_NUMBER,
    sortingOrder: WinnersSortingOrder.ASC,
    sortingType: EmptyString,
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
    const additionalWinnersParamsRequest = prepareRequestForWinners(winners);

    Promise.all(additionalWinnersParamsRequest).then(
      (additionalWinnersParams) => {
        const additionalWinnersParamsAsJSON = additionalWinnersParams.map(
          (winner) => winner.json()
        );

        Promise.all(additionalWinnersParamsAsJSON).then(
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
      <WinnersSorting>sortingType,
      <WinnersSortingOrder>sortingOrder
    );

    dispatch(
      extendWinnersParamTC(winners, totalWinnersNumber, currentWinnersPage)
    );
  };

export const sortWinnersTableTC =
  (newSortingType: WinnersSorting): ThunkActionType<ICombineWinnersState> =>
  async (dispatch, getState): Promise<void> => {
    let newSortingOrder;
    const { currentWinnersPage, sortingOrder, sortingType } =
      getState().winnersReducer;

    if (sortingType === newSortingType) {
      newSortingOrder =
        sortingOrder === WinnersSortingOrder.ASC
          ? WinnersSortingOrder.DESC
          : WinnersSortingOrder.ASC;

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
    dispatch(getAllWinnersTC(currentWinnersPage, LIMIT_WINNERS_ON_PAGE)); // TODO: double in toggleGaragePageTC
  };

export const deleteWinnerTC =
  (id: number): ThunkActionType<ICombineWinnersState> =>
  async (dispatch): Promise<void> => {
    await apiWinner.deleteWinner(id);
    dispatch(deleteWinner(id));
  };
