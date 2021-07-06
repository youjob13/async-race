import {
  AdditionalAPIURL,
  BASE_URL,
  ContentType,
  RequestMethod,
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
      fetch(`${BASE_URL}/${AdditionalAPIURL.GARAGE}`, {
        method: RequestMethod.POST,
        headers: {
          'Content-Type': ContentType.APPLICATION_JSON,
        },
        body: JSON.stringify(randomGeneratedCar),
      })
    );
  }

  return requests;
};
export default generateAnyNumberCars;
