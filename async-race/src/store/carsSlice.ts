import { AnyAction, createSlice, ThunkAction } from '@reduxjs/toolkit';
import apiCars, { apiEngine } from '../components/api/api';
import {
  carNameRandomGenerator,
  colorRandomGenerator,
} from '../shared/helperFunctions/valueRandomGenerator';
import { ICar, ICarsState } from '../shared/interfaces/carState-model';
import { getCarStateSelector } from './carsSelectors';
import calcCarSpeed from '../shared/helperFunctions/calculateSpeed';

export const COUNT_CARS_ON_PAGE = 7;

type CarParams = { name: string; color: string };

const carsSlice = createSlice({
  name: 'carSlice',
  initialState: {
    cars: [],
    currentGaragePage: 1,
    carsNumber: 0,
  } as ICarsState,
  reducers: {
    startRace: (state: ICarsState, action) => {
      return {
        cars: state.cars.map((car, index) => {
          if (
            (state.currentGaragePage - 1) * COUNT_CARS_ON_PAGE <= index &&
            index < COUNT_CARS_ON_PAGE * state.currentGaragePage
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
        carsNumber: state.carsNumber,
      };
    },
    resetCarPositionAndStopEngine: (state: ICarsState) => {
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
        carsNumber: state.carsNumber,
      };
    },
    setEngineStatusIsBroken: (state: ICarsState, action) => {
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
        carsNumber: state.carsNumber,
      };
    },
    toggleCarEngine: (state: ICarsState, action) => {
      const { timeToFinish, id, status } = action.payload;
      return {
        cars: state.cars.map((car) => {
          if (car.id === id) {
            console.log(status);
            return {
              ...car,
              timeToFinish,
              drivingMode: status,
            };
          }
          return car;
        }),
        currentGaragePage: state.currentGaragePage,
        carsNumber: state.carsNumber,
      };
    },
    setAllCars: (state: ICarsState, action) => {
      const { res, totalCarsNumber, currentGaragePage } = action.payload;

      return {
        cars: [...res],
        currentGaragePage,
        carsNumber: totalCarsNumber,
      };
    },
    generateRandomCars: (state: ICarsState, action) => {
      return {
        cars: [...state.cars, ...action.payload],
        currentGaragePage: state.currentGaragePage,
        carsNumber: state.carsNumber + 100,
      };
    },
    // toggleGaragePage: (state: ICar, action) => {
    //   return {
    //     cars: state.cars,
    //     currentGaragePage: action.payload,
    //     carsNumber: state.carsNumber,
    //   };
    // },
    // deleteCar: (state: ICar, action) => {
    //   return {
    //     cars: state.cars.filter((car) => car.id !== action.payload),
    //     currentGaragePage: state.currentGaragePage,
    //     carsNumber: state.carsNumber,
    //   };
    // },
    setEditMode: (state: ICarsState, action) => {
      return {
        cars: state.cars.map((car) => {
          if (car.id === action.payload) {
            return { ...car, isEdit: true };
          }
          return car;
        }),
        currentGaragePage: state.currentGaragePage,
        carsNumber: state.carsNumber,
      };
    },
    updateCarParams: (state: ICarsState, action) => {
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
        carsNumber: state.carsNumber,
      };
    },
    generateNewCar: (state: ICarsState, action) => {
      return {
        cars: [...state.cars, action.payload],
        currentGaragePage: state.currentGaragePage,
        carsNumber: state.carsNumber + 1,
      };
    },
  },
});

export default carsSlice.reducer;

export const {
  // startRace,
  resetCarPositionAndStopEngine,
  toggleCarEngine,
  setEngineStatusIsBroken,
  setAllCars,
  generateRandomCars,
  // deleteCar,
  setEditMode,
  updateCarParams,
  // toggleGaragePage,
  generateNewCar,
} = carsSlice.actions;

export const getAllCarsTC =
  (
    currentGaragePage?: number,
    limit?: number
  ): ThunkAction<void, ICarsState, unknown, AnyAction> =>
  async (dispatch): Promise<void> => {
    const { res, totalCarsNumber } = await apiCars.getAllCars(
      currentGaragePage,
      limit
    );
    dispatch(setAllCars({ res, totalCarsNumber, currentGaragePage }));
  };

export const toggleGaragePageTC =
  (isIncrement: boolean): ThunkAction<void, ICarsState, unknown, AnyAction> =>
  async (dispatch, state: any): Promise<void> => {
    let { currentGaragePage } = state().carReducer;
    currentGaragePage = isIncrement
      ? currentGaragePage + 1
      : currentGaragePage - 1;
    // dispatch(toggleGaragePage(currentGaragePage));
    dispatch(getAllCarsTC(currentGaragePage, COUNT_CARS_ON_PAGE));
  };

export const generateNewCarTC =
  (data: CarParams): ThunkAction<void, ICarsState, unknown, AnyAction> =>
  async (dispatch): Promise<void> => {
    const res = await apiCars.createCar(data);
    dispatch(generateNewCar(res));
  };

export const updateCarParamsTC =
  (data: ICar): ThunkAction<void, ICarsState, unknown, AnyAction> =>
  async (dispatch): Promise<void> => {
    const res = await apiCars.updateCar(data);
    dispatch(updateCarParams(res));
  };

export const deleteCarTC =
  (id: number): ThunkAction<void, ICarsState, unknown, AnyAction> =>
  async (dispatch, state: any): Promise<void> => {
    const { currentGaragePage } = state().carReducer;
    await apiCars.deleteCar(id);
    dispatch(getAllCarsTC(currentGaragePage, COUNT_CARS_ON_PAGE));
  };

export const generateRandomCarsTC =
  (): ThunkAction<void, ICarsState, unknown, AnyAction> =>
  async (dispatch): Promise<void> => {
    const requests = [];
    for (let i = 0; i < 1000; i++) {
      const obj = {
        name: carNameRandomGenerator(),
        color: colorRandomGenerator(),
      };
      // res.push(apiCars.createCar.bind(apiCars));
      requests.push(
        fetch('http://127.0.0.1:3000/garage', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json;charset=utf-8',
          },
          body: JSON.stringify(obj),
        })
      );
    }

    Promise.all(requests).then((responses) => {
      const responsesJSON = responses.map((response) => response.json());

      Promise.all(responsesJSON).then((result: ICar[]) =>
        dispatch(generateRandomCars(result))
      );
    });

    // Promise.all(requests)
    //   .then((responses) => responses.map((response) => response.json()))
    //   .then((result) => dispatch(generateRandomCars(result)));

    // Promise.all(res).then((response) => {
    //   let a = response.map((callback) =>
    //     callback({
    //       name: carNameRandomGenerator(),
    //       color: colorRandomGenerator(),
    //     })
    //   );
    //   Promise.all(a)
    //     .then((responses2) => responses2.map((ssa: any) => ssa.json()))
    //     .then((result) => {
    //       dispatch(generateRandomCars(result));
    //     });
    // });
  };

export const startRaceTC =
  (): ThunkAction<void, ICarsState, unknown, AnyAction> =>
  async (dispatch, state: any): Promise<void> => {
    const { newCars } = getCarStateSelector(state().carReducer);
    newCars.forEach((newCar) => apiEngine.toggleEngine(newCar.id, 'started'));
  };

export const startCarEngineTC =
  (
    id: number,
    status: string
  ): ThunkAction<void, ICarsState, unknown, AnyAction> =>
  async (dispatch, state: any): Promise<void> => {
    const { velocity, distance } = await apiEngine.toggleEngine(id, status);
    dispatch(
      toggleCarEngine({
        timeToFinish: calcCarSpeed(velocity, distance),
        id,
        status,
      })
    );

    const engineStatus = await apiEngine.switchEngineMode(id, 'drive');
    console.log('engineStatus', engineStatus);

    if (!engineStatus) dispatch(setEngineStatusIsBroken(id));
  };

export const stopCarEngineTC =
  (
    id: number,
    status: string
  ): ThunkAction<void, ICarsState, unknown, AnyAction> =>
  async (dispatch): Promise<void> => {
    const { velocity, distance } = await apiEngine.toggleEngine(id, status);
    const result = { timeToFinish: 0, id, status };
    dispatch(toggleCarEngine(result));
  };
