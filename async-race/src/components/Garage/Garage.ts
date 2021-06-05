import { IPropsToBaseControl } from './../shared/interfaces/api';
import BaseControl from '../shared/BaseControl/BaseControl';
import { IPage } from '../shared/interfaces/page-model';

class Garage extends BaseControl<HTMLElement> implements IPage {
  constructor(propsToBaseControl: IPropsToBaseControl) {
    super(propsToBaseControl);
    // this.render();
  }

  render(): HTMLElement {
    this.node.append('hello garage');
    return this.node;
  }
}

export default Garage;
