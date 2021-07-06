import { DIGITS_NUMBER_AFTER_DOT, ONE_SECOND } from '../variables';

const roundValue = (value: number): number => {
  return Number((value / ONE_SECOND).toFixed(DIGITS_NUMBER_AFTER_DOT));
};

export default roundValue;
