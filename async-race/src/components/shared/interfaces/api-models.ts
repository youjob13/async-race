export interface IBaseControl<U> {
  readonly node: U;
}

export interface IPropsToBaseControl {
  tagName: string;
  classes: string[];
  text?: string;
  attributes?: IAttr;
}

export interface IAttr {
  [key: string]: string | number;
}

export interface ICarForm {
  [key: string]: string;
}
