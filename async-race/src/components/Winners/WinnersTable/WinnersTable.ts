import { Store } from 'redux';
import { AnyAction, CombinedState, ThunkDispatch } from '@reduxjs/toolkit';
import {
  ICombineCarsState,
  ICombineWinnersState,
  ThunkDispatchType,
} from '../../../shared/interfaces/api-models';
import { IPage } from '../../../shared/interfaces/page-model';
import BaseControl from '../../../shared/templates/BaseControl/BaseControl';
import {
  IWinner,
  IWinnersState,
} from '../../../shared/interfaces/winnersState-models';
import Winner from './Winner/Winner';
import Button from '../../../shared/templates/Button/Button';
import {
  getCurrentWinnersPageSelector,
  getWinnersSortOrderSelector,
} from '../../../store/winnersSelectors';
import {
  getAllWinnersTC,
  sortWinnersTableTC,
} from '../../../store/winnersSlice';
import {
  EMPTY_TABLE,
  EmptyString,
  FIRST_INDEX,
  FIRST_PAGE,
  LIMIT_WINNERS_ON_PAGE,
  Tag,
  WINNERS_TABLE_TITLES,
  WinnersClasses,
  WinnersSorting,
  WinnersSortingOrder,
  WinnersTitles,
} from '../../../shared/variables';
import { getAllCarsTC } from '../../../store/carsSlice';

class WinnersTable extends BaseControl<HTMLElement> implements IPage {
  private readonly titles: string[];

  private winners: IWinner[];

  private sortingOrder?: string;

  private sortingType?: string;

  private currentPage: number;

  constructor(private readonly store: Store) {
    super({
      tagName: Tag.TABLE,
      classes: [WinnersClasses.TABLE],
    });
    this.titles = WINNERS_TABLE_TITLES;
    this.winners = [];
    this.currentPage = FIRST_PAGE;

    this.store.subscribe(() => {
      const currentSortingOrder = getWinnersSortOrderSelector(
        this.store.getState().winnersReducer
      );

      const { currentSortingType, winners: newWinners } =
        this.store.getState().winnersReducer;

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
      getAllWinnersTC(this.currentPage, LIMIT_WINNERS_ON_PAGE)
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
    )(sortWinnersTableTC(WinnersSorting.WINS));
  };

  private sortByTime = (): void => {
    (
      this.store.dispatch as ThunkDispatch<
        CombinedState<{ winnersReducer: IWinnersState }>,
        unknown,
        AnyAction
      >
    )(sortWinnersTableTC(WinnersSorting.TIME));
  };

  render(): void {
    this.node.innerHTML = EmptyString;

    const titlesWrapper = new BaseControl({
      tagName: Tag.TR,
      classes: [WinnersClasses.TABLE_TITLES_WRAPPER],
    });

    const sortingOrder =
      this.sortingOrder === WinnersSortingOrder.ASC ? '[↑]' : '[↓]';

    this.titles.forEach((title) => {
      let titleItem;
      if (title === WinnersTitles.BEST_TIME) {
        titleItem = new Button(
          {
            tagName: Tag.TH,
            classes: [WinnersClasses.TABLE_TITLE, WinnersClasses.TIME],
            text: `${title} ${
              (this.sortingType === WinnersSorting.TIME && sortingOrder) ||
              EmptyString
            }`,
          },
          this.sortByTime
        );
      } else if (title === WinnersTitles.WINS) {
        titleItem = new Button(
          {
            tagName: Tag.TH,
            classes: [WinnersClasses.TABLE_TITLE, WinnersClasses.WINS],
            text: `${title} ${
              (this.sortingType === WinnersSorting.WINS && sortingOrder) ||
              EmptyString
            }`,
          },
          this.sortByWinsNumber
        );
      } else {
        titleItem = new BaseControl({
          tagName: Tag.TH,
          classes: [WinnersClasses.TABLE_TITLE],
          text: title,
        });
      }

      titlesWrapper.node.append(titleItem.node);
    });

    const winnersWrapper = new BaseControl({
      tagName: Tag.TBODY,
      classes: [WinnersClasses.TABLE_WINNERS_WRAPPER],
    });

    if (this.winners.length) {
      this.winners.forEach((winner, index) => {
        const winnerItem = new Winner(
          {
            tagName: Tag.TR,
            classes: [WinnersClasses.WINNER],
          },
          winner,
          index +
            FIRST_INDEX +
            LIMIT_WINNERS_ON_PAGE * (this.currentPage - FIRST_PAGE)
        );
        winnersWrapper.node.append(winnerItem.node);
      });
    } else {
      winnersWrapper.node.innerHTML = EMPTY_TABLE;
    }

    this.node.append(titlesWrapper.node, winnersWrapper.node);
  }
}

export default WinnersTable;
