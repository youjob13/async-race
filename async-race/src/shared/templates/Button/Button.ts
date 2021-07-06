import BaseControl from '../BaseControl/BaseControl';
import { IPropsToBaseControl } from '../../interfaces/api-models';
import './button.scss';

class Button extends BaseControl<HTMLElement> {
  constructor(
    propsToBaseControl: IPropsToBaseControl,
    private onBtnClick: (event: Event) => void
  ) {
    super(propsToBaseControl);
    this.node.onclick = (event: Event) => this.onBtnClick(event);
  }
}

export default Button;
