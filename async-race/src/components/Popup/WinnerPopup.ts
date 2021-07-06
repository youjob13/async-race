import './winnerPopup.scss';
import BaseControl from '../../shared/templates/BaseControl/BaseControl';
import { ICurrentWinner } from '../../shared/interfaces/carState-model';
import { PopupClasses, Tag } from '../../shared/variables';

const winnerPopupPropsToBaseControl = {
  tagName: Tag.DIV,
  classes: [PopupClasses.POPUP, PopupClasses.WINNERS],
};
const popupWrapperProps = {
  tagName: Tag.DIV,
  classes: [PopupClasses.WRAPPER],
};

class WinnerPopup extends BaseControl<HTMLElement> {
  constructor(private readonly currentWinner: ICurrentWinner) {
    super(winnerPopupPropsToBaseControl);
    this.render();
  }

  private render(): void {
    const popupWrapper = new BaseControl(popupWrapperProps);
    const popupContent = new BaseControl({
      tagName: Tag.P,
      classes: [PopupClasses.POPUP_CONTENT],
      text: `${this.currentWinner.carName} race winner!  Time:[${this.currentWinner.time}]`,
    });
    popupWrapper.node.append(popupContent.node);
    this.node.append(popupWrapper.node);
  }
}

export default WinnerPopup;
