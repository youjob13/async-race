import { Store } from 'redux';
import { IPage } from '../../shared/interfaces/page-model';
import BaseControl from '../../shared/BaseControl/BaseControl';
import WinnersTable from './WinnersTable/WinnersTable';
import { IWinner } from '../../shared/interfaces/winnersState-models';
import { getWinnersNumberSelector } from '../../store/winnersSelectors';

class Winners extends BaseControl<HTMLElement> implements IPage {
  private winnersNumber: number;

  private currentPage: number;

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
      const newWinnersNumber = getWinnersNumberSelector(
        this.store.getState().winnersReducer
      );

      if (newWinnersNumber !== this.winnersNumber) {
        this.winnersNumber = newWinnersNumber;
        this.render();
      }
    });

    this.render();
  }

  render(): void {
    this.node.innerHTML = '';

    const numberWinners = new BaseControl({
      tagName: 'p',
      classes: ['winners__number'],
      text: `Winners: ${this.winnersNumber}`,
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
      this.store
    );

    this.node.append(numberWinners.node, currentPage.node, winnersTable.node);
  }
}

export default Winners;
