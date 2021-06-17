const roundValue = (value: number): number => {
  return Number((value / 1000).toFixed(2));
};

export default roundValue;
