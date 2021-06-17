import { Store } from 'redux';
import BaseControl from '../../../../shared/BaseControl/BaseControl';
import { IPropsToBaseControl } from '../../../../shared/interfaces/api-models';
import { IWinner } from '../../../../shared/interfaces/winnersState-models';
import getCarSVG from '../../../../shared/carSVG';

class Winner extends BaseControl<HTMLElement> {
  constructor(
    private propsToBaseControl: IPropsToBaseControl,
    private winner: IWinner,
    private carListNumber: number,
    private store: Store // private carData: ICar
  ) {
    super(propsToBaseControl);

    this.render();
  }

  private render(): void {
    const { color = '000', name } = this.winner;

    this.node.innerHTML = '';

    const winnerNumber = new BaseControl({
      tagName: 'td',
      classes: ['cell', 'winner__number'],
      text: this.carListNumber.toString(),
    });

    const carImg = getCarSVG(color);

    const winnerCarImgWrapper = new BaseControl({
      tagName: 'td',
      classes: ['cell', 'winner__car'],
    });

    winnerCarImgWrapper.node.innerHTML = carImg;

    const winnerName = new BaseControl({
      tagName: 'td',
      classes: ['cell', 'winner__name'],
      text: name,
    });

    const winnerWinsNumber = new BaseControl({
      tagName: 'td',
      classes: ['cell', 'winner__number'],
      text: this.winner.wins.toString(),
    });

    const winnerTimeNumber = new BaseControl({
      tagName: 'td',
      classes: ['cell', 'winner__number'],
      text: this.winner.time.toString(),
    });

    this.node.append(
      winnerNumber.node,
      winnerCarImgWrapper.node,
      winnerName.node,
      winnerWinsNumber.node,
      winnerTimeNumber.node
    );
  }
}

export default Winner;
