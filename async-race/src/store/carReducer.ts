import { AnyAction } from 'redux';
import { ThunkAction } from 'redux-thunk';
import apiCars, { apiEngine } from '../components/api/api';
import {
  carNameRandomGenerator,
  colorRandomGenerator,
} from '../components/shared/functions/valueRandomGenerator';
import {
  ICarItemState,
  ICarState,
} from '../components/shared/interfaces/carState-model';
import ACTIONS from './actions';

type CarParams = { name: string; color: string };

const carState: ICarState = {
  cars: [
    {
      id: 1,
      name: 'BMW',
      color: '#f00',
    },
  ],
  currentGaragePage: 1,
};

export const carReducer = (state = carState, action: AnyAction): ICarState => {
  switch (action.type) {
    case 'SET_ALL_CARS': {
      return {
        cars: [...action.data],
        currentGaragePage: state.currentGaragePage,
      };
    }
    case 'SET_NEW_CAR': {
      return {
        cars: [...state.cars, action.data],
        currentGaragePage: state.currentGaragePage,
      };
    }
    case 'SET_EDIT_MODE': {
      return {
        cars: [
          ...state.cars.map((car) => {
            if (car.id === action.id) {
              const newCar = { ...car, isEdit: true };
              return newCar;
            }
            return car;
          }),
        ],
        currentGaragePage: state.currentGaragePage,
      };
    }
    case 'UPDATE_CAR_PARAMS': {
      const { id, name, color } = action.data;
      return {
        cars: [
          ...state.cars.map((car) => {
            if (car.id === id) {
              const newCar = {
                id,
                name,
                color,
                isEdit: false,
              };
              return newCar;
            }
            return car;
          }),
        ],
        currentGaragePage: state.currentGaragePage,
      };
    }
    case 'DELETE_CAR': {
      return {
        cars: [...state.cars.filter((car) => car.id !== action.id)],
        currentGaragePage: state.currentGaragePage,
      };
    }
    case 'GENERATE_RANDOM_CARS': {
      return {
        cars: [...state.cars, ...action.data],
        currentGaragePage: state.currentGaragePage,
      };
    }
    case 'TOGGLE_GARAGE_PAGE': {
      return {
        cars: [...state.cars],
        currentGaragePage: action.isIncrease
          ? state.currentGaragePage + 1
          : state.currentGaragePage - 1,
      };
    }
    // case 'START_CAR_ENGINE': {
    //   return {
    //     cars: state.cars.map((car) => {
    //       if (car.id === action.data.id) {
    //         const { time } = action.data;
    //         const newCar = {
    //           ...car,
    //           time,
    //           drivingMode: 'started',
    //         };
    //         return newCar;
    //       }
    //       return car;
    //     }),
    //     currentGaragePage: state.currentGaragePage,
    //   };
    // }
    default:
      return state;
  }
};

// Action creators
const setAllCarsAC = (data: ICarItemState[]): AnyAction => ({
  type: ACTIONS.SET_ALL_CARS,
  data,
});

const setNewCarAC = (data: ICarItemState): AnyAction => ({
  type: ACTIONS.SET_NEW_CAR,
  data,
});

const updateCarParamsAC = (data: ICarItemState): AnyAction => ({
  type: ACTIONS.UPDATE_CAR_PARAMS,
  data,
});

const deleteCarAC = (id: number): AnyAction => ({
  type: ACTIONS.DELETE_CAR,
  id,
});

const generateRandomCarsAC = (data: ICarItemState[]): AnyAction => ({
  type: ACTIONS.GENERATE_RANDOM_CARS,
  data,
});

const startCarEngineAC = (data: { time: number; id: number }): AnyAction => ({
  type: ACTIONS.START_CAR_ENGINE,
  data,
});

export const setEditModeAC = (id: number): AnyAction => ({
  type: ACTIONS.SET_EDIT_MODE,
  id,
});

export const toggleGaragePageAC = (isIncrease: boolean): AnyAction => ({
  type: ACTIONS.TOGGLE_GARAGE_PAGE,
  isIncrease,
});

// Thunk creators
export const getAllCarsTC =
  (): ThunkAction<void, ICarState, unknown, AnyAction> =>
  async (dispatch): Promise<void> => {
    const data = await apiCars.getAllCars();
    dispatch(setAllCarsAC(data));
  };

export const generateNewCarTC =
  (data: CarParams): ThunkAction<void, ICarState, unknown, AnyAction> =>
  async (dispatch): Promise<void> => {
    const result = await apiCars.createCar(data);
    dispatch(setNewCarAC(result));
  };

export const updateCarParamsTC =
  (data: ICarItemState): ThunkAction<void, ICarState, unknown, AnyAction> =>
  async (dispatch): Promise<void> => {
    const res = await apiCars.updateCar(data);
    dispatch(updateCarParamsAC(res));
  };

export const deleteCarTC =
  (id: number): ThunkAction<void, ICarState, unknown, AnyAction> =>
  async (dispatch): Promise<void> => {
    await apiCars.deleteCar(id);
    dispatch(deleteCarAC(id));
  };

export const generateRandomCarsTC =
  (): ThunkAction<void, ICarState, unknown, AnyAction> =>
  async (dispatch): Promise<void> => {
    const newCars: {
      name: string;
      color: string;
    }[] = [];

    for (let i = 0; i < 5; i++) {
      newCars.push({
        name: carNameRandomGenerator(),
        color: colorRandomGenerator(),
      });
    }

    const cars = newCars.map((item) => apiCars.createCar(item));
    dispatch(generateRandomCarsAC(await Promise.all(cars)));
  };

export const startCarEngineTC =
  (id: number): ThunkAction<void, ICarState, unknown, AnyAction> =>
  async (dispatch): Promise<void> => {
    const calcCarSpeed = (velocity: number, distance: number): number => {
      return distance / velocity;
    };

    const { velocity, distance } = await apiEngine.toggleEngine(id, 'started');
    const result = { time: calcCarSpeed(velocity, distance), id };

    dispatch(startCarEngineAC(result));
  };
