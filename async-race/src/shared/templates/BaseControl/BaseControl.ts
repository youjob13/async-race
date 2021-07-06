import { IBaseControl, IPropsToBaseControl } from '../../interfaces/api-models';
import { EmptyString } from '../../variables';

class BaseControl<T extends HTMLElement> implements IBaseControl<T> {
  readonly node: T;

  constructor(controlSettings: IPropsToBaseControl) {
    const element: T = <T>document.createElement(controlSettings.tagName);
    element.classList.add(...controlSettings.classes);
    element.textContent = controlSettings.text || EmptyString;
    const keys = Object.keys(controlSettings.attributes || []);
    const values = Object.values(controlSettings.attributes || []);
    keys.forEach((key, index) => element.setAttribute(key, `${values[index]}`));

    this.node = element;
  }
}

export default BaseControl;
