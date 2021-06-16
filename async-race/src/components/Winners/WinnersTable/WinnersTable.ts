import { Store } from 'redux';
import { AnyAction, CombinedState, ThunkDispatch } from '@reduxjs/toolkit';
import { IPropsToBaseControl } from '../../../shared/interfaces/api-models';
import { IPage } from '../../../shared/interfaces/page-model';
import BaseControl from '../../../shared/BaseControl/BaseControl';
import {
  IWinner,
  IWinnersState,
} from '../../../shared/interfaces/winnersState-models';
import Winner from './Winner/Winner';
import { sortWinnersTableTC } from '../../../store/winnersSlice';
import Button from '../../../shared/Button/Button';
import { getWinnersSortOrderSelector } from '../../../store/winnersSelectors';

class WinnersTable extends BaseControl<HTMLElement> implements IPage {
  private titles: string[];

  private sortingOrder?: string;

  constructor(
    private propsToBaseControl: IPropsToBaseControl,
    private winners: IWinner[],
    private store: Store,
    private currentPage: number
  ) {
    super(propsToBaseControl);
    this.titles = ['Number', 'Car', 'Name', 'Wins', 'Best time'];

    this.store.subscribe(() => {
      const currentSortingOrder = getWinnersSortOrderSelector(
        this.store.getState().winnersReducer
      );

      if (this.sortingOrder !== currentSortingOrder) {
        this.sortingOrder = currentSortingOrder;
        this.render();
      }
    });

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

    this.titles.forEach((title) => {
      let titleItem;
      if (title === 'Best time') {
        titleItem = new Button(
          {
            tagName: 'th',
            classes: ['winners__table_title'],
            text: title,
          },
          this.sortByTime
        );
      } else if (title === 'Wins') {
        titleItem = new Button(
          {
            tagName: 'th',
            classes: ['winners__table_title'],
            text: title,
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
          this.store,
          this.currentPage
        );
        winnersWrapper.node.append(winnerItem.node);
      });
    } else {
      winnersWrapper.node.textContent = 'Winners table is empty';
    }

    this.node.append(titlesWrapper.node, winnersWrapper.node);
  }
}

export default WinnersTable;
