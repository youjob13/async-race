import {
  AnyAction,
  CombinedState,
  ThunkAction,
  ThunkDispatch,
} from '@reduxjs/toolkit';
import { ICarsState } from './carState-model';
import { IWinnersState } from './winnersState-models';

export type RootElem = HTMLElement | null;
export type ICombineCarsState = CombinedState<{ carReducer: ICarsState }>;

export type ICombineWinnersState = CombinedState<{
  winnersReducer: IWinnersState;
}>;

export type ThunkActionType<S> = ThunkAction<void, S, unknown, AnyAction>;

export type ThunkDispatchType<S> = ThunkDispatch<S, unknown, AnyAction>;

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
