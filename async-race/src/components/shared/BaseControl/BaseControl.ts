import { IAttr, IBaseControl } from '../interfaces/api';

class BaseControl<T extends HTMLElement> implements IBaseControl<T> {
  readonly node: T;

  constructor(controlSettings: {
    tagName: string;
    classes: string[];
    text?: string;
    attributes?: IAttr;
  }) {
    const elem: T = <T>document.createElement(controlSettings.tagName);
    elem.classList.add(...controlSettings.classes);
    elem.textContent = controlSettings.text || '';
    const keys = Object.keys(controlSettings.attributes || []);
    const values = Object.values(controlSettings.attributes || []);
    keys.forEach((key, index) => elem.setAttribute(key, `${values[index]}`));

    this.node = elem;
  }
}

export default BaseControl;
