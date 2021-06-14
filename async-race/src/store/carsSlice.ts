import { AnyAction, createSlice, ThunkAction } from '@reduxjs/toolkit';
import { apiCars, apiEngine, apiWinner } from '../shared/api/api';
import {
  carNameRandomGenerator,
  colorRandomGenerator,
} from '../shared/helperFunctions/valueRandomGenerator';
import { ICar, ICarsState } from '../shared/interfaces/carState-model';
import calcCarSpeed from '../shared/helperFunctions/calculateSpeed';
import { getCurrentWinner } from './carsSelectors';
import Timer from '../shared/Timer';

export const COUNT_CARS_ON_PAGE = 7;

type CarParams = { name: string; color: string };

const carsSlice = createSlice({
  name: 'carSlice',
  initialState: {
    cars: [],
    currentGaragePage: 1,
    carsNumber: 0,
    currentWinner: null,
  } as ICarsState,
  reducers: {
    updateWinnersWinCount: (state: ICarsState, action) => {
      const { id, wins } = action.payload;
      return {
        ...state,
        cars: state.cars.map((car) => {
          if (car.id === id) {
            return {
              ...car,
              wins,
            };
          }
          return car;
        }),
      };
    },
    resetCarsPositionAndNullifyCurrentWinner: (state: ICarsState) => {
      return {
        ...state,
        currentWinner: null,
      };
    },
    setCurrentRaceWinner: (state: ICarsState, action) => {
      return {
        ...state,
        currentWinner: action.payload,
      };
    },
    startRace: (state: ICarsState, action) => {
      return {
        ...state,
        cars: state.cars.map((car, index) => {
          return {
            ...car,
            drivingMode: 'started',
            timeToFinish: action.payload[index],
          };
        }),
      };
    },
    resetCarPositionAndStopEngine: (state: ICarsState) => {
      return {
        ...state,
        cars: state.cars.map((car) => {
          return {
            id: car.id,
            isEdit: car.isEdit,
            drivingMode: 'stopped',
            name: car.name,
            color: car.color,
          };
        }),
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
    setAllCars: (state: ICarsState, action) => {
      const { res, totalCarsNumber, currentGaragePage } = action.payload;

      return {
        cars: [...res],
        currentGaragePage,
        carsNumber: totalCarsNumber,
        currentWinner: state.currentWinner,
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
    // deleteCar: (state: ICar, action) => {
    //   return {
    //     cars: state.cars.filter((car) => car.id !== action.payload),
    //     currentGaragePage: state.currentGaragePage,
    //     carsNumber: state.carsNumber,
    //   };
    // },
    setEditMode: (state: ICarsState, action) => {
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
  },
});

export default carsSlice.reducer;

export const {
  updateWinnersWinCount,
  resetCarsPositionAndNullifyCurrentWinner,
  setCurrentRaceWinner,
  startRace,
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

    const isNotBroken = await apiEngine.switchEngineMode(id, 'drive');
    console.log('isNotBroken', isNotBroken);

    if (!isNotBroken) dispatch(setEngineStatusIsBroken(id));
  };

export const updateWinnerTC =
  (
    carName: string,
    data: {
      id: number;
      wins: number;
      time: number;
    }
  ): ThunkAction<void, ICarsState, unknown, AnyAction> =>
  async (dispatch): Promise<void> => {
    // const { id, wins, time, name } = data;
    const response = await apiWinner.updateWinner({
      ...data,
      wins: data.wins + 1,
    });
    dispatch(updateWinnersWinCount({ id: response.id, wins: response.wins }));
    console.log(response);
    dispatch(setCurrentRaceWinner(carName));
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
    // const { name, id, wins, time } = winnerParams;
    const response = await apiWinner.createWinner(winnerParams);
    console.log(response);
    dispatch(updateWinnerTC(carName, response));
  };

export const startRaceTC =
  (): ThunkAction<void, ICarsState, unknown, AnyAction> =>
  async (dispatch, state: any): Promise<void> => {
    const { cars } = state().carReducer;
    const requestsToSetStartedEngineMode: Promise<Response>[] = [];
    cars.forEach((car: ICar) => {
      const url = new URL('http://127.0.0.1:3000/engine');
      url.searchParams.append('id', `${car.id}`);
      url.searchParams.append('status', `${'started'}`);
      requestsToSetStartedEngineMode.push(fetch(`${url}`));
    });

    const timerRace = new Timer();

    Promise.all(requestsToSetStartedEngineMode).then((responses) => {
      const responsesJSON = responses.map((response) => response.json());

      Promise.all(responsesJSON).then((result) => {
        const calculatedResult = result.map((resItem) =>
          calcCarSpeed(resItem.velocity, resItem.distance)
        );
        dispatch(startRace(calculatedResult));
        timerRace.startTimer();
      });

      cars.forEach(async (car: ICar) => {
        const isNotBroken = await apiEngine.switchEngineMode(car.id, 'drive');
        const currentWinner = getCurrentWinner(state().carReducer);
        console.log('isNotBroken', isNotBroken);
        if (!currentWinner && isNotBroken) {
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

        if (!isNotBroken) dispatch(setEngineStatusIsBroken(car.id));
      });
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

    dispatch(resetCarsPositionAndNullifyCurrentWinner());

    cars.forEach((car: ICar) => {
      dispatch(stopCarEngineTC(car.id, 'stopped'));
    });
  };
