import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { apiCars, apiEngine, apiWinner } from '../shared/api/api';
import { ICar, ICarsState } from '../shared/interfaces/carState-model';
import calcCarSpeed from '../shared/helperFunctions/calculateSpeed';
import { CreateCarRequest } from '../shared/interfaces/requests-to-API-models';
import {
  ICombineCarsState,
  ThunkActionType,
} from '../shared/interfaces/api-models';
import {
  COUNT_CARS_ON_PAGE,
  DrivingMode,
  FIRST_PAGE,
  INITIAL_CARS_NUMBER,
  NUMBER_OF_RANDOMLY_GENERATED_CARS,
  SliceName,
} from '../shared/variables';
import { IWinner } from '../shared/interfaces/winnersState-models';
import roundValue from '../shared/helperFunctions/roundValue';
import {
  CarID,
  CarParams,
  ISetAllCars,
  ISetRaceWinner,
  IStartRace,
  IToggleEngineMode,
  IUpdateWinners,
} from '../shared/interfaces/actions-models';
import generateAnyNumberCars from '../shared/helperFunctions/generateAnyNumberCars';
import prepareRequestsToStartRace from '../shared/helperFunctions/prepareRequestsToStartRace';

const carsSlice = createSlice({
  name: SliceName.CAR_SLICE,
  initialState: {
    cars: [],
    currentGaragePage: FIRST_PAGE,
    carsNumber: INITIAL_CARS_NUMBER,
    currentWinner: null,
    isStartedRace: false,
  } as ICarsState,
  reducers: {
    startRace: (state: ICarsState, action: PayloadAction<IStartRace>) => {
      return {
        ...state,
        isStartedRace: true,
        cars: state.cars.map((car, index) => {
          return {
            ...car,
            drivingMode: DrivingMode.STARTED,
            timeToFinish: action.payload[index],
          };
        }),
      };
    },
    updateWinnerWinCount: (
      state: ICarsState,
      action: PayloadAction<IUpdateWinners>
    ) => {
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
    nullifyCurrentRace: (state: ICarsState) => {
      return {
        ...state,
        currentWinner: null,
        isStartedRace: false,
      };
    },
    finishRace: (state: ICarsState) => {
      return {
        ...state,
        isStartedRace: false,
      };
    },
    setCurrentRaceWinner: (
      state: ICarsState,
      action: PayloadAction<ISetRaceWinner>
    ) => {
      const { carName, time } = action.payload;
      return {
        ...state,
        currentWinner: {
          carName,
          time,
        },
      };
    },
    toggleCarEngineMode: (
      state: ICarsState,
      action: PayloadAction<IToggleEngineMode>
    ) => {
      const { id, status, timeToFinish } = action.payload;
      return {
        ...state,
        cars: state.cars.map((car) => {
          if (car.id === id) {
            return {
              ...car,
              timeToFinish: timeToFinish || 0,
              drivingMode: status,
            };
          }
          return car;
        }),
      };
    },
    generateOneHundredRandomCars: (
      state: ICarsState,
      action: PayloadAction<ICar[]>
    ) => {
      const carsData = action.payload;
      return {
        ...state,
        cars: [...state.cars, ...carsData],
        carsNumber: state.carsNumber + NUMBER_OF_RANDOMLY_GENERATED_CARS,
      };
    },
    setEditCarMode: (state: ICarsState, action: PayloadAction<CarID>) => {
      const id = action.payload;
      return {
        ...state,
        cars: state.cars.map((car) => {
          if (car.id === id) {
            return { ...car, isEdit: true };
          }
          return car;
        }),
      };
    },
    updateCarParams: (state: ICarsState, action: PayloadAction<CarParams>) => {
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
    generateNewCar: (state: ICarsState, action: PayloadAction<ICar>) => {
      return {
        ...state,
        cars: [...state.cars, action.payload],
        carsNumber: state.carsNumber + 1,
      };
    },
    setAllCars: (state: ICarsState, action: PayloadAction<ISetAllCars>) => {
      const { cars, totalCarsNumber, currentGaragePage } = action.payload;
      return {
        ...state,
        cars: [...cars],
        currentGaragePage: currentGaragePage || state.currentGaragePage,
        carsNumber: totalCarsNumber || state.carsNumber,
      };
    },
  },
});

export default carsSlice.reducer;

export const {
  finishRace,
  nullifyCurrentRace,
  updateWinnerWinCount,
  setCurrentRaceWinner,
  startRace,
  toggleCarEngineMode,
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
    const carGenerationRequest = generateAnyNumberCars(
      NUMBER_OF_RANDOMLY_GENERATED_CARS
    );

    Promise.all(carGenerationRequest).then((carGenerationResponses) => {
      const carGenerationResponsesAsJSON = carGenerationResponses.map(
        (carGenerationResponse) => carGenerationResponse.json()
      );

      Promise.all(carGenerationResponsesAsJSON).then((carsData: ICar[]) =>
        dispatch(generateOneHundredRandomCars(carsData))
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

    const updatedWinnerResponse = await apiWinner.updateWinner({
      ...winnerParams,
      wins: newWinsCount,
      time: bestTime,
    });

    dispatch(
      updateWinnerWinCount({
        id: updatedWinnerResponse.id,
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
      dispatch(updateWinnerTC(name, winner, currentRaceWinnerTime));
    }
  };

export const checkCarsEngineStatusDuringRaceTC =
  (raceStart: number): ThunkActionType<ICombineCarsState> =>
  async (dispatch, getState): Promise<void> => {
    const { cars } = getState().carReducer;

    cars.forEach(async (car) => {
      const isEngineOk = await apiEngine.switchEngineMode(
        car.id,
        DrivingMode.DRIVE
      );

      const { currentWinner } = getState().carReducer;

      if (!currentWinner && isEngineOk) {
        const { isStartedRace } = getState().carReducer;

        if (!isStartedRace) return;

        await dispatch(finishRace());

        const winnerTime = roundValue(performance.now() - raceStart);
        dispatch(setCurrentRaceWinnerTC(car, winnerTime));
      }

      if (!isEngineOk)
        dispatch(
          toggleCarEngineMode({ id: car.id, status: DrivingMode.BREAKING })
        );
    });
  };

export const stopCarEngineTC =
  (id: number, status: string): ThunkActionType<ICombineCarsState> =>
  async (dispatch): Promise<void> => {
    const result = { id, status };

    await apiEngine.toggleEngine(id, status);

    dispatch(toggleCarEngineMode(result));
  };

export const startCarEngineTC =
  (id: number): ThunkActionType<ICombineCarsState> =>
  async (dispatch): Promise<void> => {
    const { velocity, distance } = await apiEngine.toggleEngine(
      id,
      DrivingMode.STARTED
    );

    dispatch(
      toggleCarEngineMode({
        timeToFinish: calcCarSpeed(velocity, distance),
        id,
        status: DrivingMode.STARTED,
      })
    );

    const isEngineOk = await apiEngine.switchEngineMode(id, DrivingMode.DRIVE);

    if (!isEngineOk)
      dispatch(toggleCarEngineMode({ id, status: DrivingMode.BREAKING }));
  };

export const startRaceTC =
  (): ThunkActionType<ICombineCarsState> =>
  async (dispatch, getState): Promise<void> => {
    const { cars } = getState().carReducer;
    const raceStartingRequest = prepareRequestsToStartRace(cars);

    Promise.all(raceStartingRequest).then((raceStartingResponses) => {
      const DataAboutRaceStarting = raceStartingResponses.map(
        (raceStartingResponse) => raceStartingResponse.json()
      );

      Promise.all(DataAboutRaceStarting).then((data) => {
        const calculatedResult = data.map((carRaceParams) =>
          calcCarSpeed(carRaceParams.velocity, carRaceParams.distance)
        );
        dispatch(startRace(calculatedResult));
      });

      const raceStarting = performance.now();
      dispatch(checkCarsEngineStatusDuringRaceTC(raceStarting));
    });
  };

export const resetRaceDataTC =
  (): ThunkActionType<ICombineCarsState> =>
  async (dispatch, getState): Promise<void> => {
    const { cars } = getState().carReducer;

    dispatch(nullifyCurrentRace());

    cars.forEach((car: ICar) => {
      dispatch(stopCarEngineTC(car.id, DrivingMode.STOPPED));
    });
  };
