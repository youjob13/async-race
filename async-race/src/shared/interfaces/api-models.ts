import {
  AnyAction,
  CombinedState,
  ThunkAction,
  ThunkDispatch,
} from '@reduxjs/toolkit';
import { ICarsState } from './carState-model';
import { IWinnersState } from './winnersState-models';
import { Tag } from '../variables';

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

export type AttributeType = string | number;
export type ICarForm = Record<string, string>;

export interface IPropsToBaseControl {
  tagName: Tag | string;
  classes: string[];
  text?: string;
  attributes?: Record<string, AttributeType>;
}
