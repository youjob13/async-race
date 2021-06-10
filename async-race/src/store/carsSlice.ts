import { AnyAction, createSlice, ThunkAction } from '@reduxjs/toolkit';
import apiCars, { apiEngine } from '../components/api/api';
import {
  carNameRandomGenerator,
  colorRandomGenerator,
} from '../shared/functions/valueRandomGenerator';
import { ICarItemState, ICarState } from '../shared/interfaces/carState-model';

type CarParams = { name: string; color: string };

const carsSlice = createSlice({
  name: 'carSlice',
  initialState: {
    cars: [{ id: 1, name: 'asd', color: '#fff' }],
    currentGaragePage: 1,
  } as ICarState,
  reducers: {
    checkEngineStatus: (state: ICarState, action) => {
      return {
        cars: state.cars.map((car) => {
          if (car.id === action.payload) {
            return {
              ...car,
              drivingMode: 'breaking',
            };
          }
          return car;
        }),
        currentGaragePage: state.currentGaragePage,
      };
    },
    toggleCarEngine: (state: ICarState, action) => {
      const { timeToFinish, id, status } = action.payload;
      return {
        cars: state.cars.map((car) => {
          if (car.id === id) {
            return {
              ...car,
              timeToFinish,
              drivingMode: status,
            };
          }
          return car;
        }),
        currentGaragePage: state.currentGaragePage,
      };
    },
    setAllCars: (state: ICarState, action) => {
      return {
        cars: [...action.payload],
        currentGaragePage: state.currentGaragePage,
      };
    },
    toggleGaragePage: (state: ICarState, action) => {
      return {
        cars: state.cars,
        currentGaragePage: action.payload
          ? state.currentGaragePage + 1
          : state.currentGaragePage - 1,
      };
    },
    generateRandomCars: (state: ICarState, action) => {
      return {
        cars: [...state.cars, ...action.payload],
        currentGaragePage: state.currentGaragePage,
      };
    },
    deleteCar: (state: ICarState, action) => {
      return {
        cars: state.cars.filter((car) => car.id !== action.payload),
        currentGaragePage: state.currentGaragePage,
      };
    },
    setEditMode: (state: ICarState, action) => {
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
    updateCarParams: (state: ICarState, action) => {
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
    generateNewCar: (state: ICarState, action) => {
      return {
        cars: [...state.cars, action.payload],
        currentGaragePage: state.currentGaragePage,
      };
    },
  },
});

export default carsSlice.reducer;

export const {
  toggleCarEngine,
  checkEngineStatus,
  setAllCars,
  toggleGaragePage,
  generateRandomCars,
  deleteCar,
  setEditMode,
  updateCarParams,
  generateNewCar,
} = carsSlice.actions;

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
  (
    id: number,
    status: string
  ): ThunkAction<void, ICarState, unknown, AnyAction> =>
  async (dispatch): Promise<void> => {
    const calcCarSpeed = (velocity: number, distance: number): number => {
      return distance / velocity;
    };

    const { velocity, distance } = await apiEngine.toggleEngine(id, status);
    const result = {
      timeToFinish: calcCarSpeed(velocity, distance),
      id,
      status,
    };

    dispatch(toggleCarEngine(result));

    const engineStatus = await apiEngine.switchEngineMode(id, 'drive');
    console.log('engineStatus', engineStatus);
    if (!engineStatus) dispatch(checkEngineStatus(id));
  };

export const stopCarEngineTC =
  (
    id: number,
    status: string
  ): ThunkAction<void, ICarState, unknown, AnyAction> =>
  async (dispatch): Promise<void> => {
    const { velocity, distance } = await apiEngine.toggleEngine(id, status);
    const result = { timeToFinish: 0, id, status };
    // console.log(result);

    dispatch(toggleCarEngine(result));
  };
