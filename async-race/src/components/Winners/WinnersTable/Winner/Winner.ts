import BaseControl from '../../../../shared/templates/BaseControl/BaseControl';
import { IPropsToBaseControl } from '../../../../shared/interfaces/api-models';
import { IWinner } from '../../../../shared/interfaces/winnersState-models';
import getCarSVG from '../../../../shared/carSVG';
import {
  DEFAULT_CAR_COLOR,
  DEFAULT_CAR_NAME,
  EmptyString,
  Tag,
  WinnersClasses,
} from '../../../../shared/variables';

class Winner extends BaseControl<HTMLElement> {
  constructor(
    private readonly propsToBaseControl: IPropsToBaseControl,
    private readonly winner: IWinner,
    private readonly carListNumber: number
  ) {
    super(propsToBaseControl);
    this.render();
  }

  private render(): void {
    const { color = DEFAULT_CAR_COLOR, name = DEFAULT_CAR_NAME } = this.winner;
    const carImg = getCarSVG(color);

    this.node.innerHTML = EmptyString;

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

    winnersTableCells[1].node.innerHTML = carImg;

    this.node.append(...winnersTableCells.map((cell) => cell.node));
  }
}

export default Winner;
