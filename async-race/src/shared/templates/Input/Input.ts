import BaseControl from '../BaseControl/BaseControl';
import { AttributeType } from '../../interfaces/api-models';
import { EventName } from '../../variables';

class Input extends BaseControl<HTMLInputElement> {
  constructor(
    private propsToBaseControl: {
      tagName: string;
      classes: string[];
      attributes: Record<string, AttributeType>;
    },
    private inputCallback?: (value: string, type: string) => void
  ) {
    super(propsToBaseControl);
    this.node.addEventListener(EventName.INPUT, this.handleInput.bind(this));
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
