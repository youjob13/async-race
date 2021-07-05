import { IWinner } from '../interfaces/winnersState-models';
import { BASE_URL, RequestMethod } from '../variables';

const prepareRequestForWinners = (winners: IWinner[]): Promise<Response>[] => {
  const request = [];

  for (let i = 0; i < winners.length; i++) {
    const url = new URL(`${BASE_URL}/garage/${winners[i].id}`);

    request.push(
      fetch(`${url}`, {
        method: RequestMethod.GET,
      })
    );
  }

  return request;
};

export default prepareRequestForWinners;
