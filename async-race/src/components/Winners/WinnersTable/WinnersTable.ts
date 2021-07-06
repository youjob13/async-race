import { Store } from 'redux';
import {
  ICombineCarsState,
  ICombineWinnersState,
} from '../../../shared/interfaces/api-models';
import { IPage } from '../../../shared/interfaces/page-model';
import BaseControl from '../../../shared/templates/BaseControl/BaseControl';
import { IWinner } from '../../../shared/interfaces/winnersState-models';
import Winner from './Winner/Winner';
import Button from '../../../shared/templates/Button/Button';
import {
  getWinnersPage,
  getWinnersSortOrder,
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
import dispatchThunk from '../../../shared/helperFunctions/dispatchThunk';

const winnersTablePropsToBaseControl = {
  tagName: Tag.TABLE,
  classes: [WinnersClasses.TABLE],
};
const winnersWrapperProps = {
  tagName: Tag.TBODY,
  classes: [WinnersClasses.TABLE_WINNERS_WRAPPER],
};
const titlesWrapperProps = {
  tagName: Tag.TR,
  classes: [WinnersClasses.TABLE_TITLES_WRAPPER],
};

class WinnersTable extends BaseControl<HTMLElement> implements IPage {
  private readonly titles: string[];

  private winners: IWinner[];

  private sortingOrder?: string;

  private sortingType?: string;

  private currentPage: number;

  constructor(private readonly store: Store) {
    super(winnersTablePropsToBaseControl);
    this.titles = WINNERS_TABLE_TITLES;
    this.winners = [];
    this.currentPage = FIRST_PAGE;

    this.store.subscribe(() => {
      const currentSortingOrder = getWinnersSortOrder(
        this.store.getState().winnersReducer
      );

      const { currentSortingType, winners: newWinners } =
        this.store.getState().winnersReducer;

      this.currentPage = getWinnersPage(this.store.getState().winnersReducer);

      if (JSON.stringify(this.winners) !== JSON.stringify(newWinners)) {
        this.sortingOrder = currentSortingOrder;
        this.sortingType = currentSortingType;
        this.winners = [...newWinners];
        this.render();
      }
    });

    dispatchThunk<ICombineCarsState>(this.store, getAllCarsTC());
    dispatchThunk<ICombineWinnersState>(
      this.store,
      getAllWinnersTC(this.currentPage, LIMIT_WINNERS_ON_PAGE)
    );

    this.render();
  }

  private sortList = (event: Event): void => {
    const target = <HTMLElement>event.target;
    dispatchThunk<ICombineWinnersState>(
      this.store,
      sortWinnersTableTC(<WinnersSorting>target.id)
    );
  };

  render(): void {
    this.node.innerHTML = EmptyString;

    const sortingOrder =
      this.sortingOrder === WinnersSortingOrder.ASC ? '[↑]' : '[↓]';

    const titlesWrapper = new BaseControl(titlesWrapperProps);
    const winnersWrapper = new BaseControl(winnersWrapperProps);

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
            attributes: { id: WinnersSorting.TIME },
          },
          this.sortList
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
            attributes: { id: WinnersSorting.WINS },
          },
          this.sortList
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

    if (this.winners.length) {
      this.winners.forEach((winner, index) => {
        const winnerItem = new Winner(
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
