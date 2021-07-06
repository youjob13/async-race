import { IWinner } from '../interfaces/winnersState-models';
import { AdditionalAPIURL, BASE_URL, RequestMethod } from '../variables';

const prepareRequestForWinners = (winners: IWinner[]): Promise<Response>[] => {
  const requests = [];

  for (let i = 0; i < winners.length; i++) {
    const url = new URL(
      `${BASE_URL}/${AdditionalAPIURL.GARAGE}/${winners[i].id}`
    );

    requests.push(
      fetch(`${url}`, {
        method: RequestMethod.GET,
      })
    );
  }

  return requests;
};

export default prepareRequestForWinners;
