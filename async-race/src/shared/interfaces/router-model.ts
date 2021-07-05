export interface IRouter {
  changePath: (path: string) => void;
  getHash: () => string;
  routeToPage: () => void;
  getCurrentPage: () => HTMLElement | '404 error';
}

export interface IRoute {
  path: string;
  component: () => HTMLElement;
}
