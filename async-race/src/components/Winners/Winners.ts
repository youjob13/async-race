import './winners.scss';
import { Store } from 'redux';
import { IPage } from '../../shared/interfaces/page-model';
import BaseControl from '../../shared/templates/BaseControl/BaseControl';
import WinnersTable from './WinnersTable/WinnersTable';
import { getWinnersNumber, getWinnersPage } from '../../store/winnersSelectors';
import Button from '../../shared/templates/Button/Button';
import { toggleWinnersPageTC } from '../../store/winnersSlice';
import { ICombineWinnersState } from '../../shared/interfaces/api-models';
import {
  EmptyString,
  FIRST_PAGE,
  INITIAL_WINNERS_NUMBER,
  PageDirection,
  Tag,
  WinnersClasses,
} from '../../shared/variables';
import dispatchThunk from '../../shared/helperFunctions/dispatchThunk';

const winnersPropsToBaseControl = {
  tagName: Tag.MAIN,
  classes: [WinnersClasses.WINNERS],
};
const pagesControlsProps = {
  tagName: Tag.DIV,
  classes: [WinnersClasses.PAGES_CONTROLS],
};
const prevPageButtonProps = {
  tagName: Tag.BUTTON,
  classes: [WinnersClasses.PAGE_CONTROL, WinnersClasses.PREV_BUTTON],
  text: PageDirection.PREV,
  attributes: { id: PageDirection.PREV },
};
const nextPageButtonProps = {
  tagName: Tag.BUTTON,
  classes: [WinnersClasses.PAGE_CONTROL, WinnersClasses.NEXT_BUTTON],
  text: PageDirection.NEXT,
  attributes: { id: PageDirection.NEXT },
};

class Winners extends BaseControl<HTMLElement> implements IPage {
  private currentPage: number;

  private winnersNumber: number;

  constructor(private readonly store: Store) {
    super(winnersPropsToBaseControl);
    this.winnersNumber = INITIAL_WINNERS_NUMBER;
    this.currentPage = FIRST_PAGE;

    this.store.subscribe(() => {
      const newWinnersNumber = getWinnersNumber(
        this.store.getState().winnersReducer
      );

      const newPage = getWinnersPage(this.store.getState().winnersReducer);

      if (newPage !== this.currentPage) {
        this.currentPage = newPage;
        this.render();
      }

      if (newWinnersNumber !== this.winnersNumber) {
        this.winnersNumber = newWinnersNumber;
        this.render();
      }
    });

    this.render();
  }

  private toggleWinnersPage = (event: Event) => {
    const target = <HTMLElement>event.target;

    dispatchThunk<ICombineWinnersState>(
      this.store,
      toggleWinnersPageTC(target.id === PageDirection.NEXT)
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
      text: this.currentPage.toString(),
    });
    const winnersTable = new WinnersTable(this.store);
    const pagesControls = new BaseControl(pagesControlsProps);
    const winnersPageNavigationButtons = [
      new Button(prevPageButtonProps, this.toggleWinnersPage),
      new Button(nextPageButtonProps, this.toggleWinnersPage),
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
