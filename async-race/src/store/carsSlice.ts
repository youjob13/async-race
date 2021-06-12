import { AnyAction, createSlice, ThunkAction } from '@reduxjs/toolkit';
import apiCars, { apiEngine } from '../components/api/api';
// import { COUNT_CARS_ON_PAGE } from '../components/Garage/Garage';
import {
  carNameRandomGenerator,
  colorRandomGenerator,
} from '../shared/functions/valueRandomGenerator';
import { ICarItemState, ICarState } from '../shared/interfaces/carState-model';
import { getCarStateSelector } from './carsSelectors';

const calcCarSpeed = (velocity: number, distance: number): number => {
  return distance / velocity;
};

type CarParams = { name: string; color: string };

const carsSlice = createSlice({
  name: 'carSlice',
  initialState: {
    cars: [{ id: 1, name: 'asd', color: '#fff' }],
    currentGaragePage: 1,
  } as ICarState,
  reducers: {
    startRace: (state: ICarState, action) => {
      return {
        cars: state.cars.map((car, index) => {
          if (
            (state.currentGaragePage - 1) * 7 <= index &&
            index < 7 * state.currentGaragePage
          ) {
            return {
              id: car.id,
              color: car.color,
              name: car.name,
              isEdit: car.isEdit,
              drivingMode: 'started',
              timeToFinish: action.payload[index + state.currentGaragePage], // TODO: car id
            };
          }
          return car;
        }),
        currentGaragePage: state.currentGaragePage,
      };
    },
    resetCarPositionAndStopEngine: (state: ICarState) => {
      return {
        cars: state.cars.map((car) => {
          return {
            id: car.id,
            isEdit: car.isEdit,
            drivingMode: 'stopped',
            name: car.name,
            color: car.color,
          };
        }),
        currentGaragePage: state.currentGaragePage,
      };
    },
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
  startRace,
  resetCarPositionAndStopEngine,
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
    const newGeneratedCars: { name: string; color: string }[] = [];
    // const carss = []

    for (let i = 0; i < 1000; i++) {
      // carss.push(apiCars.createCar);
      newGeneratedCars.push({
        name: carNameRandomGenerator(),
        color: colorRandomGenerator(),
      });
    }

    const cars = newGeneratedCars.map(async (car) =>
      fetch('http://127.0.0.1:3000/garage', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json;charset=utf-8',
        },
        body: JSON.stringify(car),
      })
    );

    Promise.all(cars)
      .then((responses) => Promise.all(responses.map((r) => r.json())))
      .then((responses) => {
        console.log(responses);
        dispatch(generateRandomCars(responses));
      });
    console.log(cars);

    // const cars = newCars.map((item) => apiCars.createCar(item));
    // dispatch(generateRandomCars(cars));
  };

export const startRaceTC =
  (): ThunkAction<void, ICarState, unknown, AnyAction> =>
  async (dispatch, state: any): Promise<void> => {
    const { cars, currentGaragePage } = getCarStateSelector(state().carReducer);
    let carsOnCurrentPage = [];

    carsOnCurrentPage = cars.map((car, index) => {
      if (
        (currentGaragePage - 1) * 7 <= index &&
        index < 7 * currentGaragePage
      ) {
        return apiEngine.toggleEngine(car.id, 'started');
      }
    });

    Promise.all(carsOnCurrentPage).then((responses) => {
      const an = responses.map((response) => {
        const { velocity, distance } = response || { velocity: 0, distance: 0 };
        return calcCarSpeed(velocity, distance);
      });
      console.log(an);

      dispatch(startRace(an));
    });
  };

export const startCarEngineTC =
  (
    id: number,
    status: string
  ): ThunkAction<void, ICarState, unknown, AnyAction> =>
  async (dispatch): Promise<void> => {
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
