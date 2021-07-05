import {
  BASE_URL,
  GENERATE_ONE_HUNDRED_RANDOM_CARS_REQUEST_HEADERS,
  GENERATE_ONE_HUNDRED_RANDOM_CARS_REQUEST_METHOD,
} from '../variables';
import {
  carNameRandomGenerator,
  colorRandomGenerator,
} from './valueRandomGenerator';

const generateAnyNumberCars = (numberCars: number): Promise<Response>[] => {
  const requests = [];
  for (let i = 0; i < numberCars; i++) {
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
  return requests;
};
export default generateAnyNumberCars;
