import BaseControl from '../../../../shared/templates/BaseControl/BaseControl';
import { IWinner } from '../../../../shared/interfaces/winnersState-models';
import getCarSVG from '../../../../shared/carSVG';
import {
  DEFAULT_CAR_COLOR,
  DEFAULT_CAR_NAME,
  EmptyString,
  INDEX_CAR_IMG,
  Tag,
  WinnersClasses,
} from '../../../../shared/variables';

const winnerPropsToBaseControl = {
  tagName: Tag.TR,
  classes: [WinnersClasses.WINNER],
};

class Winner extends BaseControl<HTMLElement> {
  constructor(
    private readonly winner: IWinner,
    private readonly carListNumber: number
  ) {
    super(winnerPropsToBaseControl);
    this.render();
  }

  private render(): void {
    this.node.innerHTML = EmptyString;

    const { color = DEFAULT_CAR_COLOR, name = DEFAULT_CAR_NAME } = this.winner;
    const carImg = getCarSVG(color);
    const winnersTableCells = [
      new BaseControl({
        tagName: Tag.TD,
        classes: [WinnersClasses.CELL, WinnersClasses.WINNER_NUMBER],
        text: this.carListNumber.toString(),
      }),
      new BaseControl({
        tagName: Tag.TD,
        classes: [WinnersClasses.CELL, WinnersClasses.WINNER_CAR],
      }),
      new BaseControl({
        tagName: Tag.TD,
        classes: [WinnersClasses.CELL, WinnersClasses.WINNER_NAME],
        text: name,
      }),
      new BaseControl({
        tagName: Tag.TD,
        classes: [WinnersClasses.CELL, WinnersClasses.WINNER_NUMBER],
        text: this.winner.wins.toString(),
      }),
      new BaseControl({
        tagName: Tag.TD,
        classes: [WinnersClasses.CELL, WinnersClasses.WINNER_NUMBER],
        text: this.winner.time.toString(),
      }),
    ];

    winnersTableCells[INDEX_CAR_IMG].node.innerHTML = carImg;

    this.node.append(...winnersTableCells.map((cell) => cell.node));
  }
}

export default Winner;
