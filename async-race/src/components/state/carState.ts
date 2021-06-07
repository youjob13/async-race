import newCarObserver from '../..';
import api from '../api/api';

export interface ICarItemState {
  id: number;
  name: string;
  color: string;
  isEdit?: boolean;
}

export interface ICarState {
  cars: ICarItemState[];
}

// interface IAction {
//   type: string;
//   value: ICarState;
// }

export const carState: ICarState = {
  cars: [],
};

(async function () {
  carState.cars = await api.getCars();
  newCarObserver.broadcast();
})();

// const ACTION_1 = 'CARS';

// const carReducer = (state: ICarState, action: any): any => {
//   switch (action.type) {
//     case ACTION_1:
//       return {};
//   }
// };
