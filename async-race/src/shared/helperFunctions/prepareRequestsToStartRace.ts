import { ICar } from '../interfaces/carState-model';
import {
  AdditionalAPIURL,
  BASE_URL,
  DrivingMode,
  EngineSearchParams,
} from '../variables';

const prepareRequestsToStartRace = (cars: ICar[]): Promise<Response>[] => {
  const requests: Promise<Response>[] = [];

  cars.forEach(({ id }) => {
    const url = new URL(`${BASE_URL}/${AdditionalAPIURL.ENGINE}`);
    url.searchParams.append(EngineSearchParams.ID, `${id}`);
    url.searchParams.append(
      EngineSearchParams.STATUS,
      `${DrivingMode.STARTED}`
    );
    requests.push(fetch(`${url}`));
  });

  return requests;
};
export default prepareRequestsToStartRace;
