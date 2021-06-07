import { IPropsToBaseControl } from '../shared/interfaces/api-models';
import { IPage } from '../shared/interfaces/page-model';
import BaseControl from '../shared/BaseControl/BaseControl';

class Winners extends BaseControl<HTMLElement> implements IPage {
  constructor(private propsToBaseControl: IPropsToBaseControl) {
    super(propsToBaseControl);
  }

  render(): HTMLElement {
    this.node.append('hello winners');
    return this.node;
  }
}

export default Winners;
