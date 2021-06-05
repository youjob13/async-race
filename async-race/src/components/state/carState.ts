export interface ICarItemState {
  id: number;
  name: string;
  color: string;
}

export interface ICarState {
  cars: ICarItemState[];
}

interface IAction {
  type: string;
  value: ICarState;
}

export const carState = {
  cars: [
    {
      id: 1,
      name: 'BMW',
      color: '#155405',
    },
    {
      id: 2,
      name: 'Hyundai',
      color: '#f90',
    },
    {
      id: 3,
      name: 'Opel',
      color: '#533993',
    },
  ],
};

const ACTION_1 = 'CARS';

// const carReducer = (state: ICarState, action: any): any => {
//   switch (action.type) {
//     case ACTION_1:
//       return {};
//   }
// };
