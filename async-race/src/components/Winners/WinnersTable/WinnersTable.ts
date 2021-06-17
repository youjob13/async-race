import { Store } from 'redux';
import { AnyAction, CombinedState, ThunkDispatch } from '@reduxjs/toolkit';
import {
  ICombineCarsState,
  ICombineWinnersState,
  IPropsToBaseControl,
  ThunkDispatchType,
} from '../../../shared/interfaces/api-models';
import { IPage } from '../../../shared/interfaces/page-model';
import BaseControl from '../../../shared/BaseControl/BaseControl';
import {
  IWinner,
  IWinnersState,
} from '../../../shared/interfaces/winnersState-models';
import Winner from './Winner/Winner';
import Button from '../../../shared/Button/Button';
import {
  getCurrentWinnersPageSelector,
  getWinnersSortOrderSelector,
} from '../../../store/winnersSelectors';
import {
  getAllWinnersTC,
  sortWinnersTableTC,
} from '../../../store/winnersSlice';
import { COUNT_WINNERS_ON_PAGE } from '../../../shared/variables';
import { getAllCarsTC } from '../../../store/carsSlice';
import { ICar } from '../../../shared/interfaces/carState-model';
import { getCarsSelector } from '../../../store/carsSelectors';

class WinnersTable extends BaseControl<HTMLElement> implements IPage {
  private titles: string[];

  private winners: IWinner[];

  private cars: ICar[];

  private sortingOrder?: string;

  private sortingType?: string;

  private currentPage: number;

  constructor(
    private propsToBaseControl: IPropsToBaseControl,
    private store: Store
  ) {
    super(propsToBaseControl);
    this.titles = ['Number', 'Car', 'Name', 'Wins', 'Best time'];
    this.winners = [];
    this.currentPage = 1;
    this.cars = [];

    this.store.subscribe(() => {
      const currentSortingOrder = getWinnersSortOrderSelector(
        this.store.getState().winnersReducer
      );

      this.cars = getCarsSelector(this.store.getState().carReducer); // TODO

      const { currentSortingType, winners: newWinners } =
        this.store.getState().winnersReducer;

      // const currentSortingType = getWinnersSortTypeSelector(
      //   this.store.getState().winnersReducer
      // );

      // const newWinners = getWinnersSelector(
      //   this.store.getState().winnersReducer
      // );

      this.currentPage = getCurrentWinnersPageSelector(
        this.store.getState().winnersReducer
      );

      if (JSON.stringify(this.winners) !== JSON.stringify(newWinners)) {
        this.sortingOrder = currentSortingOrder;
        this.sortingType = currentSortingType;
        this.winners = [...newWinners];
        this.render();
      }
    });

    (this.store.dispatch as ThunkDispatchType<ICombineCarsState>)(
      getAllCarsTC()
    );
    (this.store.dispatch as ThunkDispatchType<ICombineWinnersState>)(
      getAllWinnersTC(this.currentPage, COUNT_WINNERS_ON_PAGE)
    );

    this.render();
  }

  private sortByWinsNumber = (): void => {
    (
      this.store.dispatch as ThunkDispatch<
        CombinedState<{ winnersReducer: IWinnersState }>,
        unknown,
        AnyAction
      >
    )(sortWinnersTableTC('wins'));
  };

  private sortByTime = (): void => {
    (
      this.store.dispatch as ThunkDispatch<
        CombinedState<{ winnersReducer: IWinnersState }>,
        unknown,
        AnyAction
      >
    )(sortWinnersTableTC('time'));
  };

  render(): void {
    this.node.innerHTML = '';

    const titlesWrapper = new BaseControl({
      tagName: 'tr',
      classes: ['winners__table_titles-wrapper'],
    });
    const sortingOrder = this.sortingOrder === 'ASC' ? '[↑]' : '[↓]';
    this.titles.forEach((title) => {
      let titleItem;
      if (title === 'Best time') {
        titleItem = new Button(
          {
            tagName: 'th',
            classes: ['winners__table_title', 'time'],
            text: `${title} ${
              (this.sortingType === 'time' && sortingOrder) || ''
            }`,
          },
          this.sortByTime
        );
      } else if (title === 'Wins') {
        titleItem = new Button(
          {
            tagName: 'th',
            classes: ['winners__table_title', 'wins'],
            text: `${title} ${
              (this.sortingType === 'wins' && sortingOrder) || ''
            }`,
          },
          this.sortByWinsNumber
        );
      } else {
        titleItem = new BaseControl({
          tagName: 'th',
          classes: ['winners__table_title'],
          text: title,
        });
      }

      titlesWrapper.node.append(titleItem.node);
    });

    const winnersWrapper = new BaseControl({
      tagName: 'tbody',
      classes: ['winners__table_winners-wrapper'],
    });
    if (this.winners.length) {
      this.winners.forEach((winner, index) => {
        const winnerItem = new Winner(
          {
            tagName: 'tr',
            classes: ['winner'],
          },
          winner,
          index + 1,
          this.store
        );
        winnersWrapper.node.append(winnerItem.node);
      });
    } else {
      winnersWrapper.node.innerHTML = 'Winners table is empty';
    }

    this.node.append(titlesWrapper.node, winnersWrapper.node);
  }
}

export default WinnersTable;
