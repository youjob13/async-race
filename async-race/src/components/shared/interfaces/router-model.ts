import { IPage } from './page-model';

export interface IRouter {
  changePath: (path: string) => void;
  getHash: () => string;
  routeToPage: () => any;
}

export interface IRoute {
  path: string;
  component: () => IPage;
}
