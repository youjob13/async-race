import { Store } from 'redux';
import { ThunkActionType, ThunkDispatchType } from '../interfaces/api-models';

const dispatchThunk = <S>(stores: Store, thunk: ThunkActionType<S>): void => {
  (stores.dispatch as ThunkDispatchType<S>)(thunk);
};

export default dispatchThunk;
