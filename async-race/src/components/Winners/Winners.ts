import { IPropsToBaseControl } from './../shared/interfaces/api';
import BaseControl from '../shared/BaseControl/BaseControl';
import { IPage } from '../shared/interfaces/page-model';

class Winners extends BaseControl<HTMLElement> implements IPage {
  constructor(propsToBaseControl: IPropsToBaseControl) {
    super(propsToBaseControl);
    // this.render();
  }

  render(): HTMLElement {
    this.node.append('hello winners');
    return this.node;
  }
}

export default Winners;
