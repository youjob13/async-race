import { IBaseControl, IPropsToBaseControl } from '../../interfaces/api-models';

class BaseControl<T extends HTMLElement> implements IBaseControl<T> {
  readonly node: T; // TODO: ask Ivan (тип вынеси в интерфейс)

  constructor(controlSettings: IPropsToBaseControl) {
    const element: T = <T>document.createElement(controlSettings.tagName);
    element.classList.add(...controlSettings.classes);
    element.textContent = controlSettings.text || '';
    const keys = Object.keys(controlSettings.attributes || []);
    const values = Object.values(controlSettings.attributes || []);
    keys.forEach((key, index) => element.setAttribute(key, `${values[index]}`));

    this.node = element;
  }
}

export default BaseControl;
