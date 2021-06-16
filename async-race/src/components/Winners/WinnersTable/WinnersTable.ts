import { Store } from 'redux';
import { IPropsToBaseControl } from '../../../shared/interfaces/api-models';
import { IPage } from '../../../shared/interfaces/page-model';
import BaseControl from '../../../shared/BaseControl/BaseControl';
import { IWinner } from '../../../shared/interfaces/winnersState-models';
import Winner from './Winner/Winner';

class WinnersTable extends BaseControl<HTMLElement> implements IPage {
  private titles: string[];

  constructor(
    private propsToBaseControl: IPropsToBaseControl,
    private winners: IWinner[],
    private store: Store
  ) {
    super(propsToBaseControl);
    this.titles = ['Number', 'Car', 'Name', 'Wins', 'Best time'];

    this.render();
  }

  render(): void {
    this.node.innerHTML = '';

    const titlesWrapper = new BaseControl({
      tagName: 'tr',
      classes: ['winners__table_titles-wrapper'],
    });

    this.titles.forEach((title) => {
      const titleItem = new BaseControl({
        tagName: 'th',
        classes: ['winners__table_title'],
        text: title,
      });
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
      winnersWrapper.node.textContent = 'Winners table is empty';
    }

    this.node.append(titlesWrapper.node, winnersWrapper.node);
  }
}

export default WinnersTable;
