export const BASE_URL = 'http://127.0.0.1:3000';
export const GENERATE_ONE_HUNDRED_RANDOM_CARS_REQUEST_METHOD = 'POST';
export const GENERATE_ONE_HUNDRED_RANDOM_CARS_REQUEST_HEADERS: {
  [key: string]: string;
} = {
  'Content-Type': 'application/json;charset=utf-8',
};
export const INITIAL_CARS_NUMBER = 0;
export const INITIAL_WINNERS_NUMBER = 0;
export const NUMBER_OF_RANDOMLY_GENERATED_CARS = 100;
export const COUNT_CARS_ON_PAGE = 7;
export const LIMIT_WINNERS_ON_PAGE = 10;
export const DEFAULT_CAR_NAME = 'default car';
export const DEFAULT_CAR_COLOR = '#000';
export const ZERO_INDEX = 0;
export const FIRST_INDEX = 1;
export const FIRST_PAGE = 1;
export const WINNERS_TABLE_TITLES = [
  'Number',
  'Car',
  'Name',
  'Wins',
  'Best time',
];
export const EMPTY_TABLE = 'Winners table is empty';

export enum DrivingMode {
  STARTED = 'started',
  STOPPED = 'stopped',
  DRIVE = 'drive',
  BROKEN = 'broken',
}

export enum RequestMethod {
  POST = 'POST',
  GET = 'GET',
  DELETE = 'DELETE',
  PUT = 'PUT',
}

export enum WinnersTitles {
  NUMBER = 'Number',
  CAR = 'Car',
  NAME = 'Name',
  WINS = 'Wins',
  BEST_TIME = 'Best time',
}

export enum WinnersSorting {
  TIME = 'time',
  WINS = 'wins',
}
export enum WinnersSortingOrder {
  ASC = 'ASC',
  DESC = 'DESC',
}

export enum Route {
  ROOT = '',
  GARAGE = 'garage',
  WINNERS = 'winners',
}

export enum Tag {
  HEADER = 'header',
  DIV = 'div',
  P = 'p',
  A = 'a',
  INPUT = 'input',
  MAIN = 'main',
  BUTTON = 'button',
  OUTPUT = 'output',
  TABLE = 'table',
  TR = 'tr',
  TD = 'td',
  TH = 'th',
  TBODY = 'tbody',
}

export enum Attribute {
  HREF = 'href',
  DISABLED = 'disabled',
}

export const RootElemId = 'app';
export const H1Class = 'h1-title';
export const ButtonClass = 'button';
export const EmptyString = '';

export enum HeaderClasses {
  HEADER = 'header',
  BUTTONS_WRAP = 'header__buttons-wrapper',
  BUTTON = 'header__button',
  BUTTON_ACTIVE = 'active',
}

export enum GarageClasses {
  GARAGE = 'garage',
  HEADER = 'garage__header',
  BUTTON = 'garage__button',
  CONTROL = 'garage__control',
  RACE = 'garage__race',
  GENERATE_CAR = 'garage__generate-car',
  CAR_WRAPPER = 'generate-car__wrapper',
  GENERATE_CAR_INPUT = 'generate-car__input',
  GENERATE_CAR_INPUT_NAME = 'generate-car__input_name',
  GENERATE_CAR_INPUT_COLOR = 'generate-car__input_color',
  GENERATE_CAR_BUTTON = 'generate-car__button',
  BUTTONS_WRAPPER = 'garage__buttons-wrapper',
  CARS_NUMBER = 'garage__cars-number',
  CURRENT_PAGE = 'garage__current-page',
  INNER = 'garage__inner',
  FOOTER = 'garage__footer',
  PAGES = 'garage__pages',
  ARROW = 'arrow',
  ARROW_LEFT = 'arrow-left',
  ARROW_RIGHT = 'arrow-right',
}

export enum WinnersClasses {
  WINNERS = 'winners',
  NUMBER = 'winners__number',
  PAGE_NUMBER = 'winners__page-number',
  TABLE = 'winners__table',
  PAGES_CONTROLS = 'winners__pages-controls',
  PAGE_CONTROL = 'winners__page-control',
  PREV_BUTTON = 'prev-btn',
  NEXT_BUTTON = 'next-btn',
  TABLE_TITLES_WRAPPER = 'winners__table_titles-wrapper',
  TABLE_TITLE = 'winners__table_title',
  TIME = 'time',
  WINS = 'wins',
  TABLE_WINNERS_WRAPPER = 'winners__table_winners-wrapper',
  WINNER = 'winner',
  CELL = 'cell',
  WINNER_NUMBER = 'winner__number',
  WINNER_CAR = 'winner__car',
  WINNER_NAME = 'winner__name',
}

export enum Popup {
  POPUP_CONTENT = 'popup__content',
}

export enum ErrorContent {
  APP_INIT = 'Root elem is not defined',
}

export enum EventName {
  CLICK = 'click',
}

export enum SliceName {
  CAR_SLICE = 'carSlice',
  WINNERS_SLICE = 'winnersSlice',
}
