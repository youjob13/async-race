import { AnyAction, createSlice, ThunkAction } from '@reduxjs/toolkit';
import { apiCars, apiEngine, apiWinner } from '../shared/api/api';
import {
  carNameRandomGenerator,
  colorRandomGenerator,
} from '../shared/helperFunctions/valueRandomGenerator';
import { ICar, ICarsState } from '../shared/interfaces/carState-model';
import calcCarSpeed from '../shared/helperFunctions/calculateSpeed';
import { getCurrentWinnerAndRaceStatus } from './carsSelectors';
import Timer from '../shared/Timer';
import { ITimer } from '../shared/interfaces/ITimer';
import {
  CreateCarRequest,
  WinnerRequest,
} from '../shared/interfaces/requests-to-API-models';

export const COUNT_CARS_ON_PAGE = 7;

const carsSlice = createSlice({
  name: 'carSlice',
  initialState: {
    cars: [],
    currentGaragePage: 1,
    carsNumber: 0,
    currentWinner: null,
  } as ICarsState,
  reducers: {
    startRace: (state: ICarsState, action) => {
      return {
        ...state,
        isStartedRace: true,
        cars: state.cars.map((car, index) => {
          return {
            ...car,
            drivingMode: 'started',
            timeToFinish: action.payload[index],
          };
        }),
      };
    },
    updateWinnersWinCount: (state: ICarsState, action) => {
      const { id, newWinsCount } = action.payload;
      return {
        ...state,
        cars: state.cars.map((car) => {
          if (car.id === id) {
            return {
              ...car,
              wins: newWinsCount,
            };
          }
          return car;
        }),
      };
    },
    nullifyCurrentWinner: (state: ICarsState) => {
      return {
        ...state,
        currentWinner: null,
      };
    },
    setCurrentRaceWinner: (state: ICarsState, action) => {
      const { carName, time } = action.payload;
      return {
        ...state,
        currentWinner: {
          carName,
          time,
        },
      };
    },
    setEngineStatusIsBroken: (state: ICarsState, action) => {
      return {
        ...state,
        cars: state.cars.map((car) => {
          if (car.id === action.payload) {
            return {
              ...car,
              drivingMode: 'breaking',
            };
          }
          return car;
        }),
      };
    },
    toggleCarEngine: (state: ICarsState, action) => {
      const { timeToFinish, id, status } = action.payload;
      return {
        ...state,
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
      };
    },
    generateRandomCars: (state: ICarsState, action) => {
      return {
        ...state,
        cars: [...state.cars, ...action.payload],
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
    setEditCarMode: (state: ICarsState, action) => {
      return {
        ...state,
        cars: state.cars.map((car) => {
          if (car.id === action.payload) {
            return { ...car, isEdit: true };
          }
          return car;
        }),
      };
    },
    updateCarParams: (state: ICarsState, action) => {
      const { id, name, color } = action.payload;
      return {
        ...state,
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
      };
    },
    generateNewCar: (state: ICarsState, action) => {
      return {
        ...state,
        cars: [...state.cars, action.payload],
        carsNumber: state.carsNumber + 1,
      };
    },
    setAllCars: (state: ICarsState, action) => {
      const { res, totalCarsNumber, currentGaragePage } = action.payload;

      return {
        ...state,
        cars: [...res],
        currentGaragePage,
        carsNumber: totalCarsNumber,
      };
    },
  },
});

export default carsSlice.reducer;

export const {
  nullifyCurrentWinner,
  updateWinnersWinCount,
  setCurrentRaceWinner,
  startRace,
  toggleCarEngine,
  setEngineStatusIsBroken,
  setAllCars,
  generateRandomCars,
  setEditCarMode,
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
  (data: CreateCarRequest): ThunkAction<void, ICarsState, unknown, AnyAction> =>
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
      const randomGeneratedCar = {
        name: carNameRandomGenerator(),
        color: colorRandomGenerator(),
      };
      requests.push(
        fetch('http://127.0.0.1:3000/garage', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json;charset=utf-8',
          },
          body: JSON.stringify(randomGeneratedCar),
        })
      );
    }

    Promise.all(requests).then((responses) => {
      const responsesJSON = responses.map((response) => response.json());

      Promise.all(responsesJSON).then((result: ICar[]) =>
        dispatch(generateRandomCars(result))
      );
    });
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

    const isNotBrokenEngine = await apiEngine.switchEngineMode(id, 'drive');
    console.log('isNotBrokenEngine', isNotBrokenEngine);

    if (!isNotBrokenEngine) dispatch(setEngineStatusIsBroken(id));
  };

export const updateWinnerTC =
  (
    carName: string,
    data: WinnerRequest
  ): ThunkAction<void, ICarsState, unknown, AnyAction> =>
  async (dispatch): Promise<void> => {
    const newWinsCount = data.wins + 1;
    const response = await apiWinner.updateWinner({
      ...data,
      wins: newWinsCount,
    });
    dispatch(
      updateWinnersWinCount({
        id: response.id,
        newWinsCount,
      })
    );
    dispatch(setCurrentRaceWinner({ carName, time: data.time }));
  };

export const createWinnerTC =
  (
    carName: string,
    winnerParams: {
      id: number;
      wins: number;
      time: number;
    }
  ): ThunkAction<void, ICarsState, unknown, AnyAction> =>
  async (dispatch): Promise<void> => {
    const response = await apiWinner.createWinner(winnerParams);
    console.log(response);
    dispatch(updateWinnerTC(carName, response));
  };

export const checkEngineStatusTC =
  (timerRace: ITimer): ThunkAction<void, ICarsState, unknown, AnyAction> =>
  async (dispatch, state: any): Promise<void> => {
    const { cars } = state().carReducer;
    cars.forEach(async (car: ICar) => {
      const isNotBrokenEngine = await apiEngine.switchEngineMode(
        car.id,
        'drive'
      );
      const currentWinner = getCurrentWinnerAndRaceStatus(state().carReducer);
      console.log('isNotBrokenEngine', isNotBrokenEngine);
      if (!currentWinner && isNotBrokenEngine) {
        console.log('currentWinner', currentWinner);
        const winner = await apiWinner.getWinner(car.id);
        console.log(winner);
        if (!winner) {
          timerRace.stopTimer();
          const winnerTime = timerRace.getTime();
          dispatch(
            createWinnerTC(car.name, {
              id: car.id,
              wins: car.wins || 0,
              time: winnerTime,
            })
          );
        } else dispatch(updateWinnerTC(car.name, winner));
      }

      if (!isNotBrokenEngine) dispatch(setEngineStatusIsBroken(car.id));
    });
  };

export const startRaceTC =
  (): ThunkAction<void, ICarsState, unknown, AnyAction> =>
  async (dispatch, state: any): Promise<void> => {
    const { cars } = state().carReducer;
    const requestsToSetStartedEngineCarMode: Promise<Response>[] = [];
    cars.forEach((car: ICar) => {
      const url = new URL('http://127.0.0.1:3000/engine');
      url.searchParams.append('id', `${car.id}`);
      url.searchParams.append('status', `${'started'}`);
      requestsToSetStartedEngineCarMode.push(fetch(`${url}`));
    });

    const timerRace = new Timer();

    Promise.all(requestsToSetStartedEngineCarMode).then((responses) => {
      const responsesJSON = responses.map((response) => response.json());

      Promise.all(responsesJSON).then((result) => {
        const calculatedResult = result.map((resItem) =>
          calcCarSpeed(resItem.velocity, resItem.distance)
        );
        dispatch(startRace(calculatedResult));
        timerRace.startTimer();
      });
      dispatch(checkEngineStatusTC(timerRace));
    });
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

export const resetCarsPositionTC =
  (): ThunkAction<void, ICarsState, unknown, AnyAction> =>
  async (dispatch, state: any): Promise<void> => {
    const { cars } = state().carReducer;

    dispatch(nullifyCurrentWinner());

    cars.forEach((car: ICar) => {
      dispatch(stopCarEngineTC(car.id, 'stopped'));
    });
  };
