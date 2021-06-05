import BaseControl from '../BaseControl/BaseControl';
import { IAttr } from '../interfaces/api';

class Input extends BaseControl<HTMLInputElement> {
  constructor(
    private propsToBaseControl: {
      tagName: string;
      classes: string[];
      attributes: IAttr;
    },
    private inputCallback?: (value: string, type: string) => void
  ) {
    super(propsToBaseControl);
    this.node.addEventListener('input', this.handleInput.bind(this));
  }

  private handleInput(): void {
    if (this.inputCallback)
      this.inputCallback(
        this.propsToBaseControl.attributes.name.toString(),
        this.node.value
      );
  }
}

export default Input;
