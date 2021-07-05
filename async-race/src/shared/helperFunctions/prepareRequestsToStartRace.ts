import { ICar } from '../interfaces/carState-model';
import { BASE_URL, DrivingMode } from '../variables';

const prepareRequestsToStartRace = (cars: ICar[]): Promise<Response>[] => {
  const request: Promise<Response>[] = [];

  cars.forEach((car: ICar) => {
    const url = new URL(`${BASE_URL}/engine`);
    url.searchParams.append('id', `${car.id}`);
    url.searchParams.append('status', `${DrivingMode.STARTED}`);
    request.push(fetch(`${url}`));
  });
  return request;
};
export default prepareRequestsToStartRace;
