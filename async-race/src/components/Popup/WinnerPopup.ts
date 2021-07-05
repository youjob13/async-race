import './winnerPopup.scss';
import BaseControl from '../../shared/templates/BaseControl/BaseControl';
import { ICurrentWinner } from '../../shared/interfaces/carState-model';

class WinnerPopup extends BaseControl<HTMLElement> {
  constructor(private currentWinner: ICurrentWinner) {
    super({ tagName: 'div', classes: ['popup', 'popup__winner'] });

    this.render();
  }

  private render(): void {
    const popupWrapper = new BaseControl({
      tagName: 'div',
      classes: ['popup__wrapper'],
    });

    const popupContent = new BaseControl({
      tagName: 'p',
      classes: ['popup__content'],
      text: `${this.currentWinner.carName} race winner!  Time:[${this.currentWinner.time}]`,
    });

    popupWrapper.node.append(popupContent.node);
    this.node.append(popupWrapper.node);
  }
}

export default WinnerPopup;
