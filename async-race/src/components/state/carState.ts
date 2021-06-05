export interface ICarItemState {
  id: number;
  brand: string;
  model: string;
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
      brand: 'BMW',
      model: 'X6',
    },
    {
      id: 2,
      brand: 'Hyundai',
      model: 'Solaris',
    },
    {
      id: 3,
      brand: 'Opel',
      model: 'Astra',
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
