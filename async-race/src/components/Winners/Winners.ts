import './winners.scss';
import { Store } from 'redux';
import { IPage } from '../../shared/interfaces/page-model';
import BaseControl from '../../shared/BaseControl/BaseControl';
import WinnersTable from './WinnersTable/WinnersTable';
import { IWinner } from '../../shared/interfaces/winnersState-models';
import { getWinnersNumberSelector } from '../../store/winnersSelectors';
import Button from '../../shared/Button/Button';
import { toggleWinnersPageTC } from '../../store/winnersSlice';
import {
  ICombineWinnersState,
  ThunkDispatchType,
} from '../../shared/interfaces/api-models';

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

  private onPrevPageControlClick = () => {
    (this.store.dispatch as ThunkDispatchType<ICombineWinnersState>)(
      toggleWinnersPageTC(false)
    );
  };

  private onNextPageControlClick = () => {
    (this.store.dispatch as ThunkDispatchType<ICombineWinnersState>)(
      toggleWinnersPageTC(true)
    );
  };

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
      text: '',
    });

    const winnersTable = new WinnersTable(
      {
        tagName: 'table',
        classes: ['winners__table'],
      },
      this.store
    );

    const pagesControls = new BaseControl({
      tagName: 'div',
      classes: ['winners__pages-controls'],
    });
    const prevBtn = new Button(
      {
        tagName: 'button',
        classes: ['winners__page-control', 'prev-btn'],
        text: 'Prev',
      },
      this.onPrevPageControlClick
    );
    const nextBtn = new Button(
      {
        tagName: 'button',
        classes: ['winners__page-control', 'next-btn'],
        text: 'Next',
      },
      this.onNextPageControlClick
    );

    pagesControls.node.append(prevBtn.node, nextBtn.node);

    this.node.append(
      numberWinners.node,
      currentPage.node,
      winnersTable.node,
      pagesControls.node
    );
  }
}

export default Winners;
