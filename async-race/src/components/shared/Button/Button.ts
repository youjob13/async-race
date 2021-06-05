import BaseControl from '../BaseControl/BaseControl';
import { IPropsToBaseControl } from '../interfaces/api';
import './button.scss';

class Button extends BaseControl<HTMLElement> {
  constructor(
    propsToBaseControl: IPropsToBaseControl,
    private onBtnClick: (e: Event) => void
  ) {
    super(propsToBaseControl);
    this.node.onclick = (e: Event) => this.onBtnClick(e);
  }
}

export default Button;
