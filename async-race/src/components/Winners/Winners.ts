import { Store } from 'redux';
import { IPage } from '../../shared/interfaces/page-model';
import BaseControl from '../../shared/BaseControl/BaseControl';
import WinnersTable from './WinnersTable/WinnersTable';
import { IWinner } from '../../shared/interfaces/winnersState-models';
import {
  ICombineWinnersState,
  ThunkDispatchType,
} from '../../shared/interfaces/api-models';
import { COUNT_CARS_ON_PAGE } from '../../shared/variables';
import { getAllWinnersTC } from '../../store/winnersSlice';

class Winners extends BaseControl<HTMLElement> implements IPage {
  private winnersNumber: number;

  private readonly currentPage: number;

  private winners: IWinner[];

  constructor(private store: Store) {
    super({
      tagName: 'main',
      classes: ['winners'],
    });
    this.winnersNumber = 0;
    this.winners = [];
    this.currentPage = 1;

    this.store.subscribe(() => {
      const {
        winners: newWinners,
        currentWinnersPage: newCurrentWinnersPage,
        winnersNumber: newWinnersNumber,
      } = this.store.getState().winnersReducer;

      if (JSON.stringify(this.winners) !== JSON.stringify(newWinners)) {
        this.winnersNumber = newWinnersNumber;
        this.winners = [...newWinners];
        this.render();
      }
    });

    (this.store.dispatch as ThunkDispatchType<ICombineWinnersState>)(
      getAllWinnersTC(this.currentPage, COUNT_CARS_ON_PAGE)
    );

    this.render();
  }

  render(): void {
    this.node.innerHTML = '';

    const numberWinners = new BaseControl({
      tagName: 'p',
      classes: ['winners__number'],
      text: `Winners: ${1}`,
    });

    const currentPage = new BaseControl({
      tagName: 'p',
      classes: ['winners__page-number'],
      text: '#1',
    });

    const winnersTable = new WinnersTable(
      {
        tagName: 'table',
        classes: ['winners__table'],
      },
      this.winners,
      this.store,
      this.currentPage
    );

    this.node.append(numberWinners.node, currentPage.node, winnersTable.node);
  }
}

export default Winners;
