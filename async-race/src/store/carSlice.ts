import { AnyAction, createSlice, ThunkAction } from '@reduxjs/toolkit';
import apiCars, { apiEngine } from '../components/api/api';
import {
  carNameRandomGenerator,
  colorRandomGenerator,
} from '../components/shared/functions/valueRandomGenerator';
import {
  ICarItemState,
  ICarState,
} from '../components/shared/interfaces/carState-model';

const carSlice = createSlice({
  name: 'carSlice',
  initialState: {
    cars: [{ id: 1, name: 'asd', color: '#fff' }],
    currentGaragePage: 1,
  },
  reducers: {
    setAllCars: (state, action) => {
      return {
        cars: [...action.payload],
        currentGaragePage: state.currentGaragePage,
      };
    },
    toggleGaragePage: (state, action) => {
      return {
        cars: state.cars,
        currentGaragePage: action.payload
          ? state.currentGaragePage + 1
          : state.currentGaragePage - 1,
      };
    },
    generateRandomCars: (state, action) => {
      return {
        cars: [...state.cars, ...action.payload],
        currentGaragePage: state.currentGaragePage,
      };
    },
    deleteCar: (state, action) => {
      return {
        cars: state.cars.filter((car) => car.id !== action.payload),
        currentGaragePage: state.currentGaragePage,
      };
    },
    setEditMode: (state, action) => {
      return {
        cars: state.cars.map((car) => {
          if (car.id === action.payload) {
            return { ...car, isEdit: true };
          }
          return car;
        }),
        currentGaragePage: state.currentGaragePage,
      };
    },
    updateCarParams: (state, action) => {
      const { id, name, color } = action.payload;
      return {
        cars: state.cars.map((car) => {
          if (car.id === id) {
            return {
              id,
              name,
              color,
              isEdit: false,
            };
          }
          return car;
        }),
        currentGaragePage: state.currentGaragePage,
      };
    },
    generateNewCar: (state, action) => {
      return {
        cars: [...state.cars, action.payload],
        currentGaragePage: state.currentGaragePage,
      };
    },
  },
});
type CarParams = { name: string; color: string };

export default carSlice.reducer;

export const {
  setAllCars,
  toggleGaragePage,
  generateRandomCars,
  deleteCar,
  setEditMode,
  updateCarParams,
  generateNewCar,
} = carSlice.actions;

export const getAllCarsTC =
  (): ThunkAction<void, ICarState, unknown, AnyAction> =>
  async (dispatch): Promise<void> => {
    const data = await apiCars.getAllCars();
    dispatch(setAllCars(data));
  };

export const generateNewCarTC =
  (data: CarParams): ThunkAction<void, ICarState, unknown, AnyAction> =>
  async (dispatch): Promise<void> => {
    const result = await apiCars.createCar(data);
    dispatch(generateNewCar(result));
  };

export const updateCarParamsTC =
  (data: ICarItemState): ThunkAction<void, ICarState, unknown, AnyAction> =>
  async (dispatch): Promise<void> => {
    const res = await apiCars.updateCar(data);
    dispatch(updateCarParams(res));
  };

export const deleteCarTC =
  (id: number): ThunkAction<void, ICarState, unknown, AnyAction> =>
  async (dispatch): Promise<void> => {
    await apiCars.deleteCar(id);
    dispatch(deleteCar(id));
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
    dispatch(generateRandomCars(await Promise.all(cars)));
  };

export const startCarEngineTC =
  (id: number): ThunkAction<void, ICarState, unknown, AnyAction> =>
  async (dispatch): Promise<void> => {
    const calcCarSpeed = (velocity: number, distance: number): number => {
      return distance / velocity;
    };

    const { velocity, distance } = await apiEngine.toggleEngine(id, 'started');
    const result = { time: calcCarSpeed(velocity, distance), id };

    // dispatch(startCarEngineAC(result));
  };
