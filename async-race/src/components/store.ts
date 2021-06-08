import { createStore, applyMiddleware, AnyAction } from 'redux';
import thunk, { ThunkAction } from 'redux-thunk';
import apiCars, { apiEngine } from './api/api';
import { ICarItemState, ICarState } from './shared/interfaces/carState-model';
import {
  carNameRandomGenerator,
  colorRandomGenerator,
} from './shared/functions/valueRandomGenerator';

const GET_ALL_CARS = 'GET_ALL_CARS';
const SET_NEW_CAR = 'SET_NEW_CAR';
const SET_EDIT_MODE = 'SET_EDIT_MODE';
const UPDATE_CAR_PARAMS = 'UPDATE_CAR_PARAMS';
const DELETE_CAR = 'DELETE_CAR';
const GENERATE_RANDOM_CARS = 'GENERATE_RANDOM_CARS';
const TOGGLE_GARAGE_PAGE = 'TOGGLE_GARAGE_PAGE';
const START_CAR_ENGINE = 'START_CAR_ENGINE';

export const carState: ICarState = {
  cars: [
    {
      id: 1,
      name: 'BMW',
      color: '#f00',
    },
  ],
  currentGaragePage: 1,
};

const carReducer = (state = carState, action: AnyAction): ICarState => {
  switch (action.type) {
    case 'GET_ALL_CARS': {
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
      const { name, color } = action.data;
      return {
        cars: [
          ...state.cars.map((car) => {
            if (car.id === action.id) {
              const newCar = {
                id: car.id,
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
    case 'START_CAR_ENGINE': {
      return {
        cars: state.cars.map((car) => {
          if (car.id === action.id) {
            const newCar = { ...car };
            newCar.drivingMode = 'started';
          }
          return car;
        }),
        currentGaragePage: state.currentGaragePage,
      };
    }
    default:
      return state;
  }
};

export const store = createStore(carReducer, applyMiddleware(thunk));

// Action creators
const setAllCarsAC = (data: unknown) => ({ type: GET_ALL_CARS, data });

const setNewCarAC = (data: { id: number; name: string; color: string }) => ({
  type: SET_NEW_CAR,
  data,
});

export const setEditModeAC = (id: number) => ({ type: SET_EDIT_MODE, id });

const updateCarParamsAC = (
  id: number,
  data: {
    name: string;
    color: string;
  }
) => ({
  type: UPDATE_CAR_PARAMS,
  id,
  data,
});

const deleteCarAC = (id: number) => ({ type: DELETE_CAR, id });

const generateRandomCarsAC = (data: ICarItemState[]) => ({
  type: GENERATE_RANDOM_CARS,
  data,
});

export const toggleGaragePageAC = (isIncrease: boolean) => ({
  type: TOGGLE_GARAGE_PAGE,
  isIncrease,
});

const startCarEngineAC = (id: number) => ({ type: START_CAR_ENGINE, id });

// Thunk creators
export const getAllCarsTC =
  (): ThunkAction<void, ICarState, unknown, AnyAction> => async (dispatch) => {
    const data = await apiCars.getAllCars();
    dispatch(setAllCarsAC(data));
  };

export const generateNewCarTC =
  (data: {
    name: string;
    color: string;
  }): ThunkAction<void, ICarState, unknown, AnyAction> =>
  async (dispatch) => {
    const result = await apiCars.createCar(data);
    dispatch(setNewCarAC(result));
  };

export const updateCarParamsTC =
  (
    id: number,
    data: {
      name: string;
      color: string;
    }
  ): ThunkAction<void, ICarState, unknown, AnyAction> =>
  async (dispatch) => {
    const res = await apiCars.updateCar(id, data);
    dispatch(updateCarParamsAC(id, res));
  };

export const deleteCarTC =
  (id: number): ThunkAction<void, ICarState, unknown, AnyAction> =>
  async (dispatch) => {
    await apiCars.deleteCar(id);
    dispatch(deleteCarAC(id));
  };

export const generateRandomCarsTC =
  (): ThunkAction<void, ICarState, unknown, AnyAction> => async (dispatch) => {
    const newCars: ICarItemState[] = [];

    for (let i = 0; i < 5; i++) {
      const newRandomCar = {
        name: carNameRandomGenerator(),
        color: colorRandomGenerator(),
      };
      const newCar = await apiCars.createCar(newRandomCar);
      newCars.push(newCar);
    }

    dispatch(generateRandomCarsAC(newCars));
  };

export const startCarEngineTC =
  (id: number): ThunkAction<void, ICarState, unknown, AnyAction> =>
  async (dispatch) => {
    const calcCarSpeed = (result: {
      velocity: number;
      distance: number;
    }): number => {
      const { velocity, distance } = result;
      return distance / velocity;
    };

    const result = await apiEngine.toggleEngine(id, 'started');
    const carSpeed = calcCarSpeed(result);
    dispatch(startCarEngineAC(id));
    // return carSpeed;
  };
