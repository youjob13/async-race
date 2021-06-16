import { Store } from 'redux';
import BaseControl from '../../../../shared/BaseControl/BaseControl';
import { IPropsToBaseControl } from '../../../../shared/interfaces/api-models';
import { IWinner } from '../../../../shared/interfaces/winnersState-models';
import { ICar } from '../../../../shared/interfaces/carState-model';
import { getCarSelector } from '../../../../store/carsSelectors';
import getCarSVG from '../../../../shared/carSVG';

class Winner extends BaseControl<HTMLElement> {
  private carData: ICar | undefined;

  constructor(
    private propsToBaseControl: IPropsToBaseControl,
    private winner: IWinner,
    private carListNumber: number,
    private store: Store, // private carData: ICar
    private currentPage: number
  ) {
    super(propsToBaseControl);
    this.carData = getCarSelector(
      this.store.getState().carReducer,
      this.winner.id
    );
    //
    // this.store.subscribe(() => {
    //   this.carData = getCarSelector(
    //     this.store.getState().carReducer,
    //     this.winner.id
    //   );
    //   this.render();
    // });

    this.render();
  }

  private render(): void {
    if (this.carData === undefined) return;
    const { color, name } = this.carData;

    this.node.innerHTML = '';

    const winnerNumber = new BaseControl({
      tagName: 'td',
      classes: ['winner__number'],
      text: this.carListNumber.toString(),
    });

    const carImg = getCarSVG(color);

    const winnerCarImgWrapper = new BaseControl({
      tagName: 'td',
      classes: ['winner__car'],
    });

    winnerCarImgWrapper.node.innerHTML = carImg;

    const winnerName = new BaseControl({
      tagName: 'td',
      classes: ['winner__name'],
      text: name,
    });

    const winnerWinsNumber = new BaseControl({
      tagName: 'td',
      classes: ['winner__number'],
      text: this.winner.wins.toString(),
    });

    const winnerTimeNumber = new BaseControl({
      tagName: 'td',
      classes: ['winner__number'],
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
