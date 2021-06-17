import { createSlice } from '@reduxjs/toolkit';
import { apiCars, apiEngine, apiWinner } from '../shared/api/api';
import {
  carNameRandomGenerator,
  colorRandomGenerator,
} from '../shared/helperFunctions/valueRandomGenerator';
import { ICar, ICarsState } from '../shared/interfaces/carState-model';
import calcCarSpeed from '../shared/helperFunctions/calculateSpeed';
import { CreateCarRequest } from '../shared/interfaces/requests-to-API-models';
import {
  ICombineCarsState,
  ThunkActionType,
} from '../shared/interfaces/api-models';
import {
  BASE_URL,
  COUNT_CARS_ON_PAGE,
  GENERATE_ONE_HUNDRED_RANDOM_CARS_REQUEST_HEADERS,
  GENERATE_ONE_HUNDRED_RANDOM_CARS_REQUEST_METHOD,
  NUMBER_OF_RANDOMLY_GENERATED_CARS,
} from '../shared/variables';
import { IWinner } from '../shared/interfaces/winnersState-models';
import roundValue from '../shared/helperFunctions/roundValue';

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
    toggleCarEngineMode: (state: ICarsState, action) => {
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
    generateOneHundredRandomCars: (state: ICarsState, action) => {
      return {
        ...state,
        cars: [...state.cars, ...action.payload],
        carsNumber: state.carsNumber + NUMBER_OF_RANDOMLY_GENERATED_CARS,
      };
    },
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
              ...car,
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
      const { cars, totalCarsNumber, currentGaragePage } = action.payload;

      return {
        ...state,
        cars: [...cars],
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
  toggleCarEngineMode,
  setEngineStatusIsBroken,
  setAllCars,
  generateOneHundredRandomCars,
  setEditCarMode,
  updateCarParams,
  generateNewCar,
} = carsSlice.actions;

export const getAllCarsTC =
  (
    currentGaragePage?: number,
    limit?: number
  ): ThunkActionType<ICombineCarsState> =>
  async (dispatch): Promise<void> => {
    const { cars, totalCarsNumber } = await apiCars.getAllCars(
      currentGaragePage,
      limit
    );
    dispatch(setAllCars({ cars, totalCarsNumber, currentGaragePage }));
  };

export const toggleGaragePageTC =
  (isIncrement: boolean): ThunkActionType<ICombineCarsState> =>
  async (dispatch, getState): Promise<void> => {
    let { currentGaragePage } = getState().carReducer;
    currentGaragePage = isIncrement
      ? currentGaragePage + 1
      : currentGaragePage - 1;
    dispatch(getAllCarsTC(currentGaragePage, COUNT_CARS_ON_PAGE));
  };

export const generateNewCarTC =
  (carParams: CreateCarRequest): ThunkActionType<ICombineCarsState> =>
  async (dispatch): Promise<void> => {
    const newCar = await apiCars.createCar(carParams);
    dispatch(generateNewCar(newCar));
  };

export const updateCarParamsTC =
  (newCarParams: ICar): ThunkActionType<ICombineCarsState> =>
  async (dispatch): Promise<void> => {
    const updatedCar = await apiCars.updateCar(newCarParams);
    dispatch(updateCarParams(updatedCar));
  };

export const deleteCarTC =
  (id: number): ThunkActionType<ICombineCarsState> =>
  async (dispatch, getState): Promise<void> => {
    const { currentGaragePage } = getState().carReducer;
    await apiCars.deleteCar(id);
    await dispatch(getAllCarsTC(currentGaragePage, COUNT_CARS_ON_PAGE));

    const { cars } = getState().carReducer;
    if (!cars.length && currentGaragePage !== 1)
      dispatch(toggleGaragePageTC(false));
  };

export const generateOneHundredRandomCarsTC =
  (): ThunkActionType<ICombineCarsState> =>
  async (dispatch): Promise<void> => {
    const requests: Promise<Response>[] = [];
    for (let i = 0; i < NUMBER_OF_RANDOMLY_GENERATED_CARS; i++) {
      const randomGeneratedCar = {
        name: carNameRandomGenerator(),
        color: colorRandomGenerator(),
      };
      requests.push(
        fetch(`${BASE_URL}/garage`, {
          method: GENERATE_ONE_HUNDRED_RANDOM_CARS_REQUEST_METHOD,
          headers: GENERATE_ONE_HUNDRED_RANDOM_CARS_REQUEST_HEADERS,
          body: JSON.stringify(randomGeneratedCar),
        })
      );
    }

    Promise.all(requests).then((responses) => {
      const responsesJSON = responses.map((response) => response.json());

      Promise.all(responsesJSON).then((result: ICar[]) =>
        dispatch(generateOneHundredRandomCars(result))
      );
    });
  };

export const updateWinnerTC =
  (
    carName: string,
    winnerParams: IWinner,
    currentRaceWinnerTime: number
  ): ThunkActionType<ICombineCarsState> =>
  async (dispatch): Promise<void> => {
    const newWinsCount = winnerParams.wins + 1;
    const bestTime =
      currentRaceWinnerTime < winnerParams.time
        ? currentRaceWinnerTime
        : winnerParams.time;

    const response = await apiWinner.updateWinner({
      ...winnerParams,
      wins: newWinsCount,
      time: bestTime,
    });

    dispatch(
      updateWinnersWinCount({
        id: response.id,
        newWinsCount,
      })
    );
    dispatch(setCurrentRaceWinner({ carName, time: currentRaceWinnerTime }));
  };

export const createWinnerTC =
  (
    carName: string,
    winnerParams: IWinner
  ): ThunkActionType<ICombineCarsState> =>
  async (dispatch): Promise<void> => {
    const newWinner = await apiWinner.createWinner(winnerParams);
    dispatch(updateWinnerTC(carName, newWinner, newWinner.time));
  };

export const setCurrentRaceWinnerTC =
  (
    winnerCar: ICar,
    currentRaceWinnerTime: number
  ): ThunkActionType<ICombineCarsState> =>
  async (dispatch): Promise<void> => {
    const { name, id, wins } = winnerCar;

    const winner = await apiWinner.getWinner(id);

    if (!winner) {
      dispatch(
        createWinnerTC(name, {
          id,
          wins: wins || 0,
          time: currentRaceWinnerTime,
        })
      );
    } else {
      const newWinnerParams = {
        ...winner,
        time: currentRaceWinnerTime,
      };
      dispatch(updateWinnerTC(name, winner, currentRaceWinnerTime));
    }
  };

export const checkCarsEngineStatusDuringRaceTC =
  (raceStart: number): ThunkActionType<ICombineCarsState> =>
  async (dispatch, getState): Promise<void> => {
    const { cars } = getState().carReducer;

    cars.forEach(async (car: ICar) => {
      const isNotBrokenEngine = await apiEngine.switchEngineMode(
        car.id,
        'drive'
      );

      const { currentWinner } = getState().carReducer;

      if (!currentWinner && isNotBrokenEngine) {
        const winnerTime = roundValue(performance.now() - raceStart);
        dispatch(setCurrentRaceWinnerTC(car, winnerTime));
      }

      if (!isNotBrokenEngine) dispatch(setEngineStatusIsBroken(car.id));
    });
  };

export const stopCarEngineTC =
  (id: number, status: string): ThunkActionType<ICombineCarsState> =>
  async (dispatch): Promise<void> => {
    await apiEngine.toggleEngine(id, status);
    const result = { timeToFinish: 0, id, status };
    dispatch(toggleCarEngineMode(result));
  };

export const startCarEngineTC =
  (id: number): ThunkActionType<ICombineCarsState> =>
  async (dispatch): Promise<void> => {
    const { velocity, distance } = await apiEngine.toggleEngine(id, 'started');
    dispatch(
      toggleCarEngineMode({
        timeToFinish: calcCarSpeed(velocity, distance),
        id,
        status: 'started',
      })
    );

    const isNotBrokenEngine = await apiEngine.switchEngineMode(id, 'drive');
    console.log('isNotBrokenEngine', isNotBrokenEngine);

    if (!isNotBrokenEngine) dispatch(setEngineStatusIsBroken(id));
  };

export const startRaceTC =
  (): ThunkActionType<ICombineCarsState> =>
  async (dispatch, getState): Promise<void> => {
    const { cars } = getState().carReducer;
    const requestsToSetStartedEngineCarMode: Promise<Response>[] = [];

    cars.forEach((car: ICar) => {
      const url = new URL(`${BASE_URL}/engine`);
      url.searchParams.append('id', `${car.id}`);
      url.searchParams.append('status', `${'started'}`);
      requestsToSetStartedEngineCarMode.push(fetch(`${url}`));
    });

    const raceStart = performance.now();

    Promise.all(requestsToSetStartedEngineCarMode).then((responses) => {
      const responsesJSON = responses.map((response) => response.json());

      Promise.all(responsesJSON).then((result) => {
        const calculatedResult = result.map((resItem) =>
          calcCarSpeed(resItem.velocity, resItem.distance)
        );
        dispatch(startRace(calculatedResult));
      });

      dispatch(checkCarsEngineStatusDuringRaceTC(raceStart));
    });
  };

export const resetCarsPositionAndNullifyCurrentWinnerTC =
  (): ThunkActionType<ICombineCarsState> =>
  async (dispatch, getState): Promise<void> => {
    const { cars } = getState().carReducer;

    dispatch(nullifyCurrentWinner());

    cars.forEach((car: ICar) => {
      dispatch(stopCarEngineTC(car.id, 'stopped'));
    });
  };
