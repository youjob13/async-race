import { MAX_VALUE, MIN_VALUE } from '../variables';

const randomNumberInRange = (min = MIN_VALUE, max = MAX_VALUE) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

export const carNameRandomGenerator = (): string => {
  const brands = [
    'Opel',
    'BMW',
    'Mercedes',
    'Lada',
    'Volkswagen',
    'Volvo',
    'Dodge',
    'Alfa Romeo',
    'Audi',
    'Bentley',
    'Citroen',
    'Ferrari',
    'Porshe',
  ];
  const model = [
    'Astra',
    'X5',
    'Benz',
    'Priora',
    'Polo',
    'xc90',
    'Challenger',
    '911',
    'Cayenne',
    '458 italia',
    'c4',
  ];
  return `${brands[randomNumberInRange(brands.length)]} ${
    model[randomNumberInRange(model.length)]
  }`;
};

export const colorRandomGenerator = (): string => {
  return `#${`${Math.random().toString(16)}000000`.substring(2, 8)}`;
};
