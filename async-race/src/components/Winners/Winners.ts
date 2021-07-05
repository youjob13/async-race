import './winners.scss';
import { Store } from 'redux';
import { IPage } from '../../shared/interfaces/page-model';
import BaseControl from '../../shared/templates/BaseControl/BaseControl';
import WinnersTable from './WinnersTable/WinnersTable';
import { IWinner } from '../../shared/interfaces/winnersState-models';
import { getWinnersNumberSelector } from '../../store/winnersSelectors';
import Button from '../../shared/templates/Button/Button';
import { toggleWinnersPageTC } from '../../store/winnersSlice';
import {
  ICombineWinnersState,
  ThunkDispatchType,
} from '../../shared/interfaces/api-models';
import {
  EmptyString,
  FIRST_PAGE,
  Tag,
  WinnersClasses,
} from '../../shared/variables';

class Winners extends BaseControl<HTMLElement> implements IPage {
  private readonly currentPage: number;

  private readonly winners: IWinner[];

  private winnersNumber: number;

  constructor(private readonly store: Store) {
    super({
      tagName: Tag.MAIN,
      classes: [WinnersClasses.WINNERS],
    });
    this.winnersNumber = 0;
    this.winners = [];
    this.currentPage = FIRST_PAGE;

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

  private switchToPrevWinnersPage = () => {
    (this.store.dispatch as ThunkDispatchType<ICombineWinnersState>)(
      toggleWinnersPageTC(false)
    );
  };

  private switchToNextWinnersPage = () => {
    (this.store.dispatch as ThunkDispatchType<ICombineWinnersState>)(
      toggleWinnersPageTC(true)
    );
  };

  render(): void {
    this.node.innerHTML = EmptyString;

    const numberWinners = new BaseControl({
      tagName: Tag.P,
      classes: [WinnersClasses.NUMBER],
      text: `Winners: ${this.winnersNumber}`,
    });

    const currentPage = new BaseControl({
      tagName: Tag.P,
      classes: [WinnersClasses.PAGE_NUMBER],
      text: '', // TODO: current page
    });

    const winnersTable = new WinnersTable(this.store);

    const pagesControls = new BaseControl({
      tagName: Tag.DIV,
      classes: [WinnersClasses.PAGES_CONTROLS],
    });

    const winnersPageNavigationButtons = [
      new Button(
        {
          tagName: Tag.BUTTON,
          classes: [WinnersClasses.PAGE_CONTROL, WinnersClasses.PREV_BUTTON],
          text: 'Prev',
        },
        this.switchToPrevWinnersPage
      ),
      new Button(
        {
          tagName: Tag.BUTTON,
          classes: [WinnersClasses.PAGE_CONTROL, WinnersClasses.NEXT_BUTTON],
          text: 'Next',
        },
        this.switchToNextWinnersPage
      ),
    ];

    pagesControls.node.append(
      ...winnersPageNavigationButtons.map((button) => button.node)
    );

    this.node.append(
      numberWinners.node,
      currentPage.node,
      winnersTable.node,
      pagesControls.node
    );
  }
}

export default Winners;
